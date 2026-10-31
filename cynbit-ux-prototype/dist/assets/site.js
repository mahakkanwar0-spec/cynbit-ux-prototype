(function(){'use strict';
/* nav.js */
/* Navigation behaviour: desktop dropdowns and the mobile menu.
 * The active page is rendered into the HTML at build time (aria-current), so this file only
 * handles opening and closing. Everything degrades to plain links without it. */
var header = document.querySelector('[data-site-header]');
if (header) {
  var groups = Array.prototype.slice.call(header.querySelectorAll('[data-nav-group]'));
  var toggle = header.querySelector('[data-menu-toggle]');
  var mobileMenu = header.querySelector('#mobile-menu');

  var closeGroups = function (except) {
    groups.forEach(function (g) {
      var trigger = g.querySelector('.nav-trigger');
      if (g !== except) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  groups.forEach(function (g) {
    var trigger = g.querySelector('.nav-trigger');
    trigger.addEventListener('click', function () {
      var open = trigger.getAttribute('aria-expanded') === 'true';
      closeGroups(g);
      trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    // Close when keyboard focus leaves the group.
    g.addEventListener('focusout', function (e) {
      if (!g.contains(e.relatedTarget)) trigger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-nav-group]')) closeGroups(null);
  });

  var setMobile = function (open) {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !open;
  };
  if (toggle) toggle.addEventListener('click', function () { setMobile(toggle.getAttribute('aria-expanded') !== 'true'); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openTrigger = header.querySelector('.nav-trigger[aria-expanded="true"]');
    closeGroups(null);
    if (openTrigger) openTrigger.focus();
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
      setMobile(false);
      toggle.focus();
    }
  });
}

/* view.js */
/* Improved / Original view switch (review aid only, not part of the proposed site). */
var viewButtons = document.querySelectorAll('[data-view-btn]');
var applyView = function (view) {
  document.documentElement.dataset.view = view;
  viewButtons.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.getAttribute('data-view-btn') === view));
  });
};
viewButtons.forEach(function (b) {
  b.addEventListener('click', function () {
    var view = b.getAttribute('data-view-btn');
    applyView(view);
    try { localStorage.setItem('cynbit-view', view); } catch (e) { /* storage unavailable */ }
  });
});
applyView(document.documentElement.dataset.view === 'original' ? 'original' : 'improved');

/* timeline.js */
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

/* compare.js */
/* Side-by-side comparison page: choose a page and a device width. */
var cmp = document.querySelector('[data-compare]');
if (cmp) {
  var frames = cmp.querySelectorAll('iframe[data-frame]');
  var pageLinks = cmp.querySelectorAll('[data-page]');
  var widthLinks = cmp.querySelectorAll('[data-width]');

  var setPage = function (href) {
    frames.forEach(function (f) { f.src = href; });
    pageLinks.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-page') === href)); });
  };
  var setWidth = function (w) {
    cmp.style.setProperty('--frame-w', w);
    cmp.dataset.device = w === '390px' ? 'mobile' : 'desktop';
    widthLinks.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-width') === w)); });
  };
  pageLinks.forEach(function (b) { b.addEventListener('click', function () { setPage(b.getAttribute('data-page')); }); });
  widthLinks.forEach(function (b) { b.addEventListener('click', function () { setWidth(b.getAttribute('data-width')); }); });
}

})();