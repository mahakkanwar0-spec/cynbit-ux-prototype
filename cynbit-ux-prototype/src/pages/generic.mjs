import { renderPage } from '../components/layout.mjs';
import { icon } from '../components/icons.mjs';
import { SITE, ROUTES } from '../data/site.mjs';
import { esc } from '../components/util.mjs';

/**
 * Pages that exist in the real navigation but are outside this prototype's scope.
 * They are served inside the prototype shell so header, breadcrumbs and active states can be
 * exercised on every route, and each one says plainly that it is not rebuilt.
 * `summary` is what was observed on the live page during inspection (null = not inspected in detail).
 */
const SUMMARIES = {
  '/careers': 'Careers: "Explore the opportunities at Cynbit." Culture, benefits and operating model, followed by 20 listed openings (internships plus full-time roles on the Growth and Core Engineering teams).',
  '/impact': 'Social impact: "Cynbit for Society." The two-phase BitElevate initiative and the Manav Seva Trust partnership that brings IT teaching to rural and government schools.',
  '/services': 'Services: "Built for Scale Designed for Performance." AI agents and cognitive automation, software and cloud solutions, marketing and technical SEO, and a tech stack overview.',
  '/products': 'Products: "The Cynbit Product Ecosystem." Cynbit Studio, TenantEase and Revio, plus a Schedule a Demo form and a newsletter signup.',
  '/case-studies': 'Case studies: "From Challenge to Scalable Solutions." Thirteen case study cards with the filters All Success Stories, Software Dev, Cloud Strategy and Digital Marketing.',
  '/bitelevate': 'BitElevate: a 100% remote, 60-day software development internship with six industry tracks, an eight-week roadmap and a paid registration form.',
  '/diaries': 'Student Diaries: "Unheared Stories." Eight anonymous diary entries, each with a short quote and a Read Entry link.',
  '/blog': 'Blog: "Architecting knowledge." Article cards with the filters All Insights, IT Strategy, Marketing, Education, Cloud Architecture and Community, and numbered pagination.',
  '/contact': 'Contact: "Start Your Next Project With Us." An inquiry form (name, email, optional company and industry, message) and a four-question Technical FAQ.',
  '/navigation': 'Navigation: "Digital Navigation Map." A directory of the site grouped as Core Infrastructure, Solutions Suite, Community & Impact and Transparency.',
  '/privacy': null,
  '/terms': null,
  '/cookies': null,
};

export function renderGeneric(route) {
  const summary = SUMMARIES[route.href];
  const liveHref = SITE.liveUrl + route.href;
  const body = `<section class="page-hero container">
  <p class="eyebrow">Outside prototype scope</p>
  <h1 class="display">${esc(route.label)}</h1>
  <p class="lead">This page is not rebuilt in the prototype. It is here so the header, breadcrumbs and active states work on every route of the real navigation.</p>
</section>
<section class="container section">
  <div class="scope-card">
    <h2 class="section-title">${summary ? 'What the live page contains' : 'Live page'}</h2>
    <p>${summary ? esc(summary) : 'A legal page. It was not inspected in detail for this assessment.'}</p>
    <div class="cta__actions">
      <a class="btn btn--primary" href="${liveHref}" target="_blank" rel="noopener noreferrer">View the live page ${icon('external', { size: 16 })}<span class="sr-only"> (opens in a new tab)</span></a>
      <a class="btn btn--ghost" href="/">Back to prototype overview</a>
    </div>
  </div>
</section>`;
  return renderPage({
    path: route.href,
    title: route.label,
    description: `${route.label}: placeholder route inside the Cynbit UX prototype shell.`,
    body,
  });
}

export function genericRoutes(excluded) {
  return ROUTES.filter((r) => r.href !== '/' && !excluded.includes(r.href));
}
