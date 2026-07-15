/* Media hub behaviour: type/topic filters, search, URL state, load-more,
   poster-first Video Lab. All content is server-rendered; this only enhances. */
(function () {
  "use strict";

  var PAGE_SIZE = 9;
  var feed = document.getElementById("media-feed");
  if (!feed) return;

  var cards = Array.prototype.slice.call(feed.querySelectorAll(".media-card"));
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".media-toolbar__filters button"));
  var searchInput = document.getElementById("media-search");
  var countEl = document.getElementById("media-count");
  var emptyEl = document.getElementById("media-empty");
  var moreBtn = document.getElementById("media-loadmore");
  var clearBtn = document.getElementById("media-clear");

  var state = { type: "all", topic: "", q: "", shown: PAGE_SIZE };

  function t(key, fallback) {
    try {
      var lang = localStorage.getItem("sap_lang") || "en";
      var dict = (window.SCHMOLL_I18N || {})[lang] || {};
      return dict[key] || (window.SCHMOLL_I18N || {}).en[key] || fallback;
    } catch (e) { return fallback; }
  }

  function matches(card) {
    if (state.type !== "all" && card.dataset.type !== state.type) return false;
    if (state.topic && (" " + card.dataset.topics + " ").indexOf(" " + state.topic + " ") === -1) return false;
    if (state.q) {
      var hay = (card.dataset.search || "").toLowerCase();
      var terms = state.q.toLowerCase().trim().split(/\s+/);
      for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }

  function apply(pushUrl) {
    var visible = 0, total = 0;
    cards.forEach(function (card) {
      var ok = matches(card);
      if (ok) total++;
      var show = ok && total <= state.shown;
      card.hidden = !show;
      if (show) visible++;
    });
    emptyEl.hidden = total !== 0;
    moreBtn.hidden = total <= state.shown;
    countEl.textContent = total + " " + t("m.results", "results");
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === state.type)); });

    if (pushUrl) {
      var params = new URLSearchParams(location.search);
      ["type", "topic", "q"].forEach(function (k) {
        if (state[k] && !(k === "type" && state.type === "all")) params.set(k, state[k]);
        else params.delete(k);
      });
      var qs = params.toString();
      history.pushState(state, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    }
  }

  function readUrl() {
    var params = new URLSearchParams(location.search);
    state.type = params.get("type") || "all";
    state.topic = params.get("topic") || "";
    state.q = params.get("q") || "";
    state.shown = PAGE_SIZE;
    if (searchInput) searchInput.value = state.q;
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      state.type = b.dataset.filter;
      state.shown = PAGE_SIZE;
      apply(true);
    });
  });

  if (searchInput) {
    var timer;
    searchInput.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.q = searchInput.value.trim();
        state.shown = PAGE_SIZE;
        apply(true);
      }, 220);
    });
  }

  moreBtn.addEventListener("click", function () {
    state.shown += PAGE_SIZE;
    apply(false);
  });

  if (clearBtn) clearBtn.addEventListener("click", function () {
    state.type = "all"; state.topic = ""; state.q = "";
    state.shown = PAGE_SIZE;
    if (searchInput) searchInput.value = "";
    apply(true);
  });

  // topic index buttons filter the feed and scroll to it
  document.querySelectorAll("[data-topic]").forEach(function (b) {
    b.addEventListener("click", function () {
      state.topic = state.topic === b.dataset.topic ? "" : b.dataset.topic;
      state.type = "all";
      state.shown = PAGE_SIZE;
      apply(true);
      document.getElementById("feed").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  window.addEventListener("popstate", function () { readUrl(); apply(false); });
  readUrl();
  apply(false);

  /* ---------- Video Lab: poster-first, single active video ---------- */
  var stage = document.getElementById("video-stage");
  var playBtn = document.getElementById("video-play");
  var titleEl = document.getElementById("video-title");
  var descEl = document.getElementById("video-desc");
  var activeVideo = null;

  function loadVideo(src, autoplay) {
    if (activeVideo) { activeVideo.pause(); activeVideo.remove(); activeVideo = null; }
    var poster = document.getElementById("video-poster");
    if (poster) poster.hidden = true;
    playBtn.hidden = true;
    var v = document.createElement("video");
    v.controls = true;
    v.playsInline = true;
    v.src = src;
    v.setAttribute("aria-label", titleEl.textContent);
    v.addEventListener("error", function () {
      playBtn.hidden = false;
      if (poster) poster.hidden = false;
      descEl.textContent = t("m.videoerror", "This video is temporarily unavailable.");
    });
    stage.appendChild(v);
    activeVideo = v;
    if (autoplay) v.play().catch(function () {});
  }

  if (playBtn) playBtn.addEventListener("click", function () { loadVideo(playBtn.dataset.src, true); });

  document.querySelectorAll(".video-lab__item").forEach(function (item) {
    item.addEventListener("click", function () {
      document.querySelectorAll(".video-lab__item").forEach(function (x) { x.classList.remove("is-active"); });
      item.classList.add("is-active");
      titleEl.textContent = item.dataset.title;
      descEl.textContent = item.dataset.desc || "";
      var poster = document.getElementById("video-poster");
      if (poster) { poster.src = item.dataset.poster; poster.hidden = false; }
      playBtn.dataset.src = item.dataset.src;
      playBtn.hidden = false;
      playBtn.setAttribute("aria-label", "Play: " + item.dataset.title);
      if (activeVideo) { activeVideo.pause(); activeVideo.remove(); activeVideo = null; }
    });
  });

  // feed video cards jump to the lab and select the video
  document.querySelectorAll("[data-video-jump]").forEach(function (link) {
    link.addEventListener("click", function () {
      var target = document.querySelector('.video-lab__item[data-video="' + link.dataset.videoJump + '"]');
      if (target) target.click();
    });
  });
})();
