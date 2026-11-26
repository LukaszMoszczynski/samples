import { escapeHtml } from '../../_shared/escape.js';

export const TEXT_VARIANTS = ['4xl', '3xl', '2xl', '2xl-medium', 'xl', 'lg', 'lead-large', 'body', 'body-bold', 'small', 'overline', 'number', 'button', 'question'];
export const TEXT_TONES = ['inherit', 'default', 'muted', 'primary', 'accent', 'on-brand'];
export const TEXT_TAGS = ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export function renderText({ text = 'Zażółć gęślą jaźń', strong = '', variant = 'body', mobile = '', tone = 'inherit', tag = 'p', className = '' } = {}) {
  const variantName = TEXT_VARIANTS.includes(variant) ? variant : 'body';
  const mobileClass = TEXT_VARIANTS.includes(mobile) && mobile !== variantName ? ` ds-text--mobile-${mobile}` : '';
  const toneClass = TEXT_TONES.includes(tone) && tone !== 'inherit' ? ` ds-text--${tone}` : '';
  const extraClass = className ? ` ${escapeHtml(className)}` : '';
  const tagName = TEXT_TAGS.includes(tag) ? tag : 'p';
  const closing = strong ? `${text ? ' ' : ''}<strong>${escapeHtml(strong)}</strong>` : '';
  return `<${tagName} class="ds-text ds-text--${variantName}${mobileClass}${toneClass}${extraClass}">${escapeHtml(text)}${closing}</${tagName}>`;
}
