# Schmoll Maschinen (DE) — Research for Asia site rebuild

Source: https://www.schmoll-maschinen.de (German parent / global HQ in Rödermark).
Researched 2026-06-30. The German site is in **English**, organised by **solution / application**, not by model name. Built on TYPO3 + a JS-rendered frontend; images are served through a custom "PixelPerfect" lazy-loader (`/pixelperfect/{name}.webp?id={id}&...`) — they are NOT in the static HTML, which is why a naive scrape misses them. All images below were pulled at native max resolution (~1700–2600 px wide) as WebP.

---

## 1. Site structure & navigation

Top nav: **Solutions · Service · Company · Career · Contact**. Solutions is the whole product story, grouped as:

- **Mechanical MicroDrilling** — Prototyping · Standard · High-end & Back Drill · Substrate · Fixture
- **Mechanical MicroRouting** (Fräsen/Routing)
- **Laser Micromachining** — Hybrid Drilling · Micro Cutting · Micro Drill
- **Direct Imaging (MDI)** — Resist · Soldermask · Fineline · Chemical etching
- **Registration** — X-Ray / inner-layer punch (XRA³) + Optiflex
- **Automation & Measurement** — drill-room automation, handling, scoring/cutting

Key insight: the German site sells **applications first, model second**. A page opens with the *job to be done* ("In back drilling, every mil counts"), then introduces the machine series that solves it, then a "Highlights" block of features, then variant cards (e.g. Eagle EXY vs Eagle S), then a datasheet PDF + contact CTA.

---

## 2. Machine lineup & mapping to the Asia names

| Asia name | German series / page | Positioning headline (DE site) | Notes |
|---|---|---|---|
| **Eagle** | Eagle series — *High-end & Back Drill* | "In back drilling, every mil counts — the Eagle series is the new industry standard" | Variants: Eagle EXY, Eagle S, EXY5. Top-tier precision/back-drill. Direct match. |
| **Hawk** | **N Series / X Series** — *Standard* | "Robust, accurate and reliable for standard and HDI-drilling" | No "Hawk" on DE site. Asia's Hawk = the standard production drill (N = 5–7 stations / X = large-format 6-station). Closest functional match. |
| **Falcon** | Falcon series — *Substrate* | "To stay competitive in substrate, you need to go Falcon!" | Variants: Falcon FS, Falcon FXY, Falcon FS2. Direct match (substrate/IC). |
| **RMXY** | R Series / **RMXY** — *MicroRouting* | "From contouring to high-precision depth routing … From Pinless to Painless" | Variants: R6, RM series, RMXY. Direct match (routing). |
| **Raptor** | *Prototyping* line (MX / MXY / LM / Modul) | "For a multitude of applications" | No "Raptor" by name on DE site. Best functional match is the prototyping/entry MX/LM line; treat mapping as tentative. |
| **CombiDrill 500** | **Combi Drill 500 / 350** — *Laser Hybrid Drilling* | "Micro-via drilling of FR4 and filled substrates — efficiently and cost-effective" | Direct match. (CombiDrill = laser+mechanical hybrid.) |
| **MDI** | **MDI-ST / MDI-TTG** — *Direct Imaging* | "Highly efficient direct imaging … modular photohead system with different resolutions" | Direct match. Modular DI head is the hero story. |
| **XRA3** | **XRA³ series** — *Registration* | "X-ray optimizers and inner-layer punch — meet the XRA³ series" | Direct match. Plus Optiflex (MANU/SEMI/AUTO tiers). |
| **Automation (ALS)** | **ALS** + FlexShuttle / CubeLine / Loader — *Automation & Measurement* | "Lights-out production / Modul Automation / Buffer Solutions" | Direct match. ALS is the drill-room automation/loader system. |
| **Probe Card / Fixture** | **Fixture One / Fixture Nano** — *Fixture* | (fixture/test drilling) | Direct match. Fixture One + Fixture Nano. |

Other models seen (not in Asia lineup, useful context): LaserMaster, PicoMaster, PicoCut, PicoMuDrill, PicouFlex (laser micro cutting/drilling); SCM412 (scoring/cutting); Impex ProX3 (measurement); Optiflex 2.

---

## 3. Images downloaded

All saved to `/Users/juliandegen/schmoll-asia-modern/site/assets/img/machines-de/` as WebP (native full-size; the `/pixelperfect/` endpoint only serves WebP regardless of requested extension). 21 files, all verified valid and 400 KB–3.1 MB:

