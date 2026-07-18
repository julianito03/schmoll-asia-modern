/* Shared chrome for all pages. Single source of truth. */

const HEADER = `<header class="site-header">
  <div class="container">
    <nav class="nav" aria-label="Primary">
      <a class="logo" href="index.html" aria-label="Schmoll Asia Pacific — home"><img class="logo-img" src="assets/img/logo-sap.png?v=10" alt="Schmoll Asia Pacific"></a>

      <ul class="menu">
        <li><a href="about.html" data-i18n="nav.about">About</a></li>
        <li><a href="team.html" data-i18n="nav.team">Team</a></li>
        <li><a href="products.html" data-i18n="nav.products">Products</a></li>
        <li class="has-dropdown">
          <button type="button" aria-haspopup="true" aria-expanded="false"><span data-i18n="nav.application">Applications</span>
            <svg class="caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button>
          <div class="dropdown">
            <a href="applications.html#ccd" data-i18n="app.ccd">CCD Application</a>
            <a href="applications.html#backdrilling" data-i18n="app.backdrilling">Backdrilling</a>
            <a href="applications.html#substrate" data-i18n="app.substrate">Substrate</a>
            <a href="applications.html#automation" data-i18n="app.automation">Automation</a>
            <a href="applications.html#fixture" data-i18n="app.fixture">Fixture / Probe Card</a>
            <a href="applications.html#xray" data-i18n="app.xray">XRay – XRA3</a>
            <a href="applications.html#laser" data-i18n="app.laser">Laser</a>
            <a href="applications.html#ev" data-i18n="app.ev">Electric Vehicle</a>
          </div>
        </li>
        <li><a href="service.html" data-i18n="nav.service">Service</a></li>
        <li><a href="careers.html" data-i18n="nav.careers">Careers</a></li>
        <li class="has-dropdown">
          <button type="button" aria-haspopup="true" aria-expanded="false"><span data-i18n="nav.media">Media</span>
            <svg class="caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button>
          <div class="dropdown">
            <a href="news.html" data-i18n="media.news">News</a>
            <a href="news.html#insights" data-i18n="media.blog">Blog</a>
            <a href="news.html#videos" data-i18n="media.videos">Videos</a>
          </div>
        </li>
      </ul>
      <div class="nav__right">
        <div class="lang">
          <button class="lang__btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Select language">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" stroke="currentColor" stroke-width="1.8"/></svg>
          </button>
          <div class="lang__menu" role="menu"></div>
        </div>
        <a href="contact.html" class="btn nav__connect" data-i18n="btn.connect">Connect</a>
        <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </nav>
  </div>
</header>`;

/* Animated PCB-trace background for the footer — current flows along the copper
   (dash animation) with travelling signal pulses. */
const FOOT_TRACES = [
  'M-20 54 H320 l28 28 H760 l28 -28 H1460',
  'M-20 132 H200 l32 32 H660 l24 24 H1460',
  'M-20 214 H420 l32 -32 H980 l28 28 H1460',
  'M-20 300 H260 l30 -30 H820 l34 34 H1460',
  'M-20 366 H540 l30 -30 H1120 H1460',
  'M348 82 V214',
  'M1148 242 V366'
];
const FOOT_VIAS = [[348,82],[232,164],[452,182],[760,54],[820,270],[1148,242]];
const FOOT_PCB_BG = '<svg class="footer-pcb" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">'
  + '<g class="footer-pcb__base">' + FOOT_TRACES.map((d, i) => `<path id="ft${i}" d="${d}"/>`).join('') + '</g>'
  + '<g class="footer-pcb__flow">' + FOOT_TRACES.map((d) => `<path d="${d}"/>`).join('') + '</g>'
  + '<g class="footer-pcb__via">' + FOOT_VIAS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('') + '</g>'
  + '<g class="footer-pcb__spark">' + FOOT_TRACES.map((d) => `<path d="${d}"/>`).join('') + '</g>'
  + '</svg>';

