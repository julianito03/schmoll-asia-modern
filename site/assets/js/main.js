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


  /* ---------- Brochure flip cards (hover on desktop, tap on touch) ---------- */
  const hoverFlips = window.matchMedia("(hover: hover)").matches;
  document.querySelectorAll(".bro-card").forEach((card) => {
    const item = card.closest(".bro-item");
    const set = (on) => {
      item.classList.toggle("is-flipped", on);
      card.setAttribute("aria-pressed", String(on));
    };
    if (hoverFlips) {
      card.addEventListener("mouseenter", () => set(true));
      card.addEventListener("mouseleave", () => set(false));
    } else {
      card.addEventListener("click", () => set(!item.classList.contains("is-flipped")));
    }
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(!item.classList.contains("is-flipped")); }
    });
  });

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

  /* ---------- PCB routing backdrop (homepage products) ---------- */
  // Traces enter from the section's top edge, route down with 45° jogs and
  // draw themselves in sync with scroll; each ends in a via that lights up
  // once its trace is fully routed.
  const pcbHost = document.querySelector("#products .bro-grid") && document.getElementById("products");
  if (pcbHost) {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "pcb-bg");
    svg.setAttribute("aria-hidden", "true");
    pcbHost.prepend(svg);

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let traces = [];

    // Seeded PRNG so the routing is identical on every visit/resize.
    const rng = (seed) => () => {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const progress = () => {
      const r = pcbHost.getBoundingClientRect();
      // 0 when the section top enters the viewport, 1 when its bottom lands
      // at the viewport bottom — traces keep extending the whole way down.
      return Math.max(0, Math.min(1, (innerHeight - r.top) / Math.max(1, r.height)));
    };

    const paint = (p) => {
      for (const t of traces) {
        const f = Math.max(0, Math.min(1, (p - t.stagger) / 0.55));
        t.path.style.strokeDashoffset = t.len * (1 - f);
        t.via.classList.toggle("is-live", f >= 1);
      }
    };

    const build = () => {
      const W = pcbHost.clientWidth, H = pcbHost.clientHeight;
      if (!W || !H) return;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      traces = [];
      const rand = rng(20260710);
      const PITCH = 44;
      const cols = Math.floor(W / PITCH);
      const n = Math.max(6, Math.min(11, Math.round(cols / 3)));
      const used = new Set();
      for (let i = 0; i < n; i++) {
        // Pick a free column with a two-column clearance on either side.
        let c = 1 + Math.floor(rand() * (cols - 2)), guard = 0;
        while ((used.has(c) || used.has(c - 1) || used.has(c + 1) || used.has(c - 2) || used.has(c + 2)) && guard++ < 40)
          c = 1 + Math.floor(rand() * (cols - 2));
        used.add(c);
        let x = c * PITCH, y = -12;
        let d = "M" + x + " " + y;
        const endY = H * (0.5 + rand() * 0.45);
        while (y < endY) {
          y = Math.min(endY, y + PITCH * (2 + Math.floor(rand() * 5)));
          d += " L" + x + " " + y;
          if (y >= endY) break;
          const dir = rand() < 0.5 ? -1 : 1;
          const jog = PITCH * (1 + Math.floor(rand() * 2));
          if (x + dir * jog > PITCH && x + dir * jog < W - PITCH) {
            x += dir * jog; y += jog;
            d += " L" + x + " " + y;
          }
        }
        const roll = rand();
        const tone = roll > 0.86 ? " pcb--red" : roll > 0.64 ? " pcb--blue" : "";
        const path = document.createElementNS(NS, "path");
        path.setAttribute("d", d);
        path.setAttribute("class", "pcb-trace" + tone);
        svg.appendChild(path);
        const via = document.createElementNS(NS, "circle");
        via.setAttribute("cx", x); via.setAttribute("cy", y); via.setAttribute("r", 4);
        via.setAttribute("class", "pcb-via" + tone);
        svg.appendChild(via);
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        traces.push({ path, via, len, stagger: (i / n) * 0.4 });
      }
      paint(reduced ? 1 : progress());
    };

    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; paint(progress()); });
    };

    build();
    if (!reduced) addEventListener("scroll", onScroll, { passive: true });
    // Rebuild when the section resizes (viewport change, images settling).
    let lastH = pcbHost.clientHeight, rt = null;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (Math.abs(pcbHost.clientHeight - lastH) > 40 || pcbHost.clientWidth !== (svg.viewBox.baseVal.width | 0)) {
          lastH = pcbHost.clientHeight;
          build();
        }
      }, 200);
    };
    if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(pcbHost);
    else addEventListener("resize", onResize);
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
