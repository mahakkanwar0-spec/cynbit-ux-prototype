// Dependency-free static build: renders every route to dist/<route>/index.html
// and bundles CSS and client JS. Run with `npm run build`.
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as overview from '../src/pages/overview.mjs';
import * as story from '../src/pages/story.mjs';
import * as paths from '../src/pages/paths.mjs';
import * as team from '../src/pages/team.mjs';
import * as compare from '../src/pages/compare.mjs';
import { renderGeneric, genericRoutes } from '../src/pages/generic.mjs';
import { renderPage } from '../src/components/layout.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const CSS_FILES = ['tokens', 'base', 'header', 'paths', 'timeline', 'pages', 'original-skin'];
const JS_FILES = ['nav', 'view', 'timeline', 'compare'];

async function write(rel, content) {
  const target = join(dist, rel);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
}

const built = [];
const page = (route, html) => {
  built.push(route);
  return write(route === '/' ? 'index.html' : `${route.slice(1)}/index.html`, html);
};

await rm(dist, { recursive: true, force: true });

// Fully built pages
const full = [overview, story, paths, team];
await page(compare.route, compare.render());
for (const mod of full) await page(mod.route, mod.render());

// Remaining real routes, rendered inside the shell
const fullRoutes = full.map((m) => m.route);
for (const route of genericRoutes(fullRoutes)) await page(route.href, renderGeneric(route));

// 404
await write(
  '404.html',
  renderPage({
    path: '/404',
    title: 'Page not found',
    description: 'The page you requested does not exist in this prototype.',
    body: `<section class="page-hero container"><p class="eyebrow">404</p><h1 class="display">Page not found.</h1>
<p class="lead">That address is not part of the prototype.</p>
<p><a class="btn btn--primary" href="/">Back to prototype overview</a></p></section>`,
  }),
);

// Assets
const css = [];
for (const name of CSS_FILES) css.push(`/* ${name}.css */\n` + (await readFile(join(root, 'src/styles', `${name}.css`), 'utf8')));
await write('assets/site.css', css.join('\n'));

const js = [];
for (const name of JS_FILES) js.push(`/* ${name}.js */\n` + (await readFile(join(root, 'src/scripts', `${name}.js`), 'utf8')));
await write('assets/site.js', `(function(){'use strict';\n${js.join('\n')}\n})();`);

await write(
  'assets/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#006067"/><text x="16" y="22" text-anchor="middle" font-family="Georgia,serif" font-size="18" fill="#fff">C</text></svg>`,
);

await write('routes.json', JSON.stringify(built.sort(), null, 2));
console.log(`Built ${built.length} pages -> dist/`);