const FOOTER = `<footer class="site-footer">
  ${FOOT_PCB_BG}
  <div class="container">
    <div class="footer-grid">

      <div class="footer-brand">
        <img class="footer-brand__word" src="assets/img/logo-sap-white.png?v=10" alt="Schmoll Asia Pacific">
        <p class="footer-brand__tag" data-i18n="foot.tagline">German-engineered precision, automation and high-performance solutions for PCB manufacturing across Asia Pacific.</p>
        <div class="footer-wechat">
          <span class="footer-tick" data-i18n="foot.wechat">Our WeChat</span>
          <img src="assets/img/wechat-qr.png" alt="Schmoll Asia Pacific WeChat QR code" width="92" height="92" loading="lazy">
        </div>
      </div>

      <div class="footer-col">
        <h4 data-i18n="foot.channels">Channels</h4>
        <a href="about.html" data-i18n="nav.about">About</a>
        <a href="products.html" data-i18n="nav.products">Products</a>
        <a href="team.html" data-i18n="nav.team">Team</a>
        <a href="news.html" data-i18n="nav.media">Media</a>
      </div>

      <div class="footer-col">
        <h4 data-i18n="foot.legal">Legal</h4>
        <a href="#" data-i18n="foot.terms">Term of use</a>
        <a href="#" data-i18n="foot.privacy">Privacy Policy</a>
        <a href="#" data-i18n="foot.cookie">Cookie Policy</a>
      </div>

      <div class="footer-col">
        <h4 data-i18n="foot.questions">You have questions?</h4>
        <a href="contact.html" data-i18n="nav.contact">Contact</a>
        <a href="careers.html" data-i18n="nav.careers">Careers</a>
        <a class="footer-mail" href="mailto:sales@schmoll-asia.com">sales@schmoll-asia.com</a>
        <a class="footer-mail" href="mailto:career@schmoll-asia.com">career@schmoll-asia.com</a>
      </div>

    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Schmoll Asia Pacific · <span data-i18n="foot.rights">All rights reserved.</span></span>
    </div>
  </div>
</footer>`;

/* Reusable contact CTA block (used at the bottom of most pages) */
const CONTACT_CTA = `<section class="section section--alt" id="contact">
  <div class="container">
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,90px);align-items:center">
      <div data-reveal>
        <span class="eyebrow" data-i18n="ct.eyebrow">Contact</span>
        <h2 style="margin:18px 0 16px" data-i18n="ct.title">Let's get in touch</h2>
        <p class="lead" data-i18n="ct.sub">Provide us with your details and our team will contact you!</p>
        <p style="margin-top:24px;font-family:var(--font-mono);font-size:.82rem;letter-spacing:.04em"><a href="mailto:sales@schmoll-asia.com" style="color:var(--red)">sales@schmoll-asia.com</a></p>
      </div>
      <form class="form" data-demo data-reveal data-delay="1">
        <div class="form__row"><label data-i18n="ct.name">Name</label><input name="name" type="text" required data-i18n-ph="ct.name"></div>
        <div class="form__row"><label data-i18n="ct.email">Email</label><input name="email" type="email" required data-i18n-ph="ct.email"></div>
        <div class="form__row"><label data-i18n="ct.company">Company Name</label><input name="company" type="text" data-i18n-ph="ct.company"></div>
        <button class="btn btn--lg" type="submit" data-sent="Sent" data-i18n="btn.connect">Connect</button>
        <p class="form__note" data-i18n="ct.note">*Your email is safe with us, we don't spam.</p>
      </form>
    </div>
  </div>
</section>`;

function page({ title, desc, main, lang = "en", head = "", scripts = "" }) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="icon" href="assets/monogram.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Roboto+Slab:wght@300;400;500;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css?v=89">
${head}</head>
<body>
<a class="skip-link" href="#main" data-i18n="a11y.skip">Skip to content</a>
${HEADER}
<main id="main">
${main}
</main>
${FOOTER}
<script src="assets/js/i18n.js?v=48"></script>
<script src="assets/js/main.js?v=49"></script>
${scripts}</body>
</html>`;
}

module.exports = { HEADER, FOOTER, CONTACT_CTA, page };
