/* Static page generator — no dependencies. Run: node build/build.js
   Generates interior pages into ../site/ using shared chrome from partials.js. */
const fs = require("fs");
const path = require("path");
const { CONTACT_CTA, page } = require("./partials.js");
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
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,90px);align-items:start">
      <div class="prose" data-reveal>
        <span class="eyebrow">Our Mission</span>
        <h2 style="margin:16px 0 22px">Precision engineering, in Asia since 1996</h2>
        <p>Schmoll has offered German quality and innovation across Asia since 1996, operating as a leading PCB drilling and routing machinery provider. Our machines are built on precision-engineering fundamentals: high-speed linear motors, granite machine bases for superior stability, and sophisticated tool adjustment systems.</p>
        <p>We help you meet your expectations with efficient solutions and machinery — your technology partner and a solution provider you can trust.</p>
      </div>
      <div data-reveal data-delay="1">
        <div class="prod-grid" style="grid-template-columns:1fr 1fr">
          <div class="prod-card" style="min-height:auto"><span class="prod-card__no">A1</span><h3 style="margin-top:10px">8 Offices</h3><p>Across 7 countries — China (2), Taiwan, Malaysia, Thailand, Korea, Hong Kong &amp; Vietnam.</p></div>
          <div class="prod-card" style="min-height:auto"><span class="prod-card__no">A2</span><h3 style="margin-top:10px">80+ Years</h3><p>Of continuous innovation in PCB manufacturing technology.</p></div>
          <div class="prod-card" style="min-height:auto"><span class="prod-card__no">A3</span><h3 style="margin-top:10px">German Engineering</h3><p>Linear motors, granite bases and precision tooling.</p></div>
          <div class="prod-card" style="min-height:auto"><span class="prod-card__no">A4</span><h3 style="margin-top:10px">Full Lifecycle</h3><p>Maintenance, spare parts, repair and R&amp;D support.</p></div>
        </div>
      </div>
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
</section>` + CONTACT_CTA;

/* ======================================================= PRODUCTS */
const products = [
  ["eagle","Eagle Series","Drilling · Depth Control","Special-application microdrilling with Contact Bit Detection depth control. S80 controller, AI-driven linear motors, solid granite structure."],
  ["hawk","Hawk Series","Drilling · High-End","High-end microdrilling and depth control. S80 Next-Gen high-speed controller with Industry 4.0 connectivity."],
  ["falcon","Falcon Series","Drilling · Substrate","Substrate drilling precision engineered for IC substrate and HDI production (FS / FT / FXY)."],
  ["rmxy","RMXY Series","Routing","Precision PCB routing built on the MXY motion concept."],
  ["raptor","Raptor Series","Routing · CCD","XY CCD routing for contour and depth — clean, accurate profiling (RXY-6)."],
  ["combidrill","CombiDrill 500","Laser Drilling","Hybrid UV-CO₂ laser drilling for microvias and advanced HDI structures."],
  ["mdi","MDI Series","Direct Imaging","Soldermask direct imaging (TTG SolderBeam) for fine-line, maskless patterning."],
  ["xra3","XRA3 Series","X-Ray","Full-panel X-ray inspection, registration and drilling — XRA3 &amp; XRA3-XXL."],
  ["automation","Automation Series","Automation","PCB drill-room automation: ALS, QLB, DTE and ACC for lights-out productivity."],
  ["probecard","Probe Card / Fixture","Fixture / Probe Card","Probe-card and fixture solutions — Fixture Nano / Fixture 1 / MX 1, EXY-CCD."]
];
const productsPage = banner('Products', 'You Name It, We Have It', '<span>Products</span>', 'assets/img/facility-3.jpg') + `
<section class="section">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow">Cutting-Edge Technology</span><h2>The Schmoll Machine Lineup</h2><p class="lead">Our machines leverage artificial intelligence to enhance operational efficiency — dynamically adjusting settings and measurements with machine learning for optimal performance and high-quality standards in every operation.</p></div>
    <div class="prod-grid" data-reveal>
      ${products.map((p,i)=>`<a class="prod-card" id="${p[0]}" href="#${p[0]}"><span class="prod-card__no">${String(i+1).padStart(2,"0")}</span><span class="prod-card__cat">${p[2]}</span><h3>${p[1]}</h3><p>${p[3]}</p><span class="prod-card__arrow">${arrow(20)}</span></a>`).join("")}
      <a class="prod-card prod-card--feature" href="contact.html" style="grid-column:span 8;flex-direction:row;align-items:center;justify-content:space-between;gap:24px;min-height:auto"><div><span class="prod-card__no">→</span><h3 style="margin:8px 0 6px">Can't find the right machine?</h3><p>Talk to our engineers — we have a solution for your needs.</p></div><span class="btn btn--light">Contact ${arrow(14)}</span></a>
    </div>
  </div>
