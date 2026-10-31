import { BOTTOM_BAR, FOOTER_COLUMNS, LEGAL_LINKS, findActiveRoute, SITE } from '../data/site.mjs';
import { icon, logo } from './icons.mjs';
import { esc } from './util.mjs';

export function footer(pathname) {
  const active = findActiveRoute(pathname);
  const activeHref = active ? active.href : null;
  const cols = FOOTER_COLUMNS.map(
    (col) => `<div class="footer__col">
        <h2 class="footer__title">${esc(col.title)}</h2>
        <ul>${col.links
          .map((l) => `<li><a href="${l.href}"${activeHref === l.href ? ' aria-current="page"' : ''}>${esc(l.label)}</a></li>`)
          .join('')}</ul>
      </div>`,
  ).join('\n      ');
  const legal = LEGAL_LINKS.map(
    (l) => `<a href="${l.href}"${activeHref === l.href ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`,
  ).join('');

  return `<footer class="site-footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <a class="brand" href="/" aria-label="Cynbit — prototype overview">${logo()}</a>
      <p>Assessment prototype. This is an independent UX study of ${esc(SITE.liveUrl.replace('https://', ''))}, not the production site.</p>
    </div>
    ${cols}
  </div>
  <div class="container footer__legal">
    <p>Prototype for the Full Stack Developer Intern assessment. Cynbit branding and copy belong to ${esc(SITE.legalName)}.</p>
    <nav aria-label="Legal">${legal}</nav>
  </div>
</footer>`;
}

/** Fixed bottom bar used on small screens (mirrors the live site's bar). */
export function bottomBar(pathname) {
  const active = findActiveRoute(pathname);
  const activeHref = active ? active.href : pathname === '/' ? '/' : null;
  const isActive = (href) => {
    if (href === '/') return activeHref === '/';
    return Boolean(activeHref) && (activeHref === href || activeHref.startsWith(href + '/'));
  };
  const items = BOTTOM_BAR.map(
    (item) => `<li><a href="${item.href}"${isActive(item.href) ? ' aria-current="page"' : ''}>${icon(item.icon, { size: 22 })}<span>${esc(item.label)}</span></a></li>`,
  ).join('');
  return `<nav class="bottom-bar" aria-label="Quick navigation"><ul>${items}</ul></nav>`;
}
