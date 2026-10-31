import { findActiveRoute } from '../data/site.mjs';
import { icon } from './icons.mjs';
import { esc } from './util.mjs';

/**
 * Breadcrumb trail, e.g. Home > Company > Our Story.
 * Dropdown group names (Company, Expertise, BitElevate) have no landing page on the live site,
 * so they render as plain text instead of links that would 404.
 */
export function breadcrumbs(pathname) {
  const route = findActiveRoute(pathname);
  if (!route) return '';

  const crumbs = [{ label: 'Home', href: '/' }, ...route.trail, { label: route.label, current: true }];
  const items = crumbs
    .map((crumb, i) => {
      const sep = i > 0 ? icon('chevron', { size: 14, className: 'crumb-sep' }) : '';
      let inner;
      if (crumb.current) inner = `<span aria-current="page">${esc(crumb.label)}</span>`;
      else if (crumb.href) inner = `<a href="${crumb.href}">${esc(crumb.label)}</a>`;
      else inner = `<span class="crumb-group">${esc(crumb.label)}</span>`;
      return `<li>${sep}${inner}</li>`;
    })
    .join('');

  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}
