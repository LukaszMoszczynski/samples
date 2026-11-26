import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../icon/icon.template.js';

export const LINK_VARIANTS = ['inline', 'list', 'arrow', 'brand', 'footer', 'bold', 'inverse'];
const WITH_ARROW = new Set(['arrow', 'brand', 'bold', 'inverse']);

export function renderLink({ text = 'Zobacz szczegóły', href = '#', variant = 'inline', uppercase = false } = {}) {
  const variantName = LINK_VARIANTS.includes(variant) ? variant : 'inline';
  const classes = `ds-link ds-link--${variantName}${uppercase ? ' ds-link--uppercase' : ''}`;
  const arrow = WITH_ARROW.has(variantName) ? renderIcon({ name: 'arrow-diagonal' }) : '';
  const content = arrow ? `<span class="ds-link__label">${escapeHtml(text)}</span>${arrow}` : escapeHtml(text);
  if (!href) return `<span class="${classes}">${content}</span>`;
  return `<a class="${classes}" href="${escapeHtml(href)}">${content}</a>`;
}
