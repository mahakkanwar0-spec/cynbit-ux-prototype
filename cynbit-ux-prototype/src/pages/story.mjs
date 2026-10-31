import { renderPage } from '../components/layout.mjs';
import { timeline } from '../components/timeline.mjs';

export const route = '/story';

export function render() {
  const body = `<section class="page-hero container">
  <p class="eyebrow">Our story</p>
  <h1 class="display">Four years of building the foundation.</h1>
  <p class="lead">Cynbit was founded in Jaipur to build scalable AI solutions, automation systems and software products. This is how the idea took shape.</p>
</section>
<section class="container section" aria-label="Company timeline">
${timeline()}
</section>
<section class="container section cta">
  <div class="cta__card">
    <h2>Build the next chapter with us</h2>
    <p>The live site closes this page with the same two actions.</p>
    <div class="cta__actions">
      <a class="btn btn--primary" href="/contact">Partner with us</a>
      <a class="btn btn--ghost" href="/team">Meet the architects</a>
    </div>
  </div>
</section>`;
  return renderPage({
    path: route,
    title: 'Our Story',
    description: 'Cynbit timeline from 2021 to 2024: preparation, validation, finalising the roadmap and official launch.',
    body,
  });
}
