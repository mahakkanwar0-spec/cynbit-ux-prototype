import { CATEGORIES, pathsWithSurface } from '../data/paths.mjs';
import { icon } from './icons.mjs';
import { esc } from './util.mjs';

const pad = (n) => String(n).padStart(2, '0');

/**
 * One learning-path card. Every card renders the same structure
 * (icon, index, category, title, description) so card height never depends on content.
 * `data-surface` is the improved colour treatment; `data-original` feeds the original-layout skin.
 */
export function pathCard(path, total) {
  return `<li class="path-card" data-surface="${path.surface}" data-original="${path.originalSurface}" data-source="${path.source}" data-n="${path.index}" data-category="${path.category}">
    <article>
      <div class="path-card__top">
        <span class="path-card__icon">${icon(path.icon, { size: 22 })}</span>
        <span class="path-card__index" aria-label="Path ${path.index} of ${total}">${pad(path.index)}/${pad(total)}</span>
      </div>
      <div class="path-card__body">
        <span class="path-card__tag">${esc(CATEGORIES[path.category].label)}</span>
        <h3 class="path-card__title">${esc(path.title)}</h3>
        <p class="path-card__desc">${esc(path.desc)}</p>
      </div>
    </article>
  </li>`;
}

export function pathGrid() {
  const paths = pathsWithSurface();
  return `<ul class="path-grid" aria-label="Learning paths">
  ${paths.map((p) => pathCard(p, paths.length)).join('\n  ')}
</ul>`;
}
