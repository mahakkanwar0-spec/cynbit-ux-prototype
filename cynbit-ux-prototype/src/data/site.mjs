/**
 * Single source of truth for navigation.
 * Structure mirrors what was observed on https://www.cynbit.in (header dropdowns,
 * top-level links, footer columns and the mobile bottom bar). Header, breadcrumbs,
 * footer and the bottom bar are all derived from this file, so they cannot drift apart.
 */

export const SITE = {
  name: 'Cynbit',
  legalName: 'Cynbit Technologies',
  liveUrl: 'https://www.cynbit.in',
};

export const NAV_GROUPS = [
  {
    id: 'company',
    label: 'Company',
    items: [
      { label: 'Our Story', href: '/story' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Social Impact', href: '/impact' },
    ],
  },
  {
    id: 'expertise',
    label: 'Expertise',
    items: [
      { label: 'Services Hub', href: '/services' },
      { label: 'Product Suite', href: '/products' },
      { label: 'Case Studies', href: '/case-studies' },
    ],
  },
  {
    id: 'bitelevate',
    label: 'BitElevate',
    items: [
      { label: 'The Ecosystem', href: '/bitelevate' },
      { label: 'Learning Paths', href: '/bitelevate/paths' },
      { label: 'Student Diaries', href: '/diaries' },
    ],
  },
];

export const TOP_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'About Us', href: '/story' },
      { label: 'Core Team', href: '/team' },
      { label: 'Our Services', href: '/services' },
      { label: 'Product Suite', href: '/products' },
    ],
  },
  {
    title: 'Impact',
    links: [
      { label: 'Social Initiatives', href: '/impact' },
      { label: 'Expert Blog', href: '/blog' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact Support', href: '/contact' },
    ],
  },
];

export const LEGAL_LINKS = [
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Navigation', href: '/navigation' },
];

export const BOTTOM_BAR = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Services', href: '/services', icon: 'grid' },
  { label: 'Products', href: '/products', icon: 'box' },
  { label: 'BitElevate', href: '/bitelevate', icon: 'cap' },
  { label: 'Contact', href: '/contact', icon: 'mail' },
];

/** Routes that exist outside the header menus (footer-only pages). */
const EXTRA_ROUTES = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Navigation', href: '/navigation' },
];

/** Flat list of every route the prototype serves, with its breadcrumb trail. */
export function buildRoutes() {
  const routes = [{ href: '/', label: 'Prototype overview', trail: [] }];
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      routes.push({
        href: item.href,
        label: item.label,
        group: group.id,
        // The group label has no landing page of its own, so it is not a link.
        trail: [{ label: group.label }],
      });
    }
  }
  for (const link of [...TOP_LINKS, ...EXTRA_ROUTES]) {
    routes.push({ href: link.href, label: link.label, trail: [] });
  }
  return routes;
}

export const ROUTES = buildRoutes();

/**
 * Longest-prefix match so "/bitelevate/paths" marks "Learning Paths"
 * (not "The Ecosystem") and "/blog/some-post" still marks "Blog".
 */
export function findActiveRoute(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  let best = null;
  for (const route of ROUTES) {
    if (route.href === '/') continue;
    const hit = clean === route.href || clean.startsWith(route.href + '/');
    if (hit && (!best || route.href.length > best.href.length)) best = route;
  }
  return best;
}
