// Builds docs/Technical-Report.pdf from screenshots/ and docs/test-results.txt using Playwright.
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const img = async (p, cap, cls = '') => `<figure class="${cls}"><img src="data:image/png;base64,${(await readFile(join(root, 'screenshots', p))).toString('base64')}"><figcaption>${cap}</figcaption></figure>`;
const results = await readFile(join(root, 'docs/test-results.txt'), 'utf8');
const summary = results.trim().split('\n').pop();
const sections = results.split('\n').filter((l) => l && !l.startsWith('  ') && !/passed/.test(l));
const count = (name) => { const i = results.indexOf(name); const rest = results.slice(i + name.length); const next = rest.search(/\n[A-Z]/); return (rest.slice(0, next < 0 ? undefined : next).match(/ ok /g) || []).length; };

const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Cynbit UX prototype: technical report</title>
<style>
@page { size: A4; margin: 18mm 16mm; }
body { font: 10.5pt/1.55 Inter, 'Helvetica Neue', Arial, sans-serif; color: #181c1d; }
h1 { font-size: 24pt; color: #006067; margin: 0 0 4pt; letter-spacing: -0.02em; } h2 { font-size: 15pt; color: #006067; margin: 22pt 0 6pt; border-bottom: 2px solid #dfebeb; padding-bottom: 3pt; break-after: avoid; } h3 { font-size: 11.5pt; margin: 12pt 0 3pt; break-after: avoid; }
p, li { margin: 4pt 0; } table { border-collapse: collapse; width: 100%; margin: 6pt 0; font-size: 9.5pt; } td, th { border: 1px solid #d3dcdc; padding: 4pt 7pt; text-align: left; vertical-align: top; } th { background: #dfebeb; }
figure { margin: 8pt 0; break-inside: avoid; } img { width: 100%; border: 1px solid #d3dcdc; border-radius: 4pt; } figcaption { font-size: 8.5pt; color: #4a5557; margin-top: 2pt; } figure.half { width: 48%; display: inline-block; vertical-align: top; margin-right: 1.5%; }
code { background: #f1f4f4; padding: 0 3pt; border-radius: 3pt; font-size: 9pt; } .note { background: #f3e6cf; padding: 6pt 9pt; border-radius: 6pt; } .meta { color: #4a5557; margin-bottom: 14pt; } pre { background: #f1f4f4; padding: 8pt; font-size: 8pt; white-space: pre-wrap; }
</style>
<h1>Cynbit website UX consistency &amp; navigation enhancement</h1>
<p class="meta">Technical report · Full Stack Developer Intern assessment, Cynbit Technologies · 31 October 2026</p>

<h2>1. Assessment overview</h2>
<p>The brief: analyse https://www.cynbit.in from a user and a developer perspective, pick one meaningful problem, and deliver a working prototype that <b>improves the existing site</b>. This submission keeps Cynbit's branding and presents each change as a before/after on the same pages, rather than a new site in a similar style. It is an independent prototype; the production site was not modified.</p>

<h2>2. Problem statement</h2>
<p>Three related inconsistencies make the site harder to scan and to navigate: (1) the Learning Paths cards vary in size, shape and content; (2) the Our Story timeline cards are visually weak and the year is nearly invisible; (3) nothing tells a visitor which page or section they are in. They share one cause, an absence of a consistent visual and orientation system, so they are treated as one project: <b>Website UX Consistency &amp; Navigation Enhancement</b>.</p>

<h2>3. Existing website analysis</h2>
<h3>How the site was inspected, and what could not be</h3>
<p>Pages were read with a web-fetch tool (text and structure only) and through the three screenshots supplied. The build environment could not open cynbit.in in a browser and its shell was blocked from the site, so <b>no live DOM, CSS, console, network or Lighthouse inspection was possible</b>. Findings below are limited to what the screenshots and fetched page content show. Pages read: Home, Our Story, Team, Learning Paths, Careers, Impact, Services, Products, Case Studies, BitElevate, Student Diaries, Blog, Contact, Navigation.</p>
<table><tr><th>Area</th><th>Observed (source)</th></tr>
<tr><td>Navigation</td><td>Header: Company (Our Story, Our Team, Careers, Social Impact), Expertise (Services Hub, Product Suite, Case Studies), BitElevate (The Ecosystem, Learning Paths, Student Diaries), Blog, Contact, Join Us. Footer columns, legal links and a five-item mobile bottom bar (Home, Services, Products, BitElevate, Contact). (fetched pages)</td></tr>
<tr><td>Active state / breadcrumbs</td><td>None visible in the supplied screenshots; none present in the retrieved Story and Team page content. Not confirmed against the live DOM.</td></tr>
<tr><td>Learning Paths</td><td>16 cards. The supplied screenshot shows mixed widths (about 567, 416 and 718 px in one row), heights (about 210, 277 and 285 px), surfaces (white, grey, brown-topped, teal, outlined, charcoal) and radii; the counter "01/16" and the DESIGN tag appear on one card each; most cards have no description.</td></tr>
<tr><td>Our Story</td><td>Left card: faint italic year in near-white grey, thin progress bar with no labels, four unlabelled pills (two filled, two empty). (screenshot)</td></tr>
<tr><td>Technology</td><td>Next.js App Router: the DevTools screenshot shows <code>_rsc=</code> prefetch requests, a <code>$Sreact.fragment</code> RSC payload and <code>/_next/static/chunks</code> assets. Fetched metadata also shows Open Graph/Twitter tags and Material Symbols icon names. Content appears to be static or server-rendered; no API integration was observed.</td></tr></table>

<h2>4. User-perspective observations</h2>
<ul><li><b>Expertise cards:</b> uneven dimensions and spacing; unbalanced layout; inconsistent content (counter, tag and description on a few cards only).</li>
<li><b>Our Story cards:</b> low-contrast year; unlabelled progress bar and pills carry no information; card looks empty next to a strong heading.</li>
<li><b>Navigation:</b> no indication of the current page or section; dropdown selection gives no lasting feedback; no breadcrumb.</li></ul>
${await img('original-reference/02-expertise-cards.png', 'Original: expertise cards (screenshot supplied with the assessment)')}
${await img('original-reference/01-our-story-timeline-card.png', 'Original: Our Story timeline card (screenshot supplied)', 'half')}${await img('original-reference/03-team-page-mobile-devtools.png', 'Original: Team page on mobile with DevTools network panel (screenshot supplied)', 'half')}

<h2>5. Developer-perspective findings</h2>
<table><tr><th>Item</th><th>Status</th></tr>
<tr><td>Framework and routing</td><td>Verified from screenshot: Next.js App Router with client-side prefetching.</td></tr>
<tr><td>Navigation routing and active-page detection</td><td>Not verified in code. No active marker visible in screenshots or retrieved content.</td></tr>
<tr><td>HTML/DOM, CSS architecture, JS, event handling</td><td>Not inspected (no DOM access).</td></tr>
<tr><td>Console errors, failed requests</td><td>Not inspected. The supplied DevTools screenshot shows issue badges and a request list, but they were not investigated and no conclusion is drawn.</td></tr>
<tr><td>Forms and API integration</td><td>Not inspected. Contact, Products and BitElevate pages describe forms; their behaviour is unverified.</td></tr>
<tr><td>Lighthouse, accessibility audit</td><td>Not run.</td></tr>
<tr><td>Broken links</td><td>All header, footer and bottom-bar links retrieved from the home page were read; none was tested for status codes.</td></tr></table>
<p class="note">These gaps are limits of the available tooling, not conclusions about the live site. A reviewer with browser access can run Lighthouse and the console checks in minutes.</p>

<h2>6. Selected improvement and justification</h2>
<p>One project, three coordinated changes: consistent Learning Path cards, a stronger Our Story timeline, and persistent navigation orientation. They address the observations the user reported, sit on adjacent pages, and reuse one token set, so the result is coherent rather than three unrelated tweaks. The rest of the site was deliberately left alone.</p>
<table><tr><th>Change</th><th>Design decision</th></tr>
<tr><td>Cards</td><td>Identical width and height per breakpoint (grid rows sized to 1fr), same anatomy on every card (icon chip, index, category, title, description), 4 / 2 / 1 columns so 16 cards form complete rows. The original surface variety is kept as colour only (white, grey, plus the teal and charcoal accents the site already uses), never size. Two-line title and description areas are reserved so tags line up across a row.</td></tr>
<tr><td>Timeline</td><td>Year set at 3.4 to 5.2 rem in brand teal on white (contrast about 7:1 against the page background (test requires at least 4.5:1), versus about 1.1:1 in the reconstruction of the original). Filled icon tile, labelled four-step rail that links to each year, chips or stats in place of empty pills, teal top accent, and a spine that fills with scroll.</td></tr>
<tr><td>Navigation</td><td><code>aria-current="page"</code> is rendered from the URL for the item, its dropdown group, the mobile menu, bottom bar and footer; the active trigger gets colour, tint and an underline (not colour alone). A breadcrumb (Home, group, page) lives inside the sticky header, so state stays visible while scrolling. Dropdowns still close on selection, because staying open would obstruct the page; instead the parent remains highlighted and the current item is marked when reopened. Esc, outside click and focus-out close menus.</td></tr></table>

<h2>7. Technology stack</h2>
<p>Dependency-free Node (ESM) static build, vanilla JavaScript for dropdowns, timeline and the view switch, plain CSS with custom properties, Playwright for tests. The live site uses Next.js; Next.js could not be installed in the build environment (npm registry blocked), so it was not used. See the README for the porting path.</p>

<h2>8. Architecture and implementation</h2>
<ul><li><code>src/data/site.mjs</code> is the single source of truth for navigation. Header, breadcrumb, footer and bottom bar are all derived from it and from <code>findActiveRoute()</code> (longest-prefix match, so <code>/bitelevate/paths</code> marks Learning Paths, not The Ecosystem).</li>
<li>Components are pure functions that return HTML; the active state is rendered at build time, so it works without JavaScript.</li>
<li><code>scripts/build.mjs</code> renders every route to <code>dist/&lt;route&gt;/index.html</code> and bundles CSS and JS. 18 pages are built; unbuilt site pages are route shells inside the same header and breadcrumb system with a link to the live page.</li>
<li>The "original" view is a CSS skin scoped to <code>html[data-view='original']</code> (src/styles/original-skin.css), a reconstruction from screenshots, with no Cynbit code. <code>/compare</code> shows both in two frames.</li>
<li>Responsive design from 390 px to 1440 px, visible focus rings, skip link, labelled landmarks, reduced-motion support.</li></ul>

<h2>9. Screenshots: original website</h2>
<p>The three screenshots supplied with the assessment appear in section 4 and in <code>screenshots/original-reference/</code>. No other screenshots of the live site could be taken. Reconstruction renders are in <code>screenshots/reconstruction-original/</code>.</p>

<h2>10. Screenshots: improved prototype and before/after</h2>
<p>Left is the reconstruction of the original; right is the improved prototype. Fonts: the build environment could not load Google Fonts, so captures use the Inter fallback; with network access the site renders in Plus Jakarta Sans.</p>
${await img('comparison/before-after-story-desktop.png', 'Our Story, desktop')}
${await img('comparison/before-after-paths-desktop.png', 'Learning paths, desktop')}
${await img('comparison/before-after-nav-dropdown-desktop.png', 'Navigation: breadcrumb, highlighted group, current item marked in dropdown')}
${await img('comparison/before-after-team-mobile.png', 'Team page, mobile: breadcrumb under the sticky header')}
${await img('comparison/before-after-paths-mobile.png', 'Learning paths, mobile')}
${await img('improved/paths-tablet.png', 'Improved learning paths at 768 px (2 columns)', 'half')}${await img('improved/nav-mobile-menu.png', 'Improved mobile menu with current page marked', 'half')}

<h2>11. Testing performed and results</h2>
<p>An automated Playwright (Chromium) suite, <code>tests/run-tests.mjs</code>, was run against the built site. Result: <b>${summary}</b>. Full log: <code>docs/test-results.txt</code>.</p>
<table><tr><th>Area</th><th>Checks passed</th><th>Examples</th></tr>
<tr><td>Routes, console, links</td><td>${count('Routes, console errors, links')}</td><td>All 18 routes return 200; no JS errors; every internal link resolves; one h1 per page; in-page anchors resolve</td></tr>
<tr><td>Active nav + breadcrumbs</td><td>${count('Active navigation + breadcrumbs')}</td><td>Correct group, item and trail on 5 routes; header, trigger and breadcrumb stay visible after scrolling; dropdown open, Esc, outside click, select; current item marked on reopen</td></tr>
<tr><td>Learning path cards</td><td>${count('Learning path cards')}</td><td>At 1440, 1024, 768 and 390 px: 16 cards, identical width and height, expected column count, consistent gaps (within 1 px rounding), no horizontal scroll, tags aligned per row</td></tr>
<tr><td>Timeline</td><td>${count('Our Story timeline')}</td><td>Year size and contrast measured against the original reconstruction; four milestones with four rail steps; scroll states and spine fill</td></tr>
<tr><td>Mobile navigation</td><td>${count('Mobile navigation')}</td><td>Menu toggle, Esc, current item, bottom-bar active state, no overflow on 5 pages</td></tr>
<tr><td>View switch / compare</td><td>${count('View switch and comparison page')}</td><td>Switch toggles skins; compare frames render original and improved; page selector updates both</td></tr>
<tr><td>Accessibility basics</td><td>${count('Accessibility basics')}</td><td>lang, skip link, labelled landmarks, aria-expanded, SVG labelling</td></tr></table>
<p><b>Issues found and fixed during testing:</b> tags misaligned across a card row when descriptions had different lengths (fixed by reserving two lines); three assertions were corrected for 1 px sub-pixel rounding, a selector, and a transition delay (test errors, not product defects).</p>
<p><b>Not done:</b> Lighthouse, screen-reader testing, real-device testing, Safari/Firefox, and any testing against the live site.</p>

<h2>12. Limitations and future scope</h2>
<ul><li>The prototype is not built on Next.js; port the three components and CSS into the real app (mechanical, see README).</li>
<li>The original view is a reconstruction; exact measurements of the live DOM may differ.</li>
<li>Some copy was written for the prototype: 12 card descriptions, category labels, and paraphrased milestone bodies for 2022 to 2024. Replace with Cynbit-approved text.</li>
<li>Team photos and logo are placeholders (initials, stand-in wordmark); use the official assets.</li>
<li>Next steps: Lighthouse and axe audits on the live site, a mega-menu or search for the 16 paths, scroll-spy anchors in long pages, and a user test of the breadcrumb on mobile.</li></ul>
</html>`;
const browser = await pw.chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({ path: join(root, 'docs/Technical-Report.pdf'), format: 'A4', printBackground: true, margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' } });
await browser.close();
console.log('wrote docs/Technical-Report.pdf');