| Asia key | File | Approx px |
|---|---|---|
| Eagle | `eagle-de.webp`, `eagle-s-de.webp` | 2039×1726, 2362×1999 |
| Hawk | `hawk-nseries-de.webp`, `hawk-xseries-de.webp` | 2039×1726 |
| Falcon | `falcon-de.webp` (FXY), `falcon-fs-de.webp` | 2039×1726 |
| RMXY | `rmxy-de.webp`, `rmxy-rseries-de.webp` | 2039×1726 |
| Raptor (tentative) | `raptor-mx-de.webp`, `raptor-lm-de.webp` | 2039×1726 |
| CombiDrill 500 | `combidrill500-de.webp`, `combidrill350-de.webp` | 2600×2200, 1736×1469 |
| MDI | `mdi-de.webp` (MDI-ST), `mdi-ttg-de.webp` | 2600×2200, 2363×2000 |
| XRA3 | `xra3-de.webp`, `xra3-drillheads-de.webp` | 2039×1726, 2600×2200 |
| Automation/ALS | `als-de.webp`, `als-cubeline-de.webp`, `als-flexshuttle-de.webp` | up to 1945×1646 |
| Fixture / Probe Card | `fixture-one-de.webp`, `fixture-nano-de.webp` | 2039×1726 |

These are clean studio renders on neutral/white backgrounds — noticeably cleaner than the Asia-site equivalents.

How to grab more later: read the page HTML, find `data-pp-img="{id}" data-pp-name="{name}"`, then
`curl "https://www.schmoll-maschinen.de/pixelperfect/{name}.webp?id={id}&vW=3840&width=2600&height=2200"`.

---

## 4. Hero / visual & presentation style of the DE site

- Brand line: **"VISIONARY SOLUTIONS — the global electronics-manufacturing champion out of Rödermark."** Heritage hook: **"80 years of innovation."**
- Homepage is a **modular card grid** with four big **numbered** solution pillars (01 MicroDrill/Rout · 02 Laser MicroDrill/Cut · 03 Micromirror Direct Imaging · 04 Registration).
- Clean, high-whitespace, type-led B2B aesthetic. Strong typographic hierarchy, restrained palette, lots of breathing room around large product renders.
- Every solution page follows the same rhythm: **application-pain headline → reassurance subhead → "Highlights" feature block → variant cards → datasheet PDF + "You have questions?" contact CTA.**
- Renders are full-bleed-ish, large, on neutral backgrounds; components (spindle, CCD focus-zoom, tank station, XY-table) shown as supporting close-up shots to tell a "precision engineering" story.

---

## 5. Concrete design/presentation ideas to make the Asia rebuild more impressive

1. **Lead with the job, not the model.** Open each machine page with an application-pain headline ("In back drilling, every mil counts") and only then name the machine. Far more persuasive than a spec dump.
2. **Numbered solution pillars on the landing page** (01–04 style) as large cards — gives instant structure and an editorial, confident feel. Map Asia's 10 machines into 4–5 application families.
3. **Use these clean DE renders as full-bleed heroes** on neutral backgrounds, with the machine large and a thin spec strip beneath — replace any busy/low-res Asia photos.
4. **Component close-up storytelling.** Beneath each hero, a row of supporting shots (drilling spindle, CCD focus-zoom, tank station, XY-table) with one-line captions to convey precision engineering. The DE site has these assets per machine.
5. **Variant cards within a series** (Eagle EXY / Eagle S, Falcon FS / FXY, MDI-ST / TTG, Optiflex MANU/SEMI/AUTO) — a simple 2–3 card chooser ("which configuration fits you") instead of one undifferentiated page.
6. **Consistent page rhythm** across every machine: pain-headline → reassurance → Highlights → variants → spec table → datasheet PDF + contact CTA. Predictable, scannable, professional.
7. **A real spec table / comparison matrix** (stations, max panel size, drill diameter, footprint) — present specs as structured data, ideally a cross-machine compare so buyers can self-select.
8. **Heritage + scale framing.** Borrow the "80 years / global champion" confidence and an "Automation-Ready" badge motif; subtle scroll-reveal on the render and spec rows (the DE site lazy-fades images in) adds polish without slop.
9. **Modern asset pipeline.** Serve WebP at responsive sizes (as DE does via PixelPerfect) for fast, crisp renders on these large hero images.
