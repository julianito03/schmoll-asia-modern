/* Static page generator — no dependencies. Run: node build/build.js
   Generates interior pages into ../site/ using shared chrome from partials.js. */
const fs = require("fs");
const path = require("path");
const { CONTACT_CTA, GALLERY, page } = require("./partials.js");
const OUT = path.join(__dirname, "..", "site");

/* ---------- helpers ---------- */
const arrow = (s = 16) => `<svg viewBox="0 0 16 16" width="${s}" height="${s}" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>`;
const banner = (eyebrow, title, crumbs, img = "assets/img/facility-2.jpg") => `
<section class="page-banner">
  <div class="page-banner__media"><img src="${img}" alt=""></div>
  <div class="container">
    <nav class="breadcrumb"><a href="index.html">Home</a><span>/</span>${crumbs}</nav>
    <span class="eyebrow">${eyebrow}</span>
    <h1 style="margin-top:18px">${title}</h1>
  </div>
</section>`;

/* ======================================================= ABOUT */
const about = banner('About', 'German Quality &amp; Innovation', '<span>About</span>', 'assets/img/facility-1.jpg') + `
<section class="section">
  <div class="container">
    <div class="grid" style="grid-template-columns:1.05fr .95fr;gap:clamp(40px,6vw,80px);align-items:center">
      <div class="prose" data-reveal>
        <span class="eyebrow">Our Mission</span>
        <h2 style="margin:16px 0 22px">Precision engineering, in Asia since 1996</h2>
        <p>Schmoll has offered German quality and innovation across Asia since 1996, operating as a leading PCB drilling and routing machinery provider. Our machines are built on precision-engineering fundamentals: high-speed linear motors, granite machine bases for superior stability, and sophisticated tool adjustment systems.</p>
        <p>We help you meet your expectations with efficient solutions and machinery — your technology partner and a solution provider you can trust.</p>
      </div>
      <div data-reveal data-delay="1"><img src="assets/img/facility-2.jpg" alt="Schmoll precision machine" style="width:100%;border:1px solid var(--line);border-radius:var(--radius)" loading="lazy"></div>
    </div>
  </div>
</section>
<section class="section section--dark" style="padding-block:clamp(48px,6vw,80px)">
  <div class="container">
    <div class="hero__stats" style="border:0;margin:0;justify-content:space-between" data-reveal>
      <div class="stat"><div class="stat__num">80<span>+</span></div><div class="stat__label">Years of innovation</div></div>
      <div class="stat"><div class="stat__num">8</div><div class="stat__label">Offices · 7 countries</div></div>
      <div class="stat"><div class="stat__num">300<span>K</span></div><div class="stat__label">Max spindle RPM</div></div>
      <div class="stat"><div class="stat__num">10</div><div class="stat__label">Machine series</div></div>
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow">1943 — 2023</span><h2>80 Years of Innovation</h2><p class="lead">Eight decades of milestones that shaped PCB drilling.</p></div>
    <div class="timeline" data-reveal>
      ${[
        ["1943","Founded by Heinz Schmoll in Germany."],
        ["1962","First European PCB drilling machine."],
        ["1985","Twin concept introduced — dual spindles."],
        ["1992","Contact Bit Detection (CBD) system."],
        ["1999","Linear motor technology."],
        ["2004","MXY-CCD concept for precision drilling."],
        ["2006","300k sub-spindle — up to 300,000 RPM."],
        ["2015","Laser drilling technology."],
        ["2023","X-Ray inspection systems."]
      ].map(([y,t])=>`<div class="tl-item"><div class="tl-year">${y}</div><div class="tl-text">${t}</div></div>`).join("")}
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow">Inside Schmoll</span><h2>Precision, in practice</h2></div>
    <div class="gallery" data-reveal>
      <a class="span2" data-lightbox="assets/img/facility-3.jpg" href="assets/img/facility-3.jpg"><img src="assets/img/facility-3.jpg" alt="Schmoll machine in operation" loading="lazy"></a>
      <a data-lightbox="assets/img/facility-1.jpg" href="assets/img/facility-1.jpg"><img src="assets/img/facility-1.jpg" alt="" loading="lazy"></a>
      <a data-lightbox="assets/img/machines/eagle.webp?v=7" href="assets/img/machines/eagle.webp?v=7" style="background:radial-gradient(120% 100% at 50% 35%,#2c2c30,#141416)"><img src="assets/img/machines/eagle.webp?v=7" alt="Eagle machine" loading="lazy" style="object-fit:contain;padding:10px"></a>
      <a data-lightbox="assets/img/team-hero.jpg" href="assets/img/team-hero.jpg"><img src="assets/img/team-hero.jpg" alt="Schmoll team" loading="lazy"></a>
    </div>
  </div>
</section>` + CONTACT_CTA;

