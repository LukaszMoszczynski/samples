import { escapeHtml } from '../../_shared/escape.js';

export const LABEL_VARIANTS = ['accent', 'primary', 'inverse'];

export function renderLabel({ text = 'Polecane', variant = 'accent' } = {}) {
  const variantName = LABEL_VARIANTS.includes(variant) ? variant : 'accent';
  return `<span class="ds-label ds-label--${variantName}">${escapeHtml(text)}</span>`;
}
