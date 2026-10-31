// End-to-end checks against the built site. Usage: npm run build && npm test
// Starts its own static server on a free port, drives Chromium with Playwright.
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
const { chromium } = pw;

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const routes = JSON.parse(await readFile(join(dist, 'routes.json'), 'utf8'));

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  for (const rel of [p, join(p, 'index.html')]) {
    try {
      const file = join(dist, rel);
      if (!file.startsWith(dist)) continue;
      const data = await readFile(file);
      const ext = file.slice(file.lastIndexOf('.'));
      res.writeHead(200, { 'content-type': (TYPES[ext] || 'text/plain') + '; charset=utf-8' });
      return res.end(data);
    } catch { /* next */ }
  }
  res.writeHead(404); res.end('not found');
}).listen(0);
const base = `http://localhost:${server.address().port}`;

let pass = 0; const failures = [];
const check = (name, ok, detail = '') => { if (ok) { pass++; console.log(`  ok   ${name}`); } else { failures.push(name); console.log(`  FAIL ${name} ${detail}`); } };

const browser = await chromium.launch();
const newPage = async (w = 1440, h = 900) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(String(e)));
  // Google Fonts is an external request that may be blocked in CI/sandboxes; it is not an app error.
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_|fonts\.g/.test(m.text())) page.errors.push(m.text()); });
  return page;
};

console.log('Routes, console errors, links');
{
  const page = await newPage();
  const seen = new Set();
  for (const r of routes) {
    const resp = await page.goto(base + r);
    check(`GET ${r} -> 200`, resp.status() === 200);
    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    links.filter((h) => h.startsWith('/')).forEach((h) => seen.add(h.split('#')[0].split('?')[0]));
    const ids = await page.$$eval('[id]', (els) => els.map((e) => e.id));
    const anchors = links.filter((h) => h.startsWith('#') && h.length > 1).map((h) => h.slice(1));
    check(`${r} in-page anchors resolve`, anchors.every((a) => ids.includes(a)));
    const h1 = await page.$$eval('h1', (e) => e.length);
    check(`${r} has exactly one h1`, h1 === 1);
  }
  check('no JS errors on any page', page.errors.length === 0, page.errors.join(' | '));
  for (const href of seen) {
    const resp = await page.request.get(base + href);
    check(`internal link ${href || '/'} resolves`, resp.status() === 200);
  }
  await page.close();
}

console.log('Active navigation + breadcrumbs');
{
  const page = await newPage();
  const cases = [
    ['/story', 'Company', 'Our Story', ['Home', 'Company', 'Our Story']],
    ['/team', 'Company', 'Our Team', ['Home', 'Company', 'Our Team']],
    ['/bitelevate/paths', 'BitElevate', 'Learning Paths', ['Home', 'BitElevate', 'Learning Paths']],
    ['/bitelevate', 'BitElevate', 'The Ecosystem', ['Home', 'BitElevate', 'The Ecosystem']],
    ['/services', 'Expertise', 'Services Hub', ['Home', 'Expertise', 'Services Hub']],
  ];
  for (const [url, group, item, crumbs] of cases) {
    await page.goto(base + url);
    const activeTrigger = await page.$eval('.nav-group[data-active="true"] .nav-trigger', (e) => e.textContent.trim());
    check(`${url}: "${group}" trigger is highlighted`, activeTrigger === group);
    const current = await page.$$eval('.nav-menu [aria-current="page"]', (e) => e.map((x) => x.textContent.trim()));
    check(`${url}: only "${item}" is current in menus`, current.length === 1 && current[0] === item, JSON.stringify(current));
    const trail = await page.$$eval('.breadcrumbs li', (e) => e.map((x) => x.textContent.trim()));
    check(`${url}: breadcrumb ${crumbs.join(' > ')}`, JSON.stringify(trail) === JSON.stringify(crumbs), JSON.stringify(trail));
  }
  for (const [url, label] of [['/blog', 'Blog'], ['/contact', 'Contact']]) {
    await page.goto(base + url);
    const t = await page.$eval('.nav-link[aria-current="page"]', (e) => e.textContent.trim());
    check(`${url}: "${label}" link is current`, t === label);
  }
  // Home: no section is active
  await page.goto(base + '/');
  check('/: no menu item is marked active', (await page.$$('.primary-nav [aria-current], .nav-group[data-active="true"]')).length === 0);

  // Active state still visible after scrolling a long page
  await page.goto(base + '/story');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
  await page.waitForTimeout(250);
  const hdr = await page.$eval('[data-site-header]', (e) => e.getBoundingClientRect().top);
  const trig = await page.$eval('.nav-group[data-active="true"] .nav-trigger', (e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; });
  const crumbVisible = await page.$eval('.breadcrumbs', (e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; });
  check('after scrolling: header stays pinned at top', Math.abs(hdr) < 1);
  check('after scrolling: active trigger visible', trig);
  check('after scrolling: breadcrumb visible', crumbVisible);

  // Clicking through a dropdown item lands on the page with the group still active
  await page.goto(base + '/');
  await page.click('.nav-trigger:has-text("Company")');
  check('dropdown opens on click', (await page.getAttribute('.nav-trigger:has-text("Company")', 'aria-expanded')) === 'true');
  await page.keyboard.press('Escape');
  check('Esc closes dropdown', (await page.getAttribute('.nav-trigger:has-text("Company")', 'aria-expanded')) === 'false');
  await page.click('.nav-trigger:has-text("Company")');
  await page.click('.nav-menu__link:has-text("Our Team")');
  await page.waitForURL('**/team');
  check('after selecting Our Team: Company stays highlighted', (await page.$eval('.nav-group[data-active="true"] .nav-trigger', (e) => e.textContent.trim())) === 'Company');
  await page.click('.nav-trigger:has-text("Company")');
  check('reopened dropdown marks the current page', (await page.$eval('.nav-menu [aria-current="page"]', (e) => e.textContent.trim())) === 'Our Team');
  await page.mouse.click(10, 600);
  check('outside click closes dropdown', (await page.getAttribute('.nav-trigger:has-text("Company")', 'aria-expanded')) === 'false');
  await page.close();
}

