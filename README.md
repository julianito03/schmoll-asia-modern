# Schmoll Asia Pacific — Modern Rebuild (staging)

A modernized, from-scratch recreation of **schmoll-asia.com** — same content, all 7 languages,
better-looking. **Staging only. NOT connected to the live schmoll-asia.com domain.**

## What it is
- Static site (no WordPress). Plain HTML + CSS + vanilla JS — deploys anywhere.
- Brand: official Schmoll Maschinen palette (red `#C11819`, blue `#2C55A3`, grey ramp).
- Type: Jost (display) + Roboto Slab (body) + Roboto Mono (technical labels).
- Aesthetic: precision-engineering — crosshair/drill fiducial motif rebuilt as SVG.
- 7 languages via client-side i18n: EN, 简体中文, 繁體中文 (HK), 한국어, Bahasa Melayu, ไทย, Tiếng Việt.

## Structure
```
site/                 ← the deployable website (open site/index.html)
  index.html          ← homepage (hand-built flagship)
  team.html           ← hand-built (CEO layout + globe.gl embed) — edit directly, not via build/
  *.html              ← generated interior pages
  assets/css|js|img   ← design system, scripts, images
  assets/js/i18n.js   ← translation dictionaries (chrome + homepage, 7 langs)
build/                ← no-dependency page generator
  partials.js         ← shared header/footer/contact (single source of truth)
  build.js            ← assembles interior pages → site/
  news-extract.js     ← WP REST dump → content/news/posts.json (articles + translations)
  linkedin-sync.js    ← LinkedIn company feed → site/assets/data/linkedin.json (see below)
content/en/*.md       ← verbatim content scraped from the live site (source of truth)
content/news/         ← posts-raw.json (WP REST dump) + posts.json (clean article data)
```

## News & blog
All 14 articles from the live site live in `content/news/posts.json` (EN bodies plus
zh/zh-hk/ko/ms/th translations where the live site has them). `build.js` renders
`news.html` (listing + LinkedIn feed + videos) and one `news-*.html` page per article;
the language switcher swaps article bodies where a translation exists, falling back to
English. To re-pull from the live site: refresh `content/news/posts-raw.json` from
`/wp-json/wp/v2/posts?per_page=50&_embed`, then `node build/news-extract.js && node build/build.js`.
Note: the LIVE site's single-post pages currently render with no article body (broken
Elementor single template) — the content here came from the REST API render.

## LinkedIn feed (automatic)
`node build/linkedin-sync.js --deploy` fetches the public crawler view of
[linkedin.com/company/schmoll-asia-pacific](https://www.linkedin.com/company/schmoll-asia-pacific)
(no login), parses the latest ~10 posts, downloads new post images to
`site/assets/img/linkedin/`, merges into `site/assets/data/linkedin.json`
(accumulative — old posts are kept), rebuilds the pages, commits and redeploys
gh-pages. Without `--deploy` it only updates the local JSON. A launchd job
(`com.schmoll.linkedin-sync`, see `ops/`) runs this daily at 10:00; logs at
`ops/linkedin-sync.log`. If LinkedIn ever serves an authwall the script exits
non-zero and changes nothing.

## Develop
```bash
node build/build.js          # regenerate interior pages after editing build/
cd site && python3 -m http.server 8080   # preview at http://localhost:8080
```

## Deploy (GitHub Pages)
Live at **https://julianito03.github.io/schmoll-asia-modern/** — served from the
`gh-pages` branch (contents of `site/`). To redeploy after changes:
```bash
git branch -D gh-pages 2>/dev/null; git subtree split -P site -b gh-pages
git push -f origin gh-pages
```

## Language preview
Append `?lang=zh` (or `zh-hk`, `ko`, `ms`, `th`, `vi`) to any page URL, or use the
in-page language switcher.

## Status / TODO
- [x] Design system, homepage, about, products, applications, team, service, careers, contact, news
- [x] 7-language switcher for nav/footer/buttons + homepage
- [x] All 14 live-site news/blog articles migrated with images + available translations (13 detail pages)
- [x] LinkedIn feed on news.html + daily auto-sync (launchd, `build/linkedin-sync.js --deploy`)
- [ ] Full per-page body translations for the 6 non-English languages (pull from live localized pages)
- [ ] Individual product detail pages with full spec tables (data captured in `content/en/products.md`)
- [ ] Real product/application imagery (live site uses poster images)
- [ ] Videos page embeds (JS-injected on live site)