/* ======================================================= PRODUCTS / MACHINES */
const check = '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 9.5l4.5 4.5L16 3.5" stroke="currentColor" stroke-width="2.2"/></svg>';
const MACHINES = [
  { key:"eagle", name:"Eagle Series", cat:"Drilling · Depth Control",
    tagline:"Eagle XY CCD — special-application microdrilling &amp; backdrilling, made in Germany.",
    blurb:"Special-application microdrilling with Contact Bit Detection depth control, AI-driven linear motors and a solid granite structure.",
    apps:["Panel Traceability","Sliver Control","Stub Length Control"],
    features:["S80 Next-Gen High-Speed Controller","High-Speed AI-Drives","Solid Granite Structure","Automated Collet Cleaning","Active Process Monitoring","Industry 4.0 Connectivity"],
    specs:[["Models","ES-6-2228 / 2528 / 2532 / 2643"],["Basic accuracy","X/Y ± 18 µm, Cpk &gt; 1.67"],["Spindles","T160 / T200x / T250 — up to 250,000 rpm"],["X/Y drive","AI-driven linear motor — 90 m/min"],["Depth control","Contact Bit Detection (CBD)"],["Panel size","up to 25.9″ × 43.0″ (658 × 1092 mm)"]] },
  { key:"hawk", name:"Hawk Series", cat:"Drilling · High-End",
    tagline:"Hawk — high-end microdrilling &amp; depth control for the most demanding PCBs.",
    blurb:"High-end microdrilling and depth control with the S80 Next-Gen controller and full Industry 4.0 connectivity.",
    apps:["LEO Satellite PCB","Automotive PCB","Artificial Intelligence"],
    features:["S80 Next-Gen High-Speed Controller","Durable High-Performance Spindles","High-Speed AI-Drives","Optional Automation QLB · DTE · ALS","Industry 4.0 Connectivity","Automated Collet Cleaning"],
    specs:[["Models","HS-6-2228 / 2528 / 2532 / 2643"],["Basic accuracy","X/Y ± 18 µm, Cpk &gt; 1.67"],["Spindles","T160 / T200x — up to 200,000 rpm"],["X/Y drive","AI-driven linear motor — 90 m/min"],["Z drive","AI-driven AC motor — 60 m/min"],["Tool cassette","JTC 6×50 / 8×50 tools"]] },
  { key:"falcon", name:"Falcon Series", cat:"Drilling · Substrate",
    tagline:"Falcon — substrate drilling machine for micro-via and micro-drilling.",
    blurb:"Substrate drilling precision engineered for IC substrate and HDI, with Smart Climate Control on a full-body granite base.",
    apps:["Substrate","Micro Via","Micro Drilling"],
    features:["S80 Next-Gen Controller","High-Speed AI-Drives","Smart Climate Control","Full-Body Granite Base","Industry 4.0"],
    specs:[["Models","FS / FT / FXY-6-2227"],["Basic accuracy","up to ± 12 µm (15 µm @ Cpk 1.67)"],["Spindles","T200x / T250 / PS300 — up to 300,000 rpm"],["Axis speed","XY 100 m/min · Z 50–60 m/min"],["CCD registration","High-resolution cameras (FXY)"],["Drive","AI-driven linear motor"]] },
  { key:"raptor", name:"Raptor Series", cat:"Routing",
    tagline:"Raptor XY CCD Routing — high-quality routing PCB equipment made in Germany.",
    blurb:"Contour and depth routing with CCD registration, vacuum table and touch-probe second measurement.",
    apps:["Contour Routing","Depth Routing","Optical Module"],
    features:["Vacuum Table","2nd Measurement Touch Probe","Pin-Up Table","Optical Broken-Bit Detection (BBD)","ESD Protection","Industry 4.0 Connectivity"],
    specs:[["Models","RXY-6-2228 / 2528 / 2532 / 2643"],["Depth routing","± 15 µm with CBD"],["Edge-to-edge accuracy","± 50 µm"],["Spindles","DR-130 (20–125k) · SM75 (5–75k)"],["CCD target","Ø 0.2 mm – 8 mm"],["Drive","AI-driven linear motor — 90 m/min"]] },
  { key:"combidrill", name:"CombiDrill 500", cat:"Laser Drilling",
    tagline:"CombiDrill 500 — hybrid UV-CO₂ laser drilling for microvias.",
    blurb:"Dual-beam hybrid laser combining CO₂ via drilling with UV copper clearance and cleaning for advanced HDI.",
    apps:["UV Copper Clearance","CO₂ Via Drilling","UV Copper Cleaning"],
    features:["Dual Laser Beam","CO₂ 9400 nm + UV 355 nm","Integrated Loader","MES / Industry 4.0 Ready"],
    specs:[["Laser source","CO₂ 9400 nm / UV 355 nm"],["Via size","50 µm – 300 µm"],["Productivity","300 vias/sec*"],["Accuracy","± 10 µm"],["Laser beams","2"],["Dimensions","2090 × 1970 × 2126 mm"]] },
  { key:"mdi", name:"MDI Series", cat:"Direct Imaging",
    tagline:"MDI-TTG SolderBeam — soldermask &amp; resist direct imaging.",
    blurb:"Maskless direct imaging with multi-wavelength UV-LED photoheads, dynamic autofocus and tandem-table throughput.",
    apps:["White Ink","Black Ink","Green Ink"],
    features:["Multi Light-Source 365–420 nm","Resolution 30 µm L/S","High-Power UV-LED Beam","XXL Format up to 54″ × 36″","Dynamic Autofocus to 11 mm","Full Automatic Clamping"],
    specs:[["Machine type","MDI-TTG"],["Max system accuracy","registered ± 10 µm"],["CCD alignment","&lt; 2 µm"],["Working format","up to 54″ × 36″ (gantry mode)"],["Platform","Solid granite"],["Weight","ca. 4500 kg"]] },
  { key:"xra3", name:"XRA3 Series", cat:"X-Ray",
    tagline:"XRA3 — full-panel X-ray inspection, registration &amp; drilling.",
    blurb:"Dual-spindle X-ray system for drill-in-centre accuracy, layer optimization and panel serialization.",
    apps:["Drill in Centre","Serialization","Layer Optimization"],
    features:["Dual Spindle DD / DR","70 KV High-Performance X-Ray Tube","Multi-Zone CCD Registration","S80 Next-Gen Control","First-Article Checking","Automation Options"],
    specs:[["Models","XRA3 · XRA3-XXL"],["Panel size","30″ × 28″ · 50″ × 32″ (XXL)"],["Drill-in-centre accuracy","≤ 9 µm"],["X-Ray source","70 KV (optional 90 KV)"],["Layer count","up to 99 layers"],["CCD vision","min. pad Ø 0.20 mm"]] },
  { key:"automation", name:"Automation Series", cat:"Automation",
    tagline:"Drill-room automation — ALS · QLB · DTE · ACC.",
    blurb:"End-to-end PCB drill-room automation, from flexible line shuttles to AGV intralogistics and automatic collet cleaning.",
    apps:["AGV Intralogistics","Individual Automation","Inline Automation"],
    features:["ALS — Flexible Line Shuttle","QLB — 4-Level Buffer","DTE — 2-Level Buffer","ACC — Automatic Collet Cleaning","MES / Industry 4.0"],
    specs:[["ALS capacity","up to 18 levels / 102 stacks"],["QLB","4 levels / 18 stacks"],["DTE","2 levels / 6 stacks"],["Process time","1 min load / unload"],["Compatible","Eagle / Hawk series"],["Smart factory","MES, customizable"]] },
  { key:"probecard", name:"Probe Card / Fixture", cat:"Fixture / Probe Card",
    tagline:"Fixture &amp; probe-card solutions — nano accuracy.",
    blurb:"Ultra-precision fixture drilling and probe-card solutions with nano-scale accuracy and CCD control.",
    apps:["Nano Accuracy","Precision Alignment","High Aspect Ratio"],
    features:["Hole Ø from 20 µm","Wall Thickness 10 µm","Hole Position ± 1.5 µm","CCD Control","Depth-Routing","Spray Cooling"],
    specs:[["Models","Fixture Nano · Fixture 1 · MX 1"],["Process accuracy","± 1.5 µm (Nano)"],["Min. hole / pitch","0.02 mm / 0.03 mm"],["Scale resolution","5 nm"],["Climate control","Yes (Nano)"],["Controller","S80"]] },
  { key:"rmxy", name:"RMXY Series", cat:"Routing",
    tagline:"RMXY — Routing Machine XY precision profiling platform.",
    blurb:"The routing-machine-XY platform delivering CCD-registered contour and depth routing with linear-motor precision.",
    apps:["Contour Routing","Depth Routing"],
    features:["CCD Registration","AI-Driven Linear-Motor Drive","Industry 4.0 Connectivity","Depth Routing with CBD"],
    specs:[["Platform","Routing Machine XY (RXY)"],["Routing","Contour &amp; Depth"],["Registration","CCD target recognition"],["Drive","AI-driven linear motor"]] }
];
const BROCHURE = {
  eagle:"https://schmoll-asia.com/wp-content/uploads/2026/03/EN-BACKFRONT-Eagle-.pdf",
  hawk:"https://schmoll-asia.com/wp-content/uploads/2026/03/EN-BACKFRONT-HAWK.pdf",
  falcon:"https://schmoll-asia.com/wp-content/uploads/2026/03/EN-BACKFRONT-FALCON.pdf",
  raptor:"https://schmoll-asia.com/wp-content/uploads/2026/03/Raptor_Brochure-1-1.pdf",
  combidrill:"https://schmoll-asia.com/wp-content/uploads/2026/03/EN-BACKFRONT-CombiDrill-500.pdf",
  mdi:"https://schmoll-asia.com/wp-content/uploads/2026/03/EN-BACKFRONT-MDI.pdf",
  xra3:"https://schmoll-asia.com/wp-content/uploads/2026/03/EN-BACKFRONT-XRA3.pdf",
  automation:"https://schmoll-asia.com/wp-content/uploads/2026/03/EN-BACKFRONT-ALS.pdf",
  probecard:"https://schmoll-asia.com/wp-content/uploads/2026/03/EN-BACKFRONT-Fixture.pdf",
  rmxy:"http://47.239.40.173/wp-content/uploads/2024/06/EN_RMXY_Brochure_FRONTBACK.pdf"
};
const dl = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1v9M4.5 6.5L8 10l3.5-3.5M2 14h12" stroke="currentColor" stroke-width="1.6"/></svg>';

