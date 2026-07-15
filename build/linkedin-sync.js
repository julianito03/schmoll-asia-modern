#!/usr/bin/env node
// Syncs the Schmoll Asia Pacific LinkedIn company feed into the website.
//
// Fetches the public company page (crawler view — no login), parses the last
// ~10 posts, downloads any new post images, and merges everything into
// site/assets/data/linkedin.json (accumulative: posts that drop off the feed
// stay in the file). The news page renders this JSON client-side.
//
// Usage:  node build/linkedin-sync.js [--deploy]
//   --deploy  after a change: commit, push main, refresh gh-pages branch
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'site/assets/data/linkedin.json');
const IMGDIR = path.join(ROOT, 'site/assets/img/linkedin');
const FEED_URL = 'https://www.linkedin.com/company/schmoll-asia-pacific';
// LinkedIn serves a public, JSON-LD-annotated page to search crawlers
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

// Map Mathematical Alphanumeric Symbols (𝗯𝗼𝗹𝗱/𝘪𝘵𝘢𝘭𝘪𝘤 letters LinkedIn posts use
// for emphasis) back to plain ASCII so site typography and screen readers work.
function plainText(s) {
  return [...s].map((ch) => {
    const cp = ch.codePointAt(0);
    if (cp >= 0x1d400 && cp <= 0x1d7cb) {
      const off = (cp - 0x1d400) % 52;
      return String.fromCharCode(off < 26 ? 65 + off : 97 + off - 26);
    }
    if (cp >= 0x1d7ce && cp <= 0x1d7ff) return String.fromCharCode(48 + (cp - 0x1d7ce) % 10);
    return ch;
  }).join('');
}

// LinkedIn activity IDs are snowflakes: top bits = ms since epoch
function urnDate(id) {
  return new Date(Number(BigInt(id) >> 22n)).toISOString();
}

function postUrl(id) {
  return 'https://www.linkedin.com/feed/update/urn:li:activity:' + id;
}

async function main() {
  const deploy = process.argv.includes('--deploy');
  const res = await fetch(FEED_URL, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error('feed fetch failed: HTTP ' + res.status);
  const html = await res.text();
  if (/authwall|as_signup/.test(html.slice(0, 2000)) && !html.includes('urn:li:activity')) {
    throw new Error('got authwall instead of public page — try again later / different IP');
  }

  // canonical URLs + exact dates from JSON-LD where present
  const ldByUrn = {};
  const ldm = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)<\/script>/);
  if (ldm) {
    try {
      for (const e of JSON.parse(ldm[1])['@graph'] || []) {
        if (e['@type'] !== 'DiscussionForumPosting') continue;
        const id = (e.mainEntityOfPage.match(/activity-(\d+)/) || [])[1];
        if (id) ldByUrn[id] = { url: e.mainEntityOfPage, date: e.datePublished };
      }
    } catch { /* JSON-LD is optional; article parsing below is the source of truth */ }
  }

  const posts = [];
  for (const art of html.split(/<article\b/).slice(1)) {
    const urn = (art.match(/data-activity-urn="urn:li:activity:(\d+)"/) || [])[1];
    if (!urn) continue;
    // commentary text
    const pm = art.match(/<p[^>]*attributed-text-segment-list__content[^>]*>([\s\S]*?)<\/p>/);
    let text = '';
    if (pm) {
      text = plainText(decode(pm[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''))).trim();
    }
    // post images (lazy-loaded); skip avatars/logos/ghosts
    const imgs = [...art.matchAll(/data-delayed-url="(https:\/\/media\.licdn\.com\/[^"]+)"/g)]
      .map(m => decode(m[1]))
      .filter(u => !/profile-displayphoto|company-logo|ghost/.test(u));
    const video = (art.match(/data-sources="([^"]+)"/) || [])[1];
    posts.push({
      id: urn,
      url: ldByUrn[urn]?.url || postUrl(urn),
      date: ldByUrn[urn]?.date || urnDate(urn),
      text,
      images: [...new Set(imgs)],
      hasVideo: !!video,
    });
  }
  if (!posts.length) throw new Error('no posts parsed — LinkedIn markup may have changed');

  // merge with existing data (accumulative)
  let existing = [];
  try { existing = JSON.parse(fs.readFileSync(DATA, 'utf8')).posts; } catch { /* first run */ }
  const byId = new Map(existing.map(p => [p.id, p]));
  let fresh = 0;
  for (const p of posts) {
    if (!byId.has(p.id)) fresh++;
    byId.set(p.id, { ...byId.get(p.id), ...p });
  }
  const merged = [...byId.values()].sort((a, b) => b.id.localeCompare(a.id));

  // download new images to local files (licdn URLs expire), rewrite refs
  fs.mkdirSync(IMGDIR, { recursive: true });
  for (const p of merged) {
    const local = [];
    for (let i = 0; i < (p.images || []).length; i++) {
      const src = p.images[i];
      if (!/^https:\/\/media\.licdn\.com\//.test(src)) { local.push(src); continue; }
      const file = `assets/img/linkedin/${p.id}-${i}.jpg`;
      const abs = path.join(ROOT, 'site', file);
      if (!fs.existsSync(abs)) {
        const r = await fetch(src, { headers: { 'User-Agent': UA } });
        if (r.ok) fs.writeFileSync(abs, Buffer.from(await r.arrayBuffer()));
        else { local.push(src); continue; }
        await new Promise(s => setTimeout(s, 1000));
      }
      local.push(file);
    }
    p.images = local;
  }

  const out = { company: 'Schmoll Asia Pacific', source: FEED_URL, updated: new Date().toISOString(), posts: merged };
  const before = fs.existsSync(DATA) ? fs.readFileSync(DATA, 'utf8') : '';
  const after = JSON.stringify(out, null, 1);
  fs.mkdirSync(path.dirname(DATA), { recursive: true });
  fs.writeFileSync(DATA, after);
  console.log(`feed: ${posts.length} posts | total stored: ${merged.length} | new: ${fresh}`);

  if (deploy && before !== after) {
    const run = c => execSync(c, { cwd: ROOT, stdio: 'inherit' });
    run('node build/build.js'); // news.html bakes the feed at build time
    run('git add site');
    run('git commit -m "Sync LinkedIn feed"');
    run('git push origin main');
    // refresh gh-pages from site/ (manual-deploy convention of this repo)
    run('git branch -f gh-pages $(git subtree split -P site main 2>/dev/null | tail -1)');
    run('git push -f origin gh-pages');
    console.log('deployed to gh-pages');
  } else if (deploy) {
    console.log('no changes — nothing to deploy');
  }
}

main().catch(e => { console.error('linkedin-sync FAILED:', e.message); process.exit(1); });
