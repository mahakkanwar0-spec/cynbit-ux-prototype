const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Join class names, dropping falsy values. */
export function cx(...names) {
  return names.filter(Boolean).join(' ');
}
