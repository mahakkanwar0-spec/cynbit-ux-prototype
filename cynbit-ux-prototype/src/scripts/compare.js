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