</section>` + CONTACT_CTA;

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
const applicationsPage = banner('Application', 'Discover our Applications', '<span>Application</span>') + `
<section class="section">
  <div class="container">
    <div class="grid" style="gap:1px;background:var(--line);border:1px solid var(--line);grid-template-columns:1fr">
      ${apps.map((a,i)=>`
      <div id="${a[0]}" style="background:#fff;padding:clamp(28px,4vw,52px);scroll-margin-top:90px" data-reveal>
        <div class="grid" style="grid-template-columns:64px 1fr 220px;gap:clamp(20px,3vw,40px);align-items:center">
          <svg viewBox="0 0 32 32" width="46" height="46" fill="none" style="color:var(--red)" aria-hidden="true">${appIcons[a[0]]}</svg>
          <div><span class="prod-card__no">A${String(i+1).padStart(2,"0")}</span><h3 style="margin:8px 0 8px">${a[1]}</h3><p style="max-width:60ch">${a[2]}</p></div>
          <div style="text-align:right"><a class="tlink" href="contact.html">Enquire ${arrow(13)}</a></div>
        </div>
      </div>`).join("")}
    </div>
  </div>
</section>` + CONTACT_CTA;

/* ======================================================= TEAM */
const cLevel = [["Thomas Kuhn","Chief Technology Officer &amp; Vietnam BM"],["Enno Bronnmann","Chief Technology Officer"],["Elmar Streich","Chief Operations Officer"],["Oliver Amann","Chief Sales Officer &amp; Dongguan GM"],["Cynthia Hung","Group Accounting Manager"],["Marc Su","Group Technology Support"]];
const localMgmt = [["Eric Thum","Malaysia · GM"],["Ken Liu","Taiwan · GM"],["Tkay Jeong","Korea · GM"],["Michael Dammann","Thailand · GM"],["Martin Jeschke","Kunshan China · GM"]];
const vps = [["Tracy Liang","Sales VP China"],["Jacky Yang","Technology VP China"],["Vincent Tung","Sales VP Taiwan"]];
const roster = (arr)=>`<div class="roster">${arr.map(([n,t])=>`<div class="roster__item"><b>${n}</b><span>${t}</span></div>`).join("")}</div>`;
const teamPage = banner('Team', 'Meet our Team', '<span>Team</span>', 'assets/img/team-hero.jpg') + `
<section class="section">
  <div class="container">
    <div class="lead-card" data-reveal>
      <div class="lead-card__cell">
        <span class="eyebrow lead-card__role">Schmoll Group CEO</span>
        <h3>Thomas Kunz</h3>
        <p>Thomas Kunz stepped up to lead Schmoll Maschinen GmbH at the age of 33 when the company was struggling with insolvency. Over the last 32 years, his visionary leadership and steadfast determination have driven Schmoll to become a leader in the PCB industry.</p>
      </div>
      <div class="lead-card__cell">
        <span class="eyebrow lead-card__role">Schmoll Asia Pacific CEO</span>
        <h3>Joachim Ruff</h3>
        <blockquote>With 35 years of experience in running businesses and 30 years in the PCB industry, I consider myself the silverback of the company. My aim is to build a promising future for the next generation.</blockquote>
      </div>
    </div>
    <div class="roster__group">C-Level Team · Asia</div>
    ${roster(cLevel)}
    <div class="roster__group">Local Management</div>
    ${roster(localMgmt)}
    <div class="roster__group">Vice Presidents</div>
    ${roster(vps)}
  </div>
</section>` + CONTACT_CTA;

/* ======================================================= SERVICE */
const servicePage = banner('Service', 'Got a Problem? Schmoll is Here.', '<span>Service</span>') + `
<section class="section">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow" data-i18n="svc.eyebrow">Service</span><h2 data-i18n="svc.title">Got a Problem? Schmoll is Here.</h2><p class="lead" data-i18n="svc.body">With expertise spanning various domains, we ensure that every challenge is met with a tailored solution.</p></div>
    <div class="svc-list" data-reveal>
      <div class="svc-item"><span class="svc-item__no">01</span><h3 data-i18n="svc.maint">Maintenance</h3><p>Reliable &amp; efficient preventive and corrective maintenance to keep your machines at peak performance.</p></div>
      <div class="svc-item"><span class="svc-item__no">02</span><h3 data-i18n="svc.spare">Spare Parts</h3><p>Comprehensive &amp; prompt supply of genuine Schmoll spare parts, minimising downtime.</p></div>
      <div class="svc-item"><span class="svc-item__no">03</span><h3 data-i18n="svc.repair">Repair</h3><p>Expert &amp; responsive repair services delivered by experienced engineers.</p></div>
      <div class="svc-item"><span class="svc-item__no">04</span><h3 data-i18n="svc.rnd">R&amp;D Center</h3><p>Innovative &amp; cutting-edge research and development to advance your process.</p></div>
    </div>
  </div>