const productsPage = banner('Products', 'You Name It, We Have It', '<span>Products</span>', 'assets/img/facility-3.jpg') + `
<section class="section">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow">Cutting-Edge Technology</span><h2>The Schmoll Machine Lineup</h2><p class="lead">Our machines leverage artificial intelligence to enhance operational efficiency — dynamically adjusting settings and measurements with machine learning for optimal performance in every operation.</p></div>
    <div class="pgrid" data-reveal>
      ${MACHINES.map((m,i)=>`<a class="pcard" href="product-${m.key}.html">
        <div class="pcard__img pcard__img--render"><span class="pcard__cat">${m.cat}</span><img src="assets/img/machines/${m.key}.webp?v=8" alt="${m.name}" loading="lazy"></div>
        <div class="pcard__body"><span class="pcard__no">${String(i+1).padStart(2,"0")}</span><h3>${m.name}</h3><p>${m.blurb}</p>
        <div class="pcard__foot"><span class="tlink">View machine</span><span class="pcard__arrow">${arrow(20)}</span></div></div>
      </a>`).join("")}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow">Downloads</span><h2>Machine Brochures</h2><p class="lead">Full specifications, feature breakdowns and application notes — every Schmoll machine, made in Germany.</p></div>
    <div class="pgrid" data-reveal style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
      ${MACHINES.filter(m=>BROCHURE[m.key]).map(m=>`<a class="pcard" href="${BROCHURE[m.key]}" target="_blank" rel="noopener">
        <div class="pcard__img" style="aspect-ratio:3/4"><img src="assets/img/machines/${m.key}.jpg" alt="${m.name} brochure" loading="lazy" style="object-position:center top"></div>
        <div class="pcard__body" style="padding:16px 18px"><h3 style="font-size:1.05rem">${m.name}</h3><div class="pcard__foot"><span class="tlink">${dl} PDF</span></div></div>
      </a>`).join("")}
    </div>
  </div>
</section>` + CONTACT_CTA;

