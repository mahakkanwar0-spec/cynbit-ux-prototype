import { header } from './header.mjs';
import { footer, bottomBar } from './footer.mjs';
import { esc } from './util.mjs';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

/** Runs before first paint: marks the page as JS-capable and applies ?view=original. */
const BOOT_SCRIPT = `(function(){var d=document.documentElement,v=null;d.classList.add('js');try{v=new URLSearchParams(location.search).get('view')}catch(e){}if(!v&&window.name.indexOf('cynbit-view-')===0){v=window.name.slice(12);d.classList.add('framed')}if(!v){try{v=localStorage.getItem('cynbit-view')}catch(e){}}if(location.pathname.indexOf('/compare')===0)v='improved';d.dataset.view=v==='original'?'original':'improved'})()`;

function viewSwitch() {
  return `<div class="view-switch" role="group" aria-label="Prototype view">
  <span class="view-switch__label">View</span>
  <button type="button" data-view-btn="improved" aria-pressed="true">Improved</button>
  <button type="button" data-view-btn="original" aria-pressed="false">Original <small>(reconstruction)</small></button>
</div>`;
}

export function renderPage({ path, title, description, body, className = '' }) {
  const fullTitle = path === '/' ? title : `${title} | Cynbit Technologies (prototype)`;
  return `<!doctype html>
<html lang="en" data-view="improved">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#006067">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_URL}">
<link rel="stylesheet" href="/assets/site.css">
<script>${BOOT_SCRIPT}</script>
</head>
<body class="${esc(className)}">
<a class="skip-link" href="#main">Skip to content</a>
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(path)}
${bottomBar(path)}
${viewSwitch()}
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}