</section>` + CONTACT_CTA;

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
</section>` + CONTACT_CTA;

/* ======================================================= CONTACT */
const offices = [
  ["China — Dongguan","Dongguan Schmoll Electronic Equipment Co., Ltd","+86-(0)769-2241-9199","F1,F3 Block G, LianShang Intelligent Manufacturing Park, ChuangRing Road, DiChong Village, Gaobu Town, Dongguan City, Guangdong Province, China",false],
  ["Taiwan","Schmoll Asia Pacific Ltd. Taiwan Branch (H.K.)","+886-(0)3-358-3808","5F., No. 117, Long'an St., Taoyuan Dist., Taoyuan City, Taiwan 33033",false],
  ["China — Kunshan","Schmoll PCB Equipment (Kunshan) Co., Ltd.","+86-(0)512-5737 1850","5th Floor, Building No.4, No.1367 Juxiang Road, Zhangpu Town 215300 Kunshan, Jiangsu Province, P.R. China",false],
  ["Malaysia — Penang","Schmoll Asia Pacific (Malaysia) Sdn Bhd","+60 (0)4 5897396","1-27, Utropolis, Utama, Persiaran Cassia Barat 3, 14110 Bandar, Cassia, Pulau Pinang",false],
  ["Thailand — Bangkok","Schmoll Asia Pacific (Thailand) Ltd.","+66 (0) 2 10 72 923","Head Office no.1023, Room 158, 15th Floor, MS SIAM TOWER, Rama III Road, Khwaeng Chong Nonsi, Khet Yan Nawa, Bangkok 10120",false],
  ["Korea — Ansan","Schmoll Asia Pacific Korea Co., Ltd.","+82-031-497-8779","#616, Ansan Smartsquare, 325, Sandan-ro, Danwon-gu, Ansan-si, Gyeonggi-do, Republic of Korea",false],
  ["China — Hong Kong","Schmoll Asia Pacific Limited","+852-28-505-909","Room 1803, 18/F, Chinachem Exchange Square, 1 Hoi Wan Street, Quarry Bay, Hong Kong",false],
  ["Vietnam","Schmoll Asia Pacific Vietnam Company Limited","","Room 232, 2nd Floor, Hoang Ha Building, Le Thai To Street, Vo Cuong Ward, Bac Ninh Province, Vietnam",true],
  ["Germany — Headquarters","Schmoll Maschinen GmbH","","Parent company · Rödermark, Germany — schmoll-maschinen.de",false]
];
const pin = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5c-2.5 0-4.5 2-4.5 4.5C3.5 9.5 8 14.5 8 14.5s4.5-5 4.5-8.5C12.5 3.5 10.5 1.5 8 1.5z" stroke="currentColor"/><circle cx="8" cy="6" r="1.6" stroke="currentColor"/></svg>';
const phoneIco = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 2.5h3l1 3-2 1.2a8 8 0 003.8 3.8l1.2-2 3 1V13a1.5 1.5 0 01-1.6 1.5A11.5 11.5 0 012.5 4.1 1.5 1.5 0 014 2.5z" stroke="currentColor"/></svg>';
const mailIco = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" stroke="currentColor"/><path d="M2.5 4l5.5 4.5L13.5 4" stroke="currentColor"/></svg>';
const contactPage = banner('Contact', 'Contact Us', '<span>Contact</span>') + `
<section class="section">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow">Global Presence</span><h2>8 Offices · 7 Countries</h2><p class="lead">Find your nearest Schmoll Asia Pacific office.</p></div>
    <div class="office-grid" data-reveal>
      ${offices.map(([region,co,phone,addr,soon])=>`
      <div class="office${soon?' office--soon':''}">
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
const news = [
  ["06 Apr 2026","CPCA Show 2026 | Best PCB Equipment for AI Data servers","As AI infrastructure continues to expand, PCB manufacturers are facing increasing requirements for precision, performance, and process reliability."],
  ["09 Dec 2025","HKPCA 2025 | Schmoll Asia | Best PCB Equipment Solutions in Asia | 30 years anniversary",""],
  ["22 Apr 2025","Successful Participation at CPCA Show 2025 in Shanghai",""],
  ["18 Dec 2024","Schmoll Asia Pacific Concludes a Successful Year at the HKPCA Show 2024",""],
  ["26 Nov 2024","Schmoll Asia Pacific Showcases PCB Technology at CPCA 2024",""],
  ["07 Nov 2024","Schmoll Asia Pacific's Success at TPCA Show 2024",""],
  ["25 Sep 2024","Celebrating A Successful KPCA Show 2024: Innovation, Collaboration, And Growth",""],
  ["28 Jun 2024","Schmoll Asia Pacific New Website",""]
];
const blog = [
  ["06 Apr 2026","CPCA Show 2026 | Best PCB Equipment for AI Data servers"],
  ["09 Dec 2025","HKPCA 2025 | Schmoll Asia | 30 years anniversary"],
  ["11 Sep 2025","Granite — Schmoll's Best Option On The Market"],
  ["22 Aug 2025","Difference between Schmoll Asia and Schmoll Maschinen"],
  ["07 Aug 2025","WUS Printed Circuit's Expansion Powered by Schmoll Asia Pacific's Technology"],
  ["01 Jul 2025","Celebrating a Strong Partnership: Larry Gao"]
];
const newsPage = banner('Media', 'News &amp; Insights', '<span>Media</span>') + `
<section class="section">
  <div class="container">
    <div class="sec-head" data-reveal><span class="eyebrow" data-i18n="media.news">News</span><h2>Latest from Schmoll</h2></div>
    <div class="grid" style="gap:1px;background:var(--line);border:1px solid var(--line)">
      ${news.map((n,i)=>`<a href="#" class="office" style="display:grid;grid-template-columns:140px 1fr 40px;gap:24px;align-items:center;background:#fff"${i===0?' ':''}>
        <span class="prod-card__no" style="font-size:.78rem">${n[0]}</span>
        <div><h3 style="font-size:1.1rem;margin-bottom:${n[2]?'8px':'0'}">${n[1]}</h3>${n[2]?`<p style="font-size:.92rem">${n[2]}</p>`:''}</div>
        <span style="color:var(--grey-400)">${arrow(18)}</span>
      </a>`).join("")}
    </div>

    <div id="blog" class="sec-head" style="margin-top:80px" data-reveal><span class="eyebrow" data-i18n="media.blog">Blog</span><h2>From the Schmoll Blog</h2></div>
    <div class="roster" data-reveal style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
      ${blog.map(([d,t])=>`<a href="#" class="roster__item" style="display:block"><span style="font-family:var(--font-mono);font-size:.72rem;color:var(--red);letter-spacing:.1em">${d}</span><b style="margin-top:8px;font-size:1rem;text-transform:none;letter-spacing:0">${t}</b></a>`).join("")}
    </div>

    <div id="videos" class="sec-head" style="margin-top:80px" data-reveal><span class="eyebrow" data-i18n="media.videos">Videos</span><h2>Watch Schmoll in Action</h2><p class="lead">Product demonstrations and exhibition highlights.</p></div>
  </div>
</section>` + CONTACT_CTA;

