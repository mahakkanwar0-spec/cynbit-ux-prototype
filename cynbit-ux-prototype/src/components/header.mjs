import { NAV_GROUPS, TOP_LINKS, findActiveRoute } from '../data/site.mjs';
import { icon, logo } from './icons.mjs';
import { breadcrumbs } from './breadcrumbs.mjs';
import { esc } from './util.mjs';

function isCurrent(href, activeHref) {
  return activeHref === href;
}

function menuItem(item, activeHref) {
  const current = isCurrent(item.href, activeHref);
  return `<li><a class="nav-menu__link" href="${item.href}"${current ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`;
}

function desktopGroup(group, activeHref) {
  const groupActive = group.items.some((i) => isCurrent(i.href, activeHref));
  return `<li class="nav-group" data-nav-group${groupActive ? ' data-active="true"' : ''}>
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="menu-${group.id}">
          <span>${esc(group.label)}</span>${icon('chevron', { size: 16, className: 'nav-trigger__chevron' })}
        </button>
        <ul class="nav-menu" id="menu-${group.id}">
          ${group.items.map((i) => menuItem(i, activeHref)).join('\n          ')}
        </ul>
      </li>`;
}

function topLink(link, activeHref) {
  const current = isCurrent(link.href, activeHref);
  return `<li><a class="nav-link" href="${link.href}"${current ? ' aria-current="page"' : ''}>${esc(link.label)}</a></li>`;
}

function mobileMenu(activeHref) {
  const groups = NAV_GROUPS.map((group) => {
    const open = group.items.some((i) => isCurrent(i.href, activeHref));
    return `<details class="m-group"${open ? ' open data-active="true"' : ''}>
        <summary>${esc(group.label)}${icon('chevron', { size: 18 })}</summary>
        <ul>${group.items
          .map((i) => `<li><a href="${i.href}"${isCurrent(i.href, activeHref) ? ' aria-current="page"' : ''}>${esc(i.label)}</a></li>`)
          .join('')}</ul>
      </details>`;
  }).join('\n      ');
  const tops = TOP_LINKS.map(
    (l) => `<a class="m-link" href="${l.href}"${isCurrent(l.href, activeHref) ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`,
  ).join('');
  return `<div class="mobile-menu" id="mobile-menu" hidden>
      ${groups}
      <div class="m-links">${tops}</div>
      <a class="btn btn--primary btn--block" href="/careers">Join Us</a>
    </div>`;
}

/** Sticky site header. Active state is rendered at build time from the page's own URL. */
export function header(pathname) {
  const active = findActiveRoute(pathname);
  const activeHref = active ? active.href : null;
  return `<header class="site-header" data-site-header>
  <div class="header__bar">
    <a class="brand" href="/" aria-label="Cynbit — prototype overview">${logo()}</a>
    <nav class="primary-nav" aria-label="Primary">
      <ul class="primary-nav__list">
      ${NAV_GROUPS.map((g) => desktopGroup(g, activeHref)).join('\n      ')}
      ${TOP_LINKS.map((l) => topLink(l, activeHref)).join('\n      ')}
      </ul>
    </nav>
    <a class="btn btn--primary header__cta" href="/careers">Join Us</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" data-menu-toggle>
      ${icon('menu', { size: 24, className: 'menu-toggle__open' })}${icon('close', { size: 24, className: 'menu-toggle__close' })}
    </button>
  </div>
  ${mobileMenu(activeHref)}
  ${breadcrumbs(pathname)}
</header>`;
}
