import { renderPage } from '../components/layout.mjs';
import { icon } from '../components/icons.mjs';

export const route = '/';

const CHANGES = [
  { icon: 'grid', title: 'Learning-path cards', text: 'One card size, one internal structure, a 4 / 2 / 1 column grid.', href: '/bitelevate/paths' },
  { icon: 'terminal', title: 'Our Story timeline', text: 'Large high-contrast years, a labelled progress rail and a scroll-linked spine.', href: '/story' },
  { icon: 'compass', title: 'Navigation orientation', text: 'Persistent active state on the menu, bottom bar and a breadcrumb trail on every page.', href: '/story' },
];

export function render() {
  const cards = CHANGES.map(
    (c) => `<li class="change"><span class="change__icon">${icon(c.icon, { size: 24 })}</span>
      <h3>${c.title}</h3><p>${c.text}</p>
      <a class="text-link" href="${c.href}">See it ${icon('arrow', { size: 16 })}</a></li>`,
  ).join('');
  const body = `<section class="page-hero container">
  <p class="eyebrow">Assessment prototype</p>
  <h1 class="display">UX consistency &amp; navigation enhancement.</h1>
  <p class="lead">An independent prototype that improves three things on cynbit.in while keeping its colours, type and tone. Use the <strong>View</strong> switch at the bottom of any page to flip between the improved version and a reconstruction of the original behaviour.</p>
</section>
<section class="container section" aria-labelledby="changes-title">
  <h2 id="changes-title" class="section-title">What changed</h2>
  <ul class="changes">${cards}</ul>
</section>
<section class="container section" aria-labelledby="try-title">
  <h2 id="try-title" class="section-title">Try it</h2>
  <ol class="steps">
    <li>Open <strong>Company → Our Story</strong>. The Company menu stays highlighted and the breadcrumb reads Home › Company › Our Story.</li>
    <li>Scroll the page. The sticky header keeps both the active menu state and the breadcrumb in view.</li>
    <li>Open <strong>BitElevate → Learning Paths</strong> and resize the window to see the grid reflow.</li>
    <li>Switch the view to <strong>Original (reconstruction)</strong> to compare, or open the <a href="/compare">side-by-side comparison</a>.</li>
  </ol>
</section>`;
  return renderPage({
    path: route,
    title: 'Cynbit UX prototype: consistency & navigation',
    description: 'Independent assessment prototype improving learning-path cards, the Our Story timeline and navigation orientation for cynbit.in.',
    body,
  });
}