/* Individual machine detail page */
function productDetail(m, idx) {
  const prev = MACHINES[(idx - 1 + MACHINES.length) % MACHINES.length];
  const next = MACHINES[(idx + 1) % MACHINES.length];
  const broc = BROCHURE[m.key];
  return banner(m.cat, m.name, `<a href="products.html">Products</a><span>/</span><span>${m.name}</span>`) + `
<section class="section">
  <div class="container">
    <div class="pd-hero">
      <figure class="pd-figure" data-lightbox="assets/img/machines/${m.key}.webp?v=8" data-reveal>
        <span class="pd-figure__tag">Made in Germany</span>
        <img src="assets/img/machines/${m.key}.webp?v=8" alt="${m.name}">
      </figure>
      <div data-reveal data-delay="1">
        <span class="eyebrow pd-cat">${m.cat}</span>
        <h2 style="margin:14px 0 0">${m.name}</h2>
        <p class="pd-tagline">${m.tagline}</p>
        <p style="margin-bottom:22px">${m.blurb}</p>
        <div class="tags">${m.apps.map(a=>`<span class="tag">${a}</span>`).join("")}</div>
        <div class="pd-actions">
          ${broc?`<a class="btn btn--lg" href="${broc}" target="_blank" rel="noopener">${dl} Download Brochure</a>`:""}
          <a class="btn btn--ghost btn--lg" href="contact.html">Request a quote ${arrow(14)}</a>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="section section--alt" style="padding-block:clamp(48px,7vw,90px)">
  <div class="container">
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:clamp(36px,5vw,70px);align-items:start">
      <div data-reveal>
        <span class="eyebrow">Key Features</span>
        <h3 style="margin:14px 0 24px">Engineered for precision</h3>
        <div class="features">${m.features.map(f=>`<div class="feature">${check}<span>${f}</span></div>`).join("")}</div>
      </div>
      <div data-reveal data-delay="1">
        <span class="eyebrow">Specifications</span>
        <h3 style="margin:14px 0 24px">Technical data</h3>
        <table class="spec"><tbody>${m.specs.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</tbody></table>
        <p class="form__note" style="margin-top:14px">Full multi-model specifications in the ${broc?`<a href="${broc}" target="_blank" rel="noopener" style="color:var(--red)">product brochure</a>`:"product brochure"}.</p>
      </div>
    </div>
  </div>
</section>
<section class="section" style="padding-block:clamp(40px,5vw,70px)">
  <div class="container" style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:32px">
    <a class="tlink" href="product-${prev.key}.html" style="border:0;padding:0">← ${prev.name}</a>
    <a class="tlink" href="products.html" style="border:0;padding:0">All machines</a>
    <a class="tlink" href="product-${next.key}.html" style="border:0;padding:0">${next.name} →</a>
  </div>
</section>` + CONTACT_CTA;
}

/* ======================================================= APPLICATIONS */
const apps = [
  ["ccd","CCD Application","High-precision PCB drilling with CCD camera technology for accurate target recognition and registration."],
  ["backdrilling","Backdrilling","Precision via management and stub removal — controlled-depth backdrilling for high-speed signal integrity."],
  ["substrate","Substrate","Advanced processing for IC substrates and high-density interconnect applications."],
  ["automation","Automation","PCB machine automation across the drillroom for the highest productivity at the lowest cost of ownership."],
  ["fixture","Fixture / Probe Card","Test fixtures and probe-card solutions engineered for reliable electrical test."],
  ["xray","XRay – XRA3","X-ray inspection and registration systems for layer-to-layer alignment accuracy."],
  ["laser","Laser","Hybrid laser drilling technology for microvias and advanced HDI structures."],
  ["ev","Electric Vehicle","PCB manufacturing solutions tailored to the demands of EV power and control electronics."]
];
const appIcons = {
  ccd:'<circle cx="16" cy="16" r="6" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/><path d="M16 2v6M16 24v6M2 16h6M24 16h6" stroke="currentColor" stroke-width="2"/>',
  backdrilling:'<path d="M16 3v18M11 16l5 5 5-5M6 27h20" stroke="currentColor" stroke-width="2"/>',
  substrate:'<rect x="4" y="9" width="24" height="14" stroke="currentColor" stroke-width="2"/><path d="M9 9V5M16 9V5M23 9V5M9 27v-4M16 27v-4M23 27v-4" stroke="currentColor" stroke-width="2"/>',
  automation:'<rect x="5" y="13" width="22" height="12" stroke="currentColor" stroke-width="2"/><circle cx="11" cy="28" r="2" stroke="currentColor" stroke-width="2"/><circle cx="21" cy="28" r="2" stroke="currentColor" stroke-width="2"/><path d="M16 13V6M12 6h8" stroke="currentColor" stroke-width="2"/>',
  fixture:'<rect x="6" y="6" width="20" height="20" stroke="currentColor" stroke-width="2"/><path d="M11 11h.01M16 11h.01M21 11h.01M11 16h.01M16 16h.01M21 16h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
  xray:'<path d="M16 4v24M4 16h24M8 8l16 16M24 8L8 24" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2"/>',
  laser:'<path d="M16 2v14M16 16l-4 14M16 16l4 14" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="currentColor"/>',
  ev:'<path d="M14 3L6 18h6l-2 11 12-16h-7l3-10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
};
const APP_POSTER = { ccd:1, backdrilling:1, substrate:1, automation:1, fixture:1, xray:1, laser:1, ev:1 };
const applicationsPage = banner('Application', 'Discover our Applications', '<span>Application</span>') + `
<section class="section">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow">Applications</span><h2>Engineered for every PCB challenge</h2><p class="lead">From CCD precision drilling to backdrilling, substrate, automation, X-ray, laser and EV — explore the detailed application solutions behind every Schmoll machine.</p></div>
    <div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(310px,1fr))" data-reveal>
      ${apps.map((a,i)=>`
      <div class="pcard" id="${a[0]}" style="scroll-margin-top:90px">
        ${APP_POSTER[a[0]]?`<a class="pcard__img" style="aspect-ratio:3/4;cursor:zoom-in" data-lightbox="assets/img/apps/${a[0]}.png" href="assets/img/apps/${a[0]}.png"><span class="pcard__cat">Application</span><img src="assets/img/apps/${a[0]}.png" alt="${a[1]} application poster" loading="lazy" style="object-position:center top"></a>`:""}
        <div class="pcard__body">
          <svg viewBox="0 0 32 32" width="34" height="34" fill="none" style="color:var(--red);margin-bottom:8px" aria-hidden="true">${appIcons[a[0]]}</svg>
          <span class="pcard__no">A${String(i+1).padStart(2,"0")}</span>
          <h3>${a[1]}</h3><p>${a[2]}</p>
          <div class="pcard__foot"><a class="tlink" href="contact.html" style="border:0;padding:0">Enquire</a><span class="pcard__arrow">${arrow(18)}</span></div>
        </div>
      </div>`).join("")}
    </div>
    <p class="form__note" style="margin-top:18px;text-align:center">Click any poster to view the full application detail.</p>
  </div>
</section>` + CONTACT_CTA;

