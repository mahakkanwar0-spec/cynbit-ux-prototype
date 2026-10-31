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
