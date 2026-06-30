/* =========================================================================
   SCHMOLL ASIA PACIFIC — interactions + i18n
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("is-mobile-open");
      const open = nav.classList.contains("is-mobile-open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  /* ---------- Dropdowns (click on mobile, hover on desktop via CSS) ---------- */
  document.querySelectorAll(".menu > li.has-dropdown").forEach((li) => {
    const btn = li.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = li.classList.contains("is-open");
      document.querySelectorAll(".menu > li.is-open").forEach((o) => o.classList.remove("is-open"));
      if (!wasOpen) li.classList.add("is-open");
    });
    // desktop hover
    li.addEventListener("mouseenter", () => { if (window.innerWidth > 860) li.classList.add("is-open"); });
    li.addEventListener("mouseleave", () => { if (window.innerWidth > 860) li.classList.remove("is-open"); });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".menu > li.is-open").forEach((o) => o.classList.remove("is-open"));
  });

  /* ---------- Sticky header hide on scroll down ---------- */
  const header = document.querySelector(".site-header");
  let lastY = 0;
  if (header) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > 400 && y > lastY) header.style.transform = "translateY(-100%)";
      else header.style.transform = "translateY(0)";
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  if (location.search.indexOf("allvis")>-1) document.querySelectorAll("[data-reveal]").forEach(function(e){e.classList.add("is-visible")});
  const reveal = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveal.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Count-up stats ---------- */
  function animateCount(el) {
    if (el.dataset.counted) return;
    const html = el.innerHTML;
    const m = html.match(/^(\d[\d,]*)/);
    if (!m) return;
    const target = parseInt(m[1].replace(/,/g, ""), 10);
    const suffix = html.slice(m[1].length);
    if (!target) return;
    el.dataset.counted = "1";
    const dur = 1500, t0 = performance.now();
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.innerHTML = v.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  const counters = document.querySelectorAll(".stat__num");
  if ("IntersectionObserver" in window && counters.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Lightbox for gallery images ---------- */
  const lb = document.createElement("div");
  lb.className = "lightbox"; lb.innerHTML = '<img alt=""><button class="lightbox__x" aria-label="Close">&times;</button>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");
  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", () => { lbImg.src = el.getAttribute("href") || el.dataset.lightbox || el.querySelector("img")?.src; lb.classList.add("is-open"); });
    if (el.tagName === "A") el.addEventListener("click", (e) => e.preventDefault());
  });
  lb.addEventListener("click", () => lb.classList.remove("is-open"));

  /* ---------- Forms (front-end only demo) ---------- */
  document.querySelectorAll("form[data-demo]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = f.querySelector("[type=submit]");
      if (btn) { const t = btn.textContent; btn.textContent = "✓ " + (btn.dataset.sent || "Sent"); btn.disabled = true; setTimeout(() => { btn.textContent = t; btn.disabled = false; f.reset(); }, 2600); }
    });
  });

  /* =======================================================================
     i18n
     ======================================================================= */
  const I18N = window.SCHMOLL_I18N || {};
  const RTL = [];
  const LANGS = [
    { code: "en",    label: "English",   tag: "EN" },
    { code: "zh",    label: "简体中文",   tag: "ZH" },
    { code: "zh-hk", label: "繁體中文",   tag: "HK" },
    { code: "ko",    label: "한국어",     tag: "KO" },
    { code: "ms",    label: "Bahasa Melayu", tag: "MS" },
    { code: "th",    label: "ไทย",        tag: "TH" },
    { code: "vi",    label: "Tiếng Việt", tag: "VI" }
  ];

  function applyLang(code) {
    const dict = I18N[code] || {};
    const en = I18N.en || {};
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key] != null ? dict[key] : en[key];
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.getAttribute("data-i18n-ph");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });
    document.documentElement.lang = code;
    document.documentElement.dir = RTL.includes(code) ? "rtl" : "ltr";
    try { localStorage.setItem("sap_lang", code); } catch (e) {}
    // reflect in switcher
    const cur = LANGS.find((l) => l.code === code);
    const tagEl = document.querySelector(".lang__current");
    if (tagEl && cur) tagEl.textContent = cur.tag;
    document.querySelectorAll(".lang__menu button").forEach((b) => {
      b.setAttribute("aria-current", String(b.dataset.lang === code));
    });
  }

  // build language menu
  const langMenu = document.querySelector(".lang__menu");
  if (langMenu) {
    langMenu.innerHTML = LANGS.map((l) =>
      `<button type="button" data-lang="${l.code}">${l.label}<span>${l.tag}</span></button>`
    ).join("");
    langMenu.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => { applyLang(b.dataset.lang); document.querySelector(".lang").classList.remove("is-open"); });
    });
  }
  const langBtn = document.querySelector(".lang__btn");
  if (langBtn) {
    langBtn.addEventListener("click", (e) => { e.stopPropagation(); document.querySelector(".lang").classList.toggle("is-open"); });
    document.addEventListener("click", () => document.querySelector(".lang")?.classList.remove("is-open"));
  }

  // initial language: ?lang= param > saved choice > browser > en
  let initial = "en";
  try {
    const param = new URLSearchParams(location.search).get("lang");
    const saved = localStorage.getItem("sap_lang");
    const codes = LANGS.map((l) => l.code);
    if (param && codes.includes(param)) initial = param;
    else if (saved && codes.includes(saved)) initial = saved;
    else {
      const nav = (navigator.language || "en").toLowerCase();
      const hit = codes.find((c) => nav === c || nav.startsWith(c + "-") || nav.startsWith(c));
      if (hit) initial = hit;
    }
  } catch (e) {}
  if (Object.keys(I18N).length) applyLang(initial);

  /* ---------- Hero slideshow ---------- */
  const show = document.querySelector("[data-slideshow]");
  if (show) {
    const slides = Array.from(show.querySelectorAll(".hero__slide"));
    if (slides.length > 1) {
      let idx = 0;
      const INTERVAL = 5500;
      let timer = null;
      const advance = () => {
        slides[idx].classList.remove("is-active");
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add("is-active");
      };
      const start = () => { if (!timer) timer = setInterval(advance, INTERVAL); };
      const stop = () => { clearInterval(timer); timer = null; };
      // Pause when the tab is hidden so it doesn't drift.
      document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
      start();
    }
  }

  /* ---------- Preloader ---------- */
  const pre = document.getElementById("preloader");
  if (pre) {
    const hide = () => {
      pre.classList.add("is-done");
      try { sessionStorage.setItem("sap_loaded", "1"); } catch (e) {}
      setTimeout(() => { pre.remove(); }, 800);
    };
    // Keep the splash up so the brand reads, then fade after load.
    const MIN = 2200;
    const start = Date.now();
    const run = () => setTimeout(hide, Math.max(0, MIN - (Date.now() - start)));
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
    // Safety net in case load never fires.
    setTimeout(hide, 6000);
  }

  /* ---------- Year ---------- */
  const yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
