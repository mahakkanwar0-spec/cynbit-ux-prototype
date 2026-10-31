# Cynbit UX Consistency & Navigation Enhancement (prototype)

An independent prototype for the Cynbit Technologies Full Stack Developer Intern assessment. It improves three things on <https://www.cynbit.in> and keeps the site's branding (teal/brown/charcoal palette, Plus Jakarta Sans, pill buttons, large radii, tone of voice). It is **not** the production site and does not modify it.

| Problem on the existing site | Improvement |
|---|---|
| Our Story left cards look dull; year barely visible | Large high-contrast year, filled icon, labelled 4-step rail, chips/stats, scroll-linked spine |
| No active-page indication, no orientation | `aria-current` active state on menu, dropdown, mobile bottom bar and footer; breadcrumb in the sticky header |

## Before / after
Every page has a **View** switch (bottom of the screen): *Improved* or *Original (reconstruction)*. `/compare` shows both side by side. The "original" view is rebuilt from the screenshots supplied with the assessment and the live page structure; it is not Cynbit's code. Screenshots of both are in `screenshots/`.

## Run it
Requires Node 18.18+. No runtime dependencies.
```bash
npm run dev          # build + serve on http://localhost:3000
npm test             # build + Playwright suite (first: npm i && npx playwright install chromium)
npm run screenshots  # regenerate screenshots/
npm run report       # regenerate docs/Technical-Report.pdf
```

## Structure
```
src/data/        nav, paths and milestones (single source of truth)
src/components/  header, breadcrumbs, footer, path-card, timeline, layout (pure functions returning HTML)
src/pages/       overview, story, paths, team, compare, generic route shells
src/styles/      tokens, base, header, paths, timeline, pages, original-skin
src/scripts/     nav, timeline, view, compare (vanilla JS, progressive enhancement)
scripts/         build.mjs (static build), capture-screenshots.mjs, build-report.mjs
tests/           run-tests.mjs (Playwright)
docs/            Technical-Report.pdf, GIT_SETUP.md, DEPLOYMENT.md, test-results.txt
```

## Tech stack and why it differs from the live site
From the DevTools screenshot supplied with the assessment (`/_next/static/chunks`, `_rsc=` prefetch requests, `$Sreact.fragment` payload) the live site is a **Next.js App Router** app. The sandbox this prototype was built in could not reach the npm registry, so Next.js could not be installed or tested. The prototype is therefore dependency-free Node + HTML/CSS/JS. Components are plain functions of `(pathname)` and the data files are framework-neutral, so porting to Next.js is mechanical: `header.mjs` becomes a client component using `usePathname()`, `findActiveRoute()` is reused unchanged, and the CSS drops in as is.

## Assumptions and limits
- Original source and the live DOM were not accessible (see report section 3). Brand colours were sampled from the supplied screenshots; the font is loaded from Google Fonts.
- Text copy for the Our Story 2021 body is verbatim from a screenshot. Bodies for 2022 to 2024 are paraphrased from a summary of the live page. Short descriptions on 12 of the 16 learning-path cards, and the category label on every card, were written for the prototype (marked `source: 'proposed'` in `src/data/paths.mjs`).
- Team photos and LinkedIn links are not reproduced (initials avatars instead). Pages other than Story, Paths and Team are route shells that describe the live page and link to it.
- "Join Us" links to `/careers` (assumption). Dropdowns still close after a selection (standard behaviour); the change is that the parent stays highlighted and the current item is marked when reopened.
- Lighthouse and live-site console/network analysis were not run (live site unreachable from the sandbox).
