import { escapeHtml } from '../../_shared/escape.js';

export const CHECK_TONES = ['default', 'on-brand'];

const TICK =
  '<svg class="ds-check-item__icon" viewBox="0 0 27 27" fill="none" stroke="currentColor" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 13.5 11.36 21 21 6"/></svg>';

export function renderCheckItem({ text = 'szef czuje się przeciążony i zagubiony w operacyjnym chaosie' } = {}) {
  return `<li class="ds-check-item">${TICK}<span class="ds-check-item__text">${escapeHtml(text)}</span></li>`;
}

export function renderCheckList({
  items = ['szef czuje się przeciążony i zagubiony w operacyjnym chaosie', 'zespół nie wie, jakie ma priorytety'],
  tone = 'default',
} = {}) {
  const toneClass = tone === 'on-brand' ? ' ds-check-list--on-brand' : '';
  return `<ul class="ds-check-list${toneClass}" role="list">${items.map((text) => renderCheckItem({ text })).join('')}</ul>`;
}