/* ======================================================= TEAM
   team.html is hand-maintained in site/ (CEO photo layout + globe.gl embed) — not generated here. */

/* ======================================================= SERVICE */
const servicePage = banner('Service', 'Got a Problem? Schmoll is Here.', '<span>Service</span>') + `
<section class="section">
  <div class="container">
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,80px);align-items:center;margin-bottom:clamp(40px,6vw,72px)">
      <div data-reveal><span class="eyebrow" data-i18n="svc.eyebrow">Service</span><h2 style="margin:16px 0 18px" data-i18n="svc.title">Got a Problem? Schmoll is Here.</h2><p class="lead" data-i18n="svc.body">With expertise spanning various domains, we ensure that every challenge is met with a tailored solution.</p></div>
      <div data-reveal data-delay="1"><img src="assets/img/facility-3.jpg" alt="Schmoll service engineers" style="width:100%;border:1px solid var(--line);border-radius:var(--radius)" loading="lazy"></div>
    </div>
    <div class="svc-list" data-reveal>
      <div class="svc-item"><span class="svc-item__no">01</span><h3 data-i18n="svc.maint">Maintenance</h3><p>Reliable &amp; efficient preventive and corrective maintenance to keep your machines at peak performance.</p></div>
      <div class="svc-item"><span class="svc-item__no">02</span><h3 data-i18n="svc.spare">Spare Parts</h3><p>Comprehensive &amp; prompt supply of genuine Schmoll spare parts, minimising downtime.</p></div>
      <div class="svc-item"><span class="svc-item__no">03</span><h3 data-i18n="svc.repair">Repair</h3><p>Expert &amp; responsive repair services delivered by experienced engineers.</p></div>
      <div class="svc-item"><span class="svc-item__no">04</span><h3 data-i18n="svc.rnd">R&amp;D Center</h3><p>Innovative &amp; cutting-edge research and development to advance your process.</p></div>
    </div>
  </div>
</section>` + GALLERY + CONTACT_CTA;

/* ======================================================= CAREERS */
const careersPage = banner('Careers', 'Start Your Career With Schmoll', '<span>Careers</span>', 'assets/img/team-hero.jpg') + `
<section class="section">
  <div class="container">
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,90px);align-items:center">
      <div class="prose" data-reveal>
        <span class="eyebrow">Join Us</span>
        <h2 style="margin:16px 0 22px">A dynamic and enriching environment</h2>
        <p>Working at Schmoll offers a dynamic and enriching environment where innovation and growth are at the forefront. We emphasise professional development, a collaborative culture, access to cutting-edge technology and continuous learning programs.</p>
        <p style="font-family:var(--font-mono);font-size:.85rem;letter-spacing:.04em;margin-top:24px">Apply: <a href="mailto:career@schmoll-asia.com" style="color:var(--red)">career@schmoll-asia.com</a></p>
      </div>
      <div class="cta-band" style="border-radius:2px;padding:clamp(36px,5vw,60px)" data-reveal data-delay="1">
        <span class="eyebrow" style="justify-content:center" data-i18n="nav.careers">Careers</span>
        <h2 style="margin:16px 0 0" data-i18n="car.title">Ready to kick-start Your Career?</h2>
        <p data-i18n="car.sub">Schmoll is Looking for You!</p>
        <a href="mailto:career@schmoll-asia.com" class="btn btn--lg" data-i18n="btn.join">Join us Now ${arrow()}</a>
      </div>
    </div>
  </div>
</section>` + GALLERY + CONTACT_CTA;

