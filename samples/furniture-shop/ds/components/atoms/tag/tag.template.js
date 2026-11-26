import { escapeHtml } from '../../_shared/escape.js';

export const TAG_VARIANTS = ['soft', 'white', 'brand', 'outline', 'brand-small', 'article', 'article-white', 'hashtag'];

export function renderTag({ text = 'Przetestowany', variant = 'soft', href = '', datetime = '', tag = 'span' } = {}) {
  const classes = `ds-tag ds-tag--${TAG_VARIANTS.includes(variant) ? variant : 'soft'}`;
  const content = escapeHtml(text);
  if (href) return `<a class="${classes}" href="${escapeHtml(href)}">${content}</a>`;
  if (datetime) return `<time class="${classes}" datetime="${escapeHtml(datetime)}">${content}</time>`;
  const tagName = tag === 'li' ? 'li' : 'span';
  return `<${tagName} class="${classes}">${content}</${tagName}>`;
}
