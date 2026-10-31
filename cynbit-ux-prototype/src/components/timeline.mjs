import { MILESTONES } from '../data/milestones.mjs';
import { icon } from './icons.mjs';
import { esc } from './util.mjs';

/** Labelled progress rail: each year is a link to its milestone, completed years are filled. */
function rail(currentIndex) {
  const items = MILESTONES.map((m, i) => {
    const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo';
    return `<li class="rail__step" data-state="${state}"><a href="#year-${m.year}"${i === currentIndex ? ' aria-current="step"' : ''}><span class="rail__bar"></span><span class="rail__year">${m.year}</span></a></li>`;
  }).join('');
  return `<ol class="rail" aria-label="Timeline progress">${items}</ol>`;
}

/** Four plain pills used only by the "original" skin (recreates the unlabelled pills seen on the live page). */
function originalPills(currentIndex) {
  const pills = MILESTONES.map((_, i) => `<span class="pill" data-on="${i <= Math.min(currentIndex + 1, 1) ? 'true' : 'false'}"></span>`).join('');
  return `<div class="pills" aria-hidden="true">${pills}</div>`;
}

function extras(m) {
  if (m.stats) {
    return `<dl class="ms-stats">${m.stats
      .map((s) => `<div><dt>${esc(s.caption)}</dt><dd>${esc(s.value)}</dd></div>`)
      .join('')}</dl>`;
  }
  if (m.chips) {
    return `<ul class="ms-chips" aria-label="Milestone highlights">${m.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`;
  }
  return '';
}

function milestone(m, i) {
  return `<article class="ms" id="year-${m.year}" data-index="${i}" aria-labelledby="ms-title-${m.year}">
    <div class="ms-card">
      <div class="ms-card__top">
        <span class="ms-icon">${icon(m.icon, { size: 26 })}</span>
        <span class="ms-year" aria-hidden="true">${m.year}</span>
      </div>
      ${rail(i)}
      ${originalPills(i)}
      <p class="ms-card__label">${esc(m.label)}</p>
      <div class="ms-extras">${extras(m)}</div>
    </div>
    <div class="ms-copy">
      <p class="eyebrow">${esc(m.tag)}</p>
      <h2 class="ms-title" id="ms-title-${m.year}">${m.year}: ${esc(m.heading)}</h2>
      <p class="ms-body">${esc(m.body)}</p>
    </div>
  </article>`;
}

export function timeline() {
  return `<div class="timeline" data-timeline>
  <div class="timeline__track" aria-hidden="true"><span class="timeline__fill" data-timeline-fill></span></div>
  ${MILESTONES.map(milestone).join('\n  ')}
</div>`;
}
