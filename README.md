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
content/en/*.md       ← verbatim content scraped from the live site (source of truth)
```

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
- [ ] Full per-page body translations for the 6 non-English languages (pull from live localized pages)
- [ ] Individual product detail pages with full spec tables (data captured in `content/en/products.md`)
- [ ] Real product/application imagery (live site uses poster images)
- [ ] Videos page embeds (JS-injected on live site)
