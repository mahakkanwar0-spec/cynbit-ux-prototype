/* Our Story timeline: a scroll-linked spine and an "active milestone" marker.
 * Without JS (or with reduced motion) every milestone is simply visible and static. */
var tl = document.querySelector('[data-timeline]');
if (tl) {
  var items = Array.prototype.slice.call(tl.querySelectorAll('.ms'));
  var fill = tl.querySelector('[data-timeline-fill]');
  var ticking = false;

  var update = function () {
    ticking = false;
    var line = window.innerHeight * 0.45; // reading line, relative to the viewport
    var box = tl.getBoundingClientRect();
    var progress = Math.min(1, Math.max(0, (line - box.top) / box.height));
    if (fill) fill.style.height = progress * 100 + '%';

    var activeIndex = -1;
    items.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.top <= line) activeIndex = i;
    });
    items.forEach(function (el, i) {
      el.dataset.state = i < activeIndex ? 'done' : i === activeIndex ? 'current' : 'todo';
    });
  };
  var onScroll = function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