console.log('Learning path cards');
{
  for (const [w, cols] of [[1440, 4], [1024, 2], [768, 2], [390, 1]]) {
    const page = await newPage(w, 900);
    await page.goto(base + '/bitelevate/paths');
    const boxes = await page.$$eval('.path-card article', (els) => els.map((e) => { const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; }));
    check(`${w}px: 16 cards`, boxes.length === 16);
    check(`${w}px: all cards same width`, new Set(boxes.map((b) => b.w)).size === 1, [...new Set(boxes.map((b) => b.w))].join(','));
    check(`${w}px: all cards same height`, new Set(boxes.map((b) => b.h)).size === 1, [...new Set(boxes.map((b) => b.h))].join(','));
    check(`${w}px: ${cols} column(s)`, new Set(boxes.map((b) => b.x)).size === cols);
    const gapsX = []; const gapsY = [];
    boxes.forEach((b, i) => { const n = boxes[i + 1]; if (n && n.y === b.y) gapsX.push(n.x - (b.x + b.w)); });
    const rows = [...new Set(boxes.map((b) => b.y))].sort((a, b) => a - b);
    rows.forEach((y, i) => { if (rows[i + 1]) gapsY.push(rows[i + 1] - y - boxes[0].h); });
    const allGaps = [...gapsX, ...gapsY];
    check(`${w}px: consistent gaps (within 1px rounding)`, Math.max(...allGaps) - Math.min(...allGaps) <= 1, allGaps.join(','));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    check(`${w}px: no horizontal scroll`, !overflow);
    if (w === 1440) {
      const tagYs = await page.$$eval('.path-card__tag', (els) => els.map((e) => Math.round(e.getBoundingClientRect().y + scrollY)));
      const rowsTags = {};
      tagYs.forEach((y, i) => { const r = Math.floor(i / 4); (rowsTags[r] ||= new Set()).add(y); });
      check('1440px: tags align across each row', Object.values(rowsTags).every((s) => s.size === 1));
    }
    await page.close();
  }
  const page = await newPage();
  await page.goto(base + '/bitelevate/paths?view=original');
  const hs = await page.$$eval('.path-card article', (els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().height))).size);
  check('original reconstruction: card heights are uneven (baseline for comparison)', hs > 3, String(hs));
  await page.close();
}

