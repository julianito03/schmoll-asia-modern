#!/usr/bin/env node
// Extracts clean article content from the WP REST dump (content/news/posts-raw.json)
// into content/news/posts.json. The live posts are Elementor-built, so content.rendered
// is Elementor markup; we keep only real content tags and normalize image URLs.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/news/posts-raw.json'), 'utf8'));

// EN canonical posts (id → machine-readable slug used on the new site)
const EN_IDS = [7923, 7848, 7577, 7284, 7152, 7123, 7009, 6938, 6796, 6672, 6480, 5876, 3441, 3217];

// language of a raw post, from its Polylang category slugs / link
function langOf(post) {
  const cats = (post._embedded?.['wp:term']?.[0] || []).map(t => t.slug).join(',');
  if (/\/zh\//.test(post.link)) return 'zh';
  if (/cn-trad|zh-hk/.test(cats)) return 'zh-hk';
  if (/korea/.test(cats)) return 'ko';
  if (/malay/.test(cats)) return 'ms';
  if (/thai|-th\b/.test(cats)) return 'th';
  return 'en';
}

function decode(s) {
  return s
    .replace(/&#8217;|&rsquo;/g, '’').replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“').replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–').replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8230;|&hellip;/g, '…').replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"');
}

// normalize a WP/Photon image URL to the origin full-size file
function normImg(src) {
  let u = src.replace(/^https?:\/\/i\d\.wp\.com\//, 'https://');
  u = u.split('?')[0];
  // strip WP intermediate size suffix -123x456 before extension
  u = u.replace(/-\d{2,4}x\d{2,4}(?=\.\w{3,4}$)/, '');
  return u;
}

function extract(html) {
  if (!html) return { blocks: [], images: [] };
  let h = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');

  const blocks = [];
  const images = [];
  // sequential scan: headings, images (+optional caption), text-editor paragraphs/lists
  const re = /<h([1-6])[^>]*elementor-heading-title[^>]*>([\s\S]*?)<\/h\1>|<img\b([^>]*)>|<figcaption[^>]*>([\s\S]*?)<\/figcaption>|<(p|li)\b[^>]*>([\s\S]*?)<\/\5>/gi;
  let m;
  while ((m = re.exec(h)) !== null) {
    if (m[1]) { // heading
      const text = decode(m[2].replace(/<[^>]+>/g, '')).trim();
      if (text) blocks.push({ t: 'h', level: Math.max(2, +m[1]), text });
    } else if (m[3] !== undefined) { // image
      const attrs = m[3];
      const srcM = attrs.match(/\bsrc="([^"]+)"/i);
      const altM = attrs.match(/\balt="([^"]*)"/i);
      if (!srcM) continue;
      let src = srcM[1];
      if (/^data:/.test(src)) {
        const ds = attrs.match(/\bdata-(?:lazy-)?src="([^"]+)"/i);
        if (!ds) continue;
        src = ds[1];
      }
      src = normImg(src);
      if (/gtranslate|\/flags\/|emoji|gravatar|pixel\.wp\.com/i.test(src)) continue;
      if (!images.includes(src)) images.push(src);
      const prev = blocks[blocks.length - 1];
      if (!(prev && prev.t === 'img' && prev.src === src)) {
        blocks.push({ t: 'img', src, alt: decode(altM ? altM[1] : '') });
      }
    } else if (m[4] !== undefined) { // figcaption
      const text = decode(m[4].replace(/<[^>]+>/g, '')).trim();
      const prev = blocks[blocks.length - 1];
      if (text && prev && prev.t === 'img') prev.caption = text;
    } else { // p / li
      const tag = m[5].toLowerCase();
      const inner = m[6];
      // keep inline emphasis + links, drop everything else
      let text = inner
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<(?!\/?(strong|b|em|i|a)\b)[^>]+>/gi, '')
        .replace(/<(strong|b)\b[^>]*>/gi, '<strong>').replace(/<\/b>/gi, '</strong>')
        .replace(/<(em|i)\b[^>]*>/gi, '<em>').replace(/<\/i>/gi, '</em>')
        .replace(/<a\b[^>]*href="([^"]*)"[^>]*>/gi, '<a href="$1">');
      text = decode(text).trim();
      if (!text || /^(\s|&nbsp;)*$/.test(text)) continue;
      blocks.push({ t: tag, html: text });
    }
  }
  // merge consecutive li into lists
  const merged = [];
  for (const b of blocks) {
    if (b.t === 'li') {
      const prev = merged[merged.length - 1];
      if (prev && prev.t === 'ul') prev.items.push(b.html);
      else merged.push({ t: 'ul', items: [b.html] });
    } else merged.push(b);
  }
  return { blocks: merged, images };
}