/* ======================================================= CONTACT */
const offices = [
  ["China — Dongguan","Dongguan Schmoll Electronic Equipment Co., Ltd","+86-(0)769-2241-9199","F1,F3 Block G, LianShang Intelligent Manufacturing Park, ChuangRing Road, DiChong Village, Gaobu Town, Dongguan City, Guangdong Province, China",false,"office-china"],
  ["Taiwan","Schmoll Asia Pacific Ltd. Taiwan Branch (H.K.)","+886-(0)3-358-3808","5F., No. 117, Long'an St., Taoyuan Dist., Taoyuan City, Taiwan 33033",false,"office-taiwan"],
  ["China — Kunshan","Schmoll PCB Equipment (Kunshan) Co., Ltd.","+86-(0)512-5737 1850","5th Floor, Building No.4, No.1367 Juxiang Road, Zhangpu Town 215300 Kunshan, Jiangsu Province, P.R. China",false,"office-kunshan"],
  ["Malaysia — Penang","Schmoll Asia Pacific (Malaysia) Sdn Bhd","+60 (0)4 5897396","1-27, Utropolis, Utama, Persiaran Cassia Barat 3, 14110 Bandar, Cassia, Pulau Pinang",false,"office-malaysia"],
  ["Thailand — Bangkok","Schmoll Asia Pacific (Thailand) Ltd.","+66 (0) 2 10 72 923","Head Office no.1023, Room 158, 15th Floor, MS SIAM TOWER, Rama III Road, Khwaeng Chong Nonsi, Khet Yan Nawa, Bangkok 10120",false,"office-thailand"],
  ["Korea — Ansan","Schmoll Asia Pacific Korea Co., Ltd.","+82-031-497-8779","#616, Ansan Smartsquare, 325, Sandan-ro, Danwon-gu, Ansan-si, Gyeonggi-do, Republic of Korea",false,"office-korea"],
  ["China — Hong Kong","Schmoll Asia Pacific Limited","+852-28-505-909","Room 1803, 18/F, Chinachem Exchange Square, 1 Hoi Wan Street, Quarry Bay, Hong Kong",false,"office-hongkong"],
  ["Vietnam","Schmoll Asia Pacific Vietnam Company Limited","","Room 232, 2nd Floor, Hoang Ha Building, Le Thai To Street, Vo Cuong Ward, Bac Ninh Province, Vietnam",true,"office-vietnam"],
  ["Germany — Headquarters","Schmoll Maschinen GmbH","","Parent company · Rödermark, Germany — schmoll-maschinen.de",false,""]
];
const pin = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5c-2.5 0-4.5 2-4.5 4.5C3.5 9.5 8 14.5 8 14.5s4.5-5 4.5-8.5C12.5 3.5 10.5 1.5 8 1.5z" stroke="currentColor"/><circle cx="8" cy="6" r="1.6" stroke="currentColor"/></svg>';
const phoneIco = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 2.5h3l1 3-2 1.2a8 8 0 003.8 3.8l1.2-2 3 1V13a1.5 1.5 0 01-1.6 1.5A11.5 11.5 0 012.5 4.1 1.5 1.5 0 014 2.5z" stroke="currentColor"/></svg>';
const mailIco = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" stroke="currentColor"/><path d="M2.5 4l5.5 4.5L13.5 4" stroke="currentColor"/></svg>';
const contactPage = banner('Contact', 'Contact Us', '<span>Contact</span>') + `
<section class="section">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow">Global Presence</span><h2>8 Offices · 7 Countries</h2><p class="lead">Find your nearest Schmoll Asia Pacific office.</p></div>
    <div class="office-grid" data-reveal>
      ${offices.map(([region,co,phone,addr,soon,id])=>`
      <div class="office${soon?' office--soon':''}"${id?` id="${id}"`:''}>
        <div class="office__region">${pin} ${region} ${soon?'<span class="badge-soon">Published soon</span>':''}</div>
        <h3>${co}</h3>
        ${phone?`<div class="office__row">${phoneIco}<a href="tel:${phone.replace(/[^+\d]/g,'')}">${phone}</a></div>`:''}
        <div class="office__row">${pin}<span>${addr}</span></div>
        <div class="office__row">${mailIco}<a href="mailto:sales@schmoll-asia.com">sales@schmoll-asia.com</a></div>
      </div>`).join("")}
    </div>
  </div>
</section>` + CONTACT_CTA;

/* ======================================================= NEWS / MEDIA */
/* Articles migrated from the live site (content/news/posts.json, built by
   build/news-extract.js). LinkedIn feed from site/assets/data/linkedin.json
   (built by build/linkedin-sync.js). */
const POSTS = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "content/news/posts.json"), "utf8"));
const LI = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "site/assets/data/linkedin.json"), "utf8"));

const NEWS_KEYS = {
  7923: "team-building-2026", 7848: "cpca-show-2026", 7577: "hkpca-2025",
  7284: "cpca-show-2025",     7123: "hkpca-2024",     7009: "cpca-2024",
  6938: "tpca-2024",          6796: "kpca-2024",      6672: "granite",
  6480: "schmoll-asia-vs-maschinen", 5876: "wus-expansion",
  3441: "larry-gao",          3217: "new-website"
  // 7152 (Golden Supplier Award) has no recoverable body — listed without a detail page
};
const newsImg = (u) => "assets/img/news/" + u.split("/").pop().replace("-scaled", "").toLowerCase();
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtDate = (iso) => { const [y, m, d] = iso.slice(0, 10).split("-"); return `${d} ${MONTHS[m - 1]} ${y}`; };

