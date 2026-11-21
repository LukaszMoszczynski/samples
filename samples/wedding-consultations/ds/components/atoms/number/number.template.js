import { escapeHtml } from '../../_shared/escape.js';

export const LETTER_VARIANTS = ['step', 'word', 'industry'];

export function renderLetterCircle({ text = 'E', variant = 'step', active = false } = {}) {
  const variantName = LETTER_VARIANTS.includes(variant) ? variant : 'step';
  const classes = ['ds-letter-circle', `ds-letter-circle--${variantName}`, active ? 'is-active' : ''].filter(Boolean).join(' ');
  return `<span class="${classes}">${escapeHtml(text)}</span>`;
}

export function renderPageNumber({ text = '1', href = '#', current = false } = {}) {
  if (current) return `<span class="ds-page-number" aria-current="page">${escapeHtml(text)}</span>`;
  return `<a class="ds-page-number" href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
}