console.log('Our Story timeline');
{
  const page = await newPage();
  await page.goto(base + '/story');
  const imp = await page.$eval('.ms-year', (e) => ({ size: parseFloat(getComputedStyle(e).fontSize), color: getComputedStyle(e).color }));
  await page.goto(base + '/story?view=original');
  const orig = await page.$eval('.ms-year', (e) => ({ size: parseFloat(getComputedStyle(e).fontSize), color: getComputedStyle(e).color }));
  check('improved year is larger than original', imp.size > orig.size * 1.4, `${imp.size} vs ${orig.size}`);
  const lum = (c) => { const [r, g, b] = c.match(/\d+/g).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  check('improved year contrast vs page bg >= 4.5:1', ratio(imp.color, 'rgb(247,250,250)') >= 4.5, ratio(imp.color, 'rgb(247,250,250)').toFixed(2));
  check('original year contrast is below 3:1 (baseline)', ratio(orig.color, 'rgb(247,250,250)') < 3, ratio(orig.color, 'rgb(247,250,250)').toFixed(2));
  await page.goto(base + '/story');
  check('4 milestones, 4 rail steps each', (await page.$$('.ms')).length === 4 && (await page.$$eval('.ms', (e) => e.every((m) => m.querySelectorAll('.rail__step').length === 4))));
  check('milestone cards carry labelled content (chips or stats)', (await page.$$eval('.ms-extras', (e) => e.every((x) => x.textContent.trim().length > 0))));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await page.waitForTimeout(300);
  const states = await page.$$eval('.ms', (e) => e.map((x) => x.dataset.state));
  check('scroll sets done/current/todo states', states.includes('current') && states.includes('done'), states.join(','));
  const fill = await page.$eval('[data-timeline-fill]', (e) => parseFloat(e.style.height));
  check('spine fill follows scroll', fill > 10 && fill < 100, String(fill));
  await page.click('.ms:nth-child(3) .rail__step:nth-child(1) a').catch(() => {});
  await page.close();
}

console.log('Mobile navigation');
{
  const page = await newPage(390, 844);
  await page.goto(base + '/story');
  check('desktop nav hidden on mobile', !(await page.isVisible('.primary-nav__list')));
  check('bottom bar visible', await page.isVisible('.bottom-bar'));
  check('mobile menu closed initially', !(await page.isVisible('#mobile-menu')));
  await page.click('[data-menu-toggle]');
  check('menu toggle opens menu', await page.isVisible('#mobile-menu'));
  check('Company group is expanded and current item marked', (await page.$eval('#mobile-menu details[open] [aria-current="page"]', (e) => e.textContent.trim())) === 'Our Story');
  await page.keyboard.press('Escape');
  check('Esc closes mobile menu', !(await page.isVisible('#mobile-menu')));
  check('breadcrumb visible on mobile', await page.isVisible('.breadcrumbs'));
  await page.goto(base + '/bitelevate');
  check('bottom bar marks BitElevate on /bitelevate', (await page.$eval('.bottom-bar [aria-current="page"]', (e) => e.textContent.trim())) === 'BitElevate');
  await page.goto(base + '/bitelevate/paths');
  check('bottom bar marks BitElevate on /bitelevate/paths', (await page.$eval('.bottom-bar [aria-current="page"]', (e) => e.textContent.trim())) === 'BitElevate');
  for (const r of ['/', '/story', '/team', '/bitelevate/paths', '/compare']) {
    await page.goto(base + r);
    check(`390px ${r}: no horizontal scroll`, !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
  }
  await page.close();
}

console.log('View switch and comparison page');
{
  const page = await newPage();
  await page.goto(base + '/story');
  await page.click('[data-view-btn="original"]');
  check('switch to original hides breadcrumb', !(await page.isVisible('.breadcrumbs')));
  await page.waitForTimeout(400); // let the colour transition finish
  check('original: no highlighted menu trigger', (await page.$eval('.nav-group[data-active="true"] .nav-trigger', (e) => getComputedStyle(e).backgroundColor)) === 'rgba(0, 0, 0, 0)');
  await page.click('[data-view-btn="improved"]');
  check('switch back restores breadcrumb', await page.isVisible('.breadcrumbs'));
  await page.goto(base + '/compare');
  const frames = page.frames().filter((f) => f !== page.mainFrame());
  await page.waitForTimeout(500);
  const views = await Promise.all(frames.map((f) => f.evaluate(() => document.documentElement.dataset.view)));
  check('compare frames render original and improved', views.sort().join() === 'improved,original', views.join());
  await page.click('[data-page="/bitelevate/paths"]');
  await page.waitForTimeout(500);
  const urls = page.frames().filter((f) => f !== page.mainFrame()).map((f) => new URL(f.url()).pathname);
  check('compare page switch updates both frames', urls.every((u) => u === '/bitelevate/paths'), urls.join());
  await page.close();
}

console.log('Accessibility basics');
{
  const page = await newPage();
  await page.goto(base + '/story');
  check('html has lang', (await page.getAttribute('html', 'lang')) === 'en');
  check('skip link targets main', (await page.getAttribute('.skip-link', 'href')) === '#main');
  check('nav landmarks are labelled', (await page.$$eval('nav', (n) => n.every((x) => x.getAttribute('aria-label')))));
  await page.keyboard.press('Tab');
  check('first Tab stop is the skip link', await page.$eval(':focus', (e) => e.classList.contains('skip-link')));
  check('dropdown triggers expose aria-expanded', (await page.$$eval('.nav-trigger', (e) => e.every((x) => x.hasAttribute('aria-expanded')))));
  check('images/svgs decorative or labelled', (await page.$$eval('svg:not([aria-hidden])', (s) => s.every((x) => x.getAttribute('role') === 'img' && x.getAttribute('aria-label')))));
  await page.close();
}

await browser.close(); server.close();
console.log(`\n${pass} passed, ${failures.length} failed`);
if (failures.length) { console.log(failures.map((f) => ' - ' + f).join('\n')); process.exit(1); }