// The Team Building article renders empty on the live site; its cross-post on
// LinkedIn carries the same story, so that text serves as the article body.
const TB_LI = LI.posts.find((p) => p.id === "7467579139282145280");
const teamBuilding = POSTS.find((p) => p.id === 7923);
if (teamBuilding && !teamBuilding.blocks.length && TB_LI) {
  teamBuilding.featured = TB_LI.images[0] || null;
  teamBuilding.liFeatured = true;
  teamBuilding.blocks = TB_LI.text.split(/\n+/).filter(Boolean)
    .map((t) => ({ t: "p", html: t.replace(/&/g, "&amp;").replace(/</g, "&lt;") }));
  teamBuilding.blocks.push({ t: "p", html: `<em>Originally shared on <a href="${TB_LI.url}" target="_blank" rel="noopener">LinkedIn</a>.</em>` });
}

const postExcerpt = (p, len = 150) => {
  let txt = "";
  for (const b of p.blocks) {
    if (b.t !== "p") continue;
    txt += (txt ? " " : "") + b.html.replace(/<[^>]+>/g, "");
    if (txt.length >= len) break;
  }
  return txt.length > len ? txt.slice(0, len).replace(/\s+\S*$/, "") + "…" : txt;
};
const postHref = (p) => NEWS_KEYS[p.id] ? `news-${NEWS_KEYS[p.id]}.html` : null;
const postThumb = (p) => p.featured ? (p.liFeatured ? p.featured : newsImg(p.featured))
  : (p.images[0] ? newsImg(p.images[0]) : "assets/img/facility-2.jpg");

const newsCard = (p, feature = false) => {
  const href = postHref(p);
  const media = `<div class="news-card__media"><img src="${postThumb(p)}" alt="" loading="lazy"></div>`;
  const meta = `<span class="news-card__meta">${fmtDate(p.date)}<i></i><span data-i18n="media.${p.category}">${p.category === "blog" ? "Blog" : "News"}</span></span>`;
  const body = `<div class="news-card__body">${meta}<h3>${p.title}</h3>${feature ? `<p>${postExcerpt(p, 220)}</p>` : ""}
    ${href ? `<span class="news-card__more"><span data-i18n="btn.readmore">Read more</span> ${arrow(14)}</span>` : ""}</div>`;
  const cls = `news-card${feature ? " news-card--feature" : ""}`;
  return href
    ? `<a class="${cls}" href="${href}" data-reveal>${media}${body}</a>`
    : `<div class="${cls}" data-reveal>${media}${body}</div>`;
};

const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
const newsList = sorted.filter((p) => p.category === "news");
const blogList = sorted.filter((p) => p.category === "blog");

/* LinkedIn feed — baked from data; refresh via `node build/linkedin-sync.js --deploy` */
const liCard = (p) => `
  <a class="li-card" href="${p.url}" target="_blank" rel="noopener" data-reveal>
    ${p.images[0] ? `<div class="li-card__media"><img src="${p.images[0]}" alt="" loading="lazy">${p.hasVideo ? '<span class="li-card__play"><svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.55)"/><path d="M10 8l6 4-6 4z" fill="#fff"/></svg></span>' : ""}</div>` : ""}
    <div class="li-card__body">
      <span class="news-card__meta">${fmtDate(p.date)}<i></i>LinkedIn</span>
      <p>${p.text.split("\n")[0].slice(0, 120)}</p>
      <span class="news-card__more"><span data-i18n="li.view">View post</span> ${arrow(14)}</span>
    </div>
  </a>`;

const newsPage = banner('Media', 'News &amp; Insights', '<span>Media</span>') + `
<section class="section section--alt">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow" data-i18n="media.news">News</span><h2>Latest from Schmoll</h2><p class="lead" data-i18n="news.lead">Exhibitions, milestones and announcements from across Asia Pacific.</p></div>
    ${newsCard(newsList[0], true)}
    <div class="news-grid">
      ${newsList.slice(1).map((p) => newsCard(p)).join("")}
    </div>
  </div>
</section>
<section class="section" id="blog">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow" data-i18n="media.blog">Blog</span><h2>From the Schmoll Blog</h2><p class="lead" data-i18n="blog.lead">Technology, partnerships and the engineering behind our machines.</p></div>
    <div class="news-grid">
      ${blogList.map((p) => newsCard(p)).join("")}
    </div>
  </div>
</section>
<section class="section section--dark" id="linkedin">
  <div class="container">
    <div class="li-head" data-reveal>
      <div class="sec-head" style="margin-bottom:0"><span class="eyebrow">LinkedIn</span><h2 data-i18n="li.title">Live from LinkedIn</h2><p class="lead" data-i18n="li.lead">What we're sharing with the industry, as we post it.</p></div>
      <a class="btn btn--light" href="${LI.source}" target="_blank" rel="noopener"><span data-i18n="li.follow">Follow Schmoll Asia Pacific</span> ${arrow(14)}</a>
    </div>
    <div class="li-grid">
      ${LI.posts.slice(0, 6).map(liCard).join("")}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    <div id="videos" class="sec-head" data-reveal><span class="eyebrow" data-i18n="media.videos">Videos</span><h2>Watch Schmoll in Action</h2><p class="lead">Product demonstrations and exhibition highlights.</p></div>
    <div class="video-grid" data-reveal>
      ${[
        ["SIMPIMA 2026 — Exhibition Reel","https://videos.files.wordpress.com/Q1GHA7sS/simpimav2026.mp4"],
        ["Schmoll Asia Pacific","https://schmoll-asia.com/wp-content/uploads/2024/06/Untitled-design.mp4"],
        ["Machine in Action","https://schmoll-asia.com/wp-content/uploads/2024/07/0807.mp4"],
        ["Precision Drilling","https://schmoll-asia.com/wp-content/uploads/2024/07/08071.mp4"],
        ["Schmoll Showcase","https://schmoll-asia.com/wp-content/uploads/2024/05/0521.mp4"]
      ].map(([t,u],i)=>`<div class="video-card"><video controls preload="none" playsinline poster="assets/img/video/poster-${i+1}.jpg" src="${u}"></video><div class="video-card__cap">${t}</div></div>`).join("")}
    </div>
  </div>
</section>` + GALLERY + CONTACT_CTA;

