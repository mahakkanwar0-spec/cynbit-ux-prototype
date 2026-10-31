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
