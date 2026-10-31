// Captures improved + reconstructed-original screenshots and before/after composites.
// Requires `npm run build` first. Output goes to ./screenshots.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(join(execSync('npm root -g').toString().trim(), 'playwright')); }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = (...p) => join(root, 'screenshots', ...p);
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  for (const rel of [p, join(p, 'index.html')]) {
    try { const f = join(dist, rel); const d = await readFile(f); res.writeHead(200, { 'content-type': TYPES[f.slice(f.lastIndexOf('.'))] || 'text/plain' }); return res.end(d); } catch { /* next */ }
  }
  res.writeHead(404); res.end();
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await pw.chromium.launch();
const hideSwitch = '.view-switch{display:none!important}';

async function shot(view, name, url, { w, h, full = false, scrollY = 0, action } = {}) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${base}${url}${url.includes('?') ? '&' : '?'}view=${view}`);
  await page.addStyleTag({ content: hideSwitch });
  if (action) await action(page);
  if (scrollY) { await page.evaluate((y) => window.scrollTo(0, y), scrollY); await page.waitForTimeout(400); }
  const dir = view === 'improved' ? 'improved' : 'reconstruction-original';
  const file = out(dir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: full });
  await page.close();
  return file;
}

const shots = [
  ['story-desktop', '/story', { w: 1440, h: 900, scrollY: 380 }],
  ['story-desktop-scrolled', '/story', { w: 1440, h: 900, scrollY: 1500 }],
  ['paths-desktop', '/bitelevate/paths', { w: 1440, h: 900, full: true }],
  ['paths-tablet', '/bitelevate/paths', { w: 768, h: 1024, full: true }],
  ['paths-mobile', '/bitelevate/paths', { w: 390, h: 844, full: true }],
  ['team-mobile', '/team', { w: 390, h: 844 }],
  ['story-mobile', '/story', { w: 390, h: 844, scrollY: 300 }],
  ['nav-dropdown-desktop', '/story', { w: 1440, h: 420, action: async (p) => { await p.click('.nav-trigger:has-text("Company")'); await p.waitForTimeout(300); } }],
  ['nav-mobile-menu', '/story', { w: 390, h: 844, action: async (p) => { await p.click('[data-menu-toggle]'); await p.waitForTimeout(200); } }],
];
const made = {};
for (const [name, url, opts] of shots) {
  for (const view of ['improved', 'original']) {
    made[`${view}/${name}`] = await shot(view, name, url, opts);
  }
  console.log('captured', name);
}

// Before/after composites: two images side by side with labels.
const composite = async (name, title, width = 1000) => {
  const dir = out('comparison');
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  const b64 = async (f) => 'data:image/png;base64,' + (await readFile(f)).toString('base64');
  const [a, b] = [await b64(made[`original/${name}`]), await b64(made[`improved/${name}`])];
  await page.setContent(`<body style="margin:0;font-family:Inter,sans-serif;background:#f7fafa"><div style="display:flex;gap:24px;padding:24px;align-items:flex-start">
    <figure style="margin:0;flex:1;min-width:0"><figcaption style="font-weight:800;margin-bottom:8px;color:#774e00">BEFORE · original (reconstruction)</figcaption><img style="width:100%;border:1px solid #d3dcdc;border-radius:12px" src="${a}"></figure>
    <figure style="margin:0;flex:1;min-width:0"><figcaption style="font-weight:800;margin-bottom:8px;color:#006067">AFTER · improved</figcaption><img style="width:100%;border:1px solid #d3dcdc;border-radius:12px" src="${b}"></figure></div>
    <p style="margin:0;padding:0 24px 24px;color:#4a5557">${title}</p></body>`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(dir, `before-after-${name}.png`), fullPage: true });
  await page.close();
};
await composite('story-desktop', 'Our Story: milestone card and active navigation', 2200);
await composite('paths-desktop', 'Learning paths: card grid', 2200);
await composite('paths-mobile', 'Learning paths on mobile');
await composite('team-mobile', 'Team page on mobile: bottom bar and breadcrumb');
await composite('nav-dropdown-desktop', 'Open Company dropdown', 2200);
await composite('nav-mobile-menu', 'Mobile menu');
await browser.close(); server.close();
console.log('done');
