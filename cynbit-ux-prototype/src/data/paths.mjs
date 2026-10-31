/**
 * The 16 learning paths, in the order they appear on https://www.cynbit.in/bitelevate/paths.
 * Titles and the four descriptions marked `source: 'live'` were read from the live page.
 * Descriptions marked `source: 'proposed'` are short copy written for this prototype so every
 * card has the same content structure; the live page shows none for those cards.
 */
export const CATEGORIES = {
  engineering: { label: 'Engineering' },
  data: { label: 'Data & AI' },
  design: { label: 'Design' },
  growth: { label: 'Growth' },
};

export const PATHS = [
  { title: 'Full stack web development', category: 'engineering', icon: 'layers', desc: 'Front end, back end and everything between.', source: 'proposed' },
  { title: 'Digital marketing', category: 'growth', icon: 'megaphone', desc: 'Campaigns, search and measurable reach.', source: 'proposed' },
  { title: 'UI/UX design', category: 'design', icon: 'brush', desc: 'Interfaces people understand at a glance.', source: 'proposed' },
  { title: 'Artificial Intelligence (AI)', category: 'data', icon: 'spark', desc: 'Adaptive neural frameworks.', source: 'live', variant: 'teal' },
  { title: 'Machine learning (ML)', category: 'data', icon: 'cycle', desc: 'Models that learn from data.', source: 'proposed' },
  { title: 'Data science', category: 'data', icon: 'trend', desc: 'Turning raw data into decisions.', source: 'proposed' },
  { title: 'Data analytics', category: 'data', icon: 'bars', desc: 'Dashboards, metrics and insight.', source: 'proposed' },
  { title: 'DevOps', category: 'engineering', icon: 'terminal', desc: 'Continuous integration. Zero friction.', source: 'live', variant: 'dark' },
  { title: 'Cloud computing', category: 'engineering', icon: 'cloud', desc: 'AWS / Azure / GCP', source: 'live' },
  { title: 'Cybersecurity', category: 'engineering', icon: 'shield', desc: 'Defend systems before they are tested.', source: 'proposed' },
  { title: 'Blockchain development', category: 'engineering', icon: 'blocks', desc: 'Decentralised applications and ledgers.', source: 'proposed' },
  { title: 'Internet of things', category: 'engineering', icon: 'sensors', desc: 'Connected edge', source: 'live' },
  { title: 'Social media management', category: 'growth', icon: 'share', desc: 'Voice, community and consistent presence.', source: 'proposed' },
  { title: 'Deep learning', category: 'data', icon: 'network', desc: 'Layered networks for complex patterns.', source: 'proposed' },
  { title: 'Natural language processing (NLP)', category: 'data', icon: 'translate', desc: 'Software that reads and writes language.', source: 'proposed' },
  { title: 'Business analytics', category: 'data', icon: 'query', desc: 'Data framed around business questions.', source: 'proposed' },
];

/**
 * Surface style per card. In the improved layout every card is the same size and these
 * only change colour, so emphasis never changes dimensions. The original site used
 * six different surfaces plus uneven spans; `originalSurface` feeds the "original" skin.
 */
const ORIGINAL_SURFACES = ['white', 'grey', 'brown', 'teal', 'outline', 'white', 'grey', 'dark'];

export function pathsWithSurface() {
  return PATHS.map((p, i) => ({
    ...p,
    index: i + 1,
    originalSurface: ORIGINAL_SURFACES[i % ORIGINAL_SURFACES.length],
    // Improved layout: alternate white / grey, with the two accent cards the live site highlights.
    surface: p.variant || (i % 2 === 0 ? 'white' : 'grey'),
  }));
}
