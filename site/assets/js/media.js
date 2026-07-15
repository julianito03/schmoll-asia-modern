/* Media page (family layout): poster-first inline video playback.
   Video files load only when a poster is clicked; one video plays at a time. */
(function () {
  "use strict";
  var tiles = document.querySelectorAll(".fam-vtile");
  if (!tiles.length) return;
  var active = null;

  function restore(tile) {
    var v = tile.querySelector("video");
    if (v && tile._btn) v.replaceWith(tile._btn);
  }

  tiles.forEach(function (tile) {
    var btn = tile.querySelector(".fam-vtile__img");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (active) { active.pause(); restore(active._tile); active = null; }
      var v = document.createElement("video");
      v.controls = true;
      v.playsInline = true;
      v.src = tile.dataset.videoSrc;
      v.setAttribute("aria-label", tile.dataset.videoTitle || "Video");
      v._tile = tile;
      v.addEventListener("error", function () { restore(tile); });
      btn.replaceWith(v);
      tile._btn = btn;
      active = v;
      v.play().catch(function () {});
    });
  });
})();

/* Row scroll arrows: advance the slider; hide at the end */
(function () {
  "use strict";
  document.querySelectorAll(".fam-row__wrap").forEach(function (wrap) {
    var slider = wrap.querySelector(".fam-row__slider");
    var btn = wrap.querySelector(".fam-row__next");
    if (!slider || !btn) return;
    function update() {
      var atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;
      var scrollable = slider.scrollWidth > slider.clientWidth + 8;
      btn.classList.toggle("is-hidden", atEnd || !scrollable);
    }
    btn.addEventListener("click", function () {
      slider.scrollBy({ left: Math.round(slider.clientWidth * 0.8), behavior: "smooth" });
    });
    slider.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });
})();