// Drop redundant lead-in blocks the source posts carry (own title repeat,
// standalone date line, hashtag line) — the page template renders those itself.
function cleanLead(blocks, title) {
  const isJunk = (b) => {
    // any heading before the first paragraph duplicates the page banner title
    if (b.t === 'h') return true;
    const junkLine = (raw) => {
      const line = raw.replace(/<[^>]+>/g, '').trim();
      if (!line) return true;
      if (/^(#[\w一-鿿]+\s*)+$/.test(line)) return true;                     // hashtags
      return /^\w+ \d{1,2},? \d{4}$/.test(line) || /^\d{4}\s*年.{0,12}日?$/.test(line); // date line
    };
    if (b.t === 'ul') return (b.items || []).every(junkLine);
    return junkLine(b.html || '');
  };
  while (blocks.length && blocks[0].t !== 'img' && isJunk(blocks[0])) blocks.shift();
  // same junk can sit right after a leading image
  if (blocks[0]?.t === 'img') while (blocks.length > 1 && blocks[1].t !== 'img' && isJunk(blocks[1])) blocks.splice(1, 1);
  return blocks;
}

// group translations: Polylang siblings share the exact post date
const byDate = {};
for (const p of RAW) (byDate[p.date] = byDate[p.date] || []).push(p);

const out = [];
for (const id of EN_IDS) {
  const en = RAW.find(p => p.id === id);
  const enTitle = decode(en.title.rendered);
  const { blocks: rawBlocks, images } = extract(en.content.rendered);
  const blocks = cleanLead(rawBlocks, enTitle);
  const featured = en._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  if (featured) images.unshift(normImg(featured));
  const translations = {};
  for (const sib of byDate[en.date] || []) {
    if (sib.id === id) continue;
    const lang = langOf(sib);
    const t = extract(sib.content.rendered);
    const tTitle = decode(sib.title.rendered);
    translations[lang] = { title: tTitle, blocks: cleanLead(t.blocks, tTitle) };
    for (const img of t.images) if (!images.includes(img)) images.push(img);
  }
  out.push({
    id,
    slug: en.slug.replace(/-\d+$/, ''),
    date: en.date.slice(0, 10),
    title: decode(en.title.rendered),
    category: (en._embedded?.['wp:term']?.[0] || []).some(t => t.slug === 'blog') ? 'blog' : 'news',
    featured: featured ? normImg(featured) : null,
    blocks,
    images: [...new Set(images)],
    translations,
  });
}

// merge editorial overlay: content type, display headline, excerpt, topics,
// alt text, featured flags, related products/applications, reading time
const EDITORIAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/media/editorial.json'), 'utf8'));
for (const p of out) {
  const ed = EDITORIAL.posts[String(p.id)] || {};
  const words = p.blocks.filter(b => b.t === 'p' || b.t === 'ul')
    .map(b => (b.html || (b.items || []).join(' ')).replace(/<[^>]+>/g, ''))
    .join(' ').split(/\s+/).filter(Boolean).length;
  Object.assign(p, {
    type: ed.type || (p.category === 'blog' ? 'insight' : 'news'),
    cleanTitle: ed.cleanTitle || p.title,
    excerpt: ed.excerpt || '',
    topics: ed.topics || [],
    imageAlt: ed.imageAlt || '',
    isFeatured: !!ed.featured,
    featuredRank: ed.featuredRank || 99,
    relatedProducts: ed.relatedProducts || [],
    relatedApplications: ed.relatedApplications || [],
    readingTime: Math.max(1, Math.round(words / 200)),
  });
  if (p.isFeatured && !p.images.length && !p.featured && p.id !== 7923) {
    throw new Error(`featured item ${p.id} has no image`);
  }
  if (!p.excerpt) console.warn(`WARN: post ${p.id} has no excerpt`);
}
const slugs = new Set();
for (const p of out) {
  if (slugs.has(p.slug)) console.warn(`WARN: duplicate slug ${p.slug}`);
  slugs.add(p.slug);
}

fs.writeFileSync(path.join(ROOT, 'content/news/posts.json'), JSON.stringify(out, null, 1));
for (const p of out) {
  console.log(p.id, p.date, p.category, 'blocks=' + p.blocks.length, 'imgs=' + p.images.length,
    'tr=' + Object.keys(p.translations).join('/'), '|', p.title.slice(0, 60));
}
