import { renderPage } from '../components/layout.mjs';
import { esc } from '../components/util.mjs';

export const route = '/team';

const LEADERS = [
  { name: 'Mohak Saini', role: 'Founder & CEO', blurb: 'Leads technical strategy and the systemic design of core digital ecosystems.' },
  { name: 'Ashutosh Upadhyay', role: 'Co-Founder', blurb: 'Focuses on intuitive architectures and technical integrity.' },
  { name: 'Dhawan Nama', role: 'Co-Founder & CTO', blurb: 'Focuses on global growth through partnerships and ecosystem development.' },
];

const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');

export function render() {
  const cards = LEADERS.map(
    (p) => `<li class="leader"><span class="leader__avatar" aria-hidden="true">${esc(initials(p.name))}</span>
      <h3>${esc(p.name)}</h3><p class="leader__role">${esc(p.role)}</p><p>${esc(p.blurb)}</p></li>`,
  ).join('');
  const body = `<section class="page-hero container">
  <p class="eyebrow">The inner circle</p>
  <h1 class="display">Meet the Architects behind Cynbit</h1>
  <p class="lead">At Cynbit, we assemble a board of digital architects selected for their technical rigor and commitment to a resilient, optimistic future.</p>
</section>
<section class="container section" aria-labelledby="leaders-title">
  <h2 id="leaders-title" class="section-title">The core leadership</h2>
  <ul class="leaders">${cards}</ul>
  <p class="note">Photos and LinkedIn links from the live page are not reproduced in this prototype.</p>
</section>`;
  return renderPage({
    path: route,
    title: 'Our Team',
    description: 'Core leadership of Cynbit Technologies.',
    body,
  });
}
