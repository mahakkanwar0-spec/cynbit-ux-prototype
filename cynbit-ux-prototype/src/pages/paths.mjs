import { renderPage } from '../components/layout.mjs';
import { pathGrid } from '../components/path-card.mjs';
import { PATHS } from '../data/paths.mjs';

export const route = '/bitelevate/paths';

export function render() {
  const body = `<section class="page-hero container">
  <p class="eyebrow">BitElevate · Learning paths</p>
  <h1 class="display">Design your own career.</h1>
  <p class="lead">${PATHS.length} learning paths across engineering, data and AI, design and growth. Every path is presented the same way so you can compare them at a glance.</p>
</section>
<section class="container section" aria-label="Learning paths">
${pathGrid()}
</section>
<section class="container section cta">
  <div class="cta__card">
    <h2>Ready to pick a path?</h2>
    <p>Read how the BitElevate program works, or talk to the team.</p>
    <div class="cta__actions">
      <a class="btn btn--primary" href="/bitelevate">Explore the ecosystem</a>
      <a class="btn btn--ghost" href="/contact">Speak to a mentor</a>
    </div>
  </div>
</section>`;
  return renderPage({
    path: route,
    title: 'Learning Paths',
    description: 'Sixteen BitElevate learning paths in a consistent, responsive grid.',
    body,
  });
}