/* ======================================================= MANIFEST */
const PAGES = [
  { file:"about.html",        title:"About — Schmoll Asia Pacific",                         desc:"German quality and innovation in PCB drilling and routing since 1996. 8 offices across 7 countries; 80 years of innovation.", main:about },
  { file:"products.html",     title:"Products — Schmoll Asia Pacific",                      desc:"The full Schmoll machine lineup: Eagle, Hawk, Falcon, RMXY, Raptor, CombiDrill, MDI, XRA3, Automation and Probe Card.", main:productsPage },
  { file:"applications.html", title:"Applications — Schmoll Asia Pacific",                  desc:"CCD, backdrilling, substrate, automation, fixture/probe card, X-ray, laser and EV PCB applications.", main:applicationsPage },
  { file:"team.html",         title:"Team — Schmoll Asia Pacific",                          desc:"Meet the leadership and management team behind Schmoll Asia Pacific.", main:teamPage },
  { file:"service.html",      title:"Service — Schmoll Asia Pacific",                       desc:"Maintenance, spare parts, repair and R&D services to keep your Schmoll machines at peak performance.", main:servicePage },
  { file:"careers.html",      title:"Careers — Schmoll Asia Pacific",                       desc:"Start your career with Schmoll — a dynamic, innovative environment for growth.", main:careersPage },
  { file:"contact.html",      title:"Contact — Schmoll Asia Pacific",                       desc:"Contact Schmoll Asia Pacific — 8 offices across 7 countries in Asia Pacific.", main:contactPage },
  { file:"news.html",         title:"Media — Schmoll Asia Pacific",                         desc:"News, blog and videos from Schmoll Asia Pacific.", main:newsPage }
];

let n = 0;
for (const p of PAGES) {
  fs.writeFileSync(path.join(OUT, p.file), page(p));
  n++;
}
console.log(`Generated ${n} pages → ${OUT}`);