/* ---------- article pages ---------- */
const renderBlocks = (blocks, liImages) => blocks.map((b) => {
  if (b.t === "h") return `<h${b.level}>${b.text}</h${b.level}>`;
  if (b.t === "p") return `<p>${b.html}</p>`;
  if (b.t === "ul") return `<ul>${b.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  if (b.t === "img") {
    const src = liImages && b.src.startsWith("assets/") ? b.src : newsImg(b.src);
    return `<figure><a data-lightbox="${src}" href="${src}"><img src="${src}" alt="${b.alt || ""}" loading="lazy"></a>${b.caption ? `<figcaption>${b.caption}</figcaption>` : ""}</figure>`;
  }
  return "";
}).join("\n");

const articlePage = (p, prev, next) => {
  const langs = Object.keys(p.translations || {});
  const catLabel = p.category === "blog" ? "Blog" : "News";
  return banner(catLabel, p.title,
    `<a href="news.html" data-i18n="nav.media">Media</a><span>/</span><span data-i18n="media.${p.category}">${catLabel}</span>`,
    postThumb(p)) + `
<article class="section article">
  <div class="container article__wrap">
    <div class="article__meta" data-reveal>
      <span class="news-card__meta">${fmtDate(p.date)}<i></i><span data-i18n="media.${p.category}">${catLabel}</span></span>
      <a class="article__back" href="news.html"><span class="article__back-ico">${arrow(14)}</span> <span data-i18n="art.back">All news</span></a>
    </div>
    <div class="article__body prose" data-article-lang="en" data-reveal>
      ${renderBlocks(p.blocks, p.liFeatured)}
    </div>
    ${langs.map((l) => `<div class="article__body prose" data-article-lang="${l}" hidden>
      <h2 class="article__ttitle">${p.translations[l].title}</h2>
      ${renderBlocks(p.translations[l].blocks, false)}
    </div>`).join("\n")}
    <nav class="article__nav" data-reveal>
      ${prev ? `<a href="${postHref(prev)}"><span class="news-card__meta" data-i18n="art.prev">Previous</span><b>${prev.title}</b></a>` : "<span></span>"}
      ${next ? `<a class="article__nav-next" href="${postHref(next)}"><span class="news-card__meta" data-i18n="art.next">Next</span><b>${next.title}</b></a>` : "<span></span>"}
    </nav>
  </div>
</article>` + CONTACT_CTA;
};

/* ======================================================= MANIFEST */
const PAGES = [
  { file:"about.html",        title:"About — Schmoll Asia Pacific",                         desc:"German quality and innovation in PCB drilling and routing since 1996. 8 offices across 7 countries; 80 years of innovation.", main:about },
  { file:"products.html",     title:"Products — Schmoll Asia Pacific",                      desc:"The full Schmoll machine lineup: Eagle, Hawk, Falcon, RMXY, Raptor, CombiDrill, MDI, XRA3, Automation and Probe Card.", main:productsPage },
  { file:"applications.html", title:"Applications — Schmoll Asia Pacific",                  desc:"CCD, backdrilling, substrate, automation, fixture/probe card, X-ray, laser and EV PCB applications.", main:applicationsPage },
  // team.html is hand-maintained (CEO photo layout + globe.gl script) — edit site/team.html directly, like index.html
  { file:"service.html",      title:"Service — Schmoll Asia Pacific",                       desc:"Maintenance, spare parts, repair and R&D services to keep your Schmoll machines at peak performance.", main:servicePage },
  { file:"careers.html",      title:"Careers — Schmoll Asia Pacific",                       desc:"Start your career with Schmoll — a dynamic, innovative environment for growth.", main:careersPage },
  { file:"contact.html",      title:"Contact — Schmoll Asia Pacific",                       desc:"Contact Schmoll Asia Pacific — 8 offices across 7 countries in Asia Pacific.", main:contactPage },
  { file:"news.html",         title:"Media — Schmoll Asia Pacific",                         desc:"News, blog and videos from Schmoll Asia Pacific.", main:newsPage }
];

// machine detail pages
MACHINES.forEach((m, i) => {
  PAGES.push({
    file: `product-${m.key}.html`,
    title: `${m.name} — Schmoll Asia Pacific`,
    desc: m.tagline.replace(/<[^>]+>/g, ""),
    main: productDetail(m, i)
  });
});

// news/blog article pages (chronological prev/next across both categories)
const withPages = sorted.filter((p) => postHref(p));
withPages.forEach((p, i) => {
  PAGES.push({
    file: postHref(p),
    title: `${p.title} — Schmoll Asia Pacific`,
    desc: postExcerpt(p) || p.title,
    main: articlePage(p, withPages[i + 1], withPages[i - 1])
  });
});

let n = 0;
for (const p of PAGES) {
  fs.writeFileSync(path.join(OUT, p.file), page(p));
  n++;
}
console.log(`Generated ${n} pages → ${OUT}`);
