/** Inline SVG icon set (24x24, stroke based). Keeps the site free of an icon-font dependency. */
const PATHS = {
  chevron: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
  box: '<path d="M4 7l8-4 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5L2 9Z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
  megaphone: '<path d="M3 10v4h3l7 4V6L6 10H3Z"/><path d="M16 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
  brush: '<path d="M14 4l6 6-8 8H6v-6l8-8Z"/><path d="M4 21h5"/>',
  spark: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  cycle: '<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  trend: '<path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/>',
  bars: '<rect x="4" y="12" width="4" height="8" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><rect x="16" y="9" width="4" height="11" rx="1"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 10 3 2-3 2M12 15h5"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9.5 4.5 4.5 0 0 1 17.5 18H7Z"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  blocks: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="8" y="13" width="8" height="8" rx="1"/>',
  sensors: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8"/>',
  network: '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="m7 6.5 3.2 4M7 17.5l3.2-4M14 12h3"/>',
  translate: '<path d="M4 6h9M8.5 4v2M6 6c0 4 3 7 6 8M12 6c0 3-3 6-6.5 8"/><path d="m13 20 4-9 4 9M14.5 17h5"/>',
  query: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M7.5 11.5l2-2 1.5 1.5 2-2.5"/>',
  rocket: '<path d="M12 3c3 2 5 5 5 9l-2 3H9l-2-3c0-4 2-7 5-9Z"/><circle cx="12" cy="10" r="1.6"/><path d="m9 15-2 4 3-1M15 15l2 4-3-1"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
};

export function icon(name, { size = 20, className = '' } = {}) {
  const body = PATHS[name];
  if (!body) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** Stand-in wordmark. Replace with the official logo asset when integrating. */
export function logo() {
  return `<svg class="logo" viewBox="0 0 150 44" width="150" height="44" role="img" aria-label="Cynbit">
  <ellipse cx="75" cy="22" rx="70" ry="17" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="75" y="29" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="1" fill="currentColor">CYN·BIT</text>
</svg>`;
}
