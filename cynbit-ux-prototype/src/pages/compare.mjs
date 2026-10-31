import { renderPage } from '../components/layout.mjs';

export const route = '/compare';

const PAGES = [
  { label: 'Our Story', href: '/story' },
  { label: 'Learning Paths', href: '/bitelevate/paths' },
  { label: 'Our Team', href: '/team' },
];

/**
 * Before / after on one screen. Each frame loads the same page; the frame name tells the page which
 * view to render (see BOOT_SCRIPT in layout.mjs), so the two frames stay independent while you navigate.
 */
export function render() {
  const pageButtons = PAGES.map(
    (p, i) => `<button type="button" data-page="${p.href}" aria-pressed="${i === 0}">${p.label}</button>`,
  ).join('');
  const body = `<section class="container section compare" data-compare data-device="desktop">
  <p class="eyebrow">Before / after</p>
  <h1 class="section-title">Same page, two views.</h1>
  <p class="lead">Left is a reconstruction of the original behaviour (built from screenshots and the live page's structure). Right is the improved version. Scroll inside either frame, or follow links, to compare.</p>
  <div class="compare__controls">
    <div class="seg" role="group" aria-label="Page">${pageButtons}</div>
    <div class="seg" role="group" aria-label="Device width">
      <button type="button" data-width="100%" aria-pressed="true">Desktop</button>
      <button type="button" data-width="390px" aria-pressed="false">Mobile</button>
    </div>
  </div>
  <div class="compare__frames">
    <figure><figcaption><span class="tag tag--before">Before</span> Original (reconstruction)</figcaption>
      <iframe name="cynbit-view-original" data-frame src="/story" title="Original view, reconstruction"></iframe></figure>
    <figure><figcaption><span class="tag tag--after">After</span> Improved</figcaption>
      <iframe name="cynbit-view-improved" data-frame src="/story" title="Improved view"></iframe></figure>
  </div>
</section>`;
  return renderPage({
    path: route,
    title: 'Before and after comparison',
    description: 'Side-by-side comparison of the original behaviour and the improved prototype.',
    body,
  });
}
