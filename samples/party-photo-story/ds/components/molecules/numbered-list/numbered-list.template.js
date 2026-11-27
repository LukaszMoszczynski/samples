import { renderLetterCircle } from '../../atoms/number/number.template.js';
import { renderText } from '../../atoms/text/text.template.js';

export const DEFAULT_NUMBERED_ITEMS = ['Diagnoza potrzeb i celów', 'Program szyty na miarę', 'Warsztaty i wdrożenie', 'Mierzenie efektów'];

export function renderNumberedList({ items = DEFAULT_NUMBERED_ITEMS } = {}) {
  const rows = items
    .map((item, index) => `<li class="ds-numbered-list__item">${renderLetterCircle({ text: String(index + 1) })}${renderText({ text: item, variant: '2xl-medium', tag: 'span', className: 'ds-numbered-list__text' })}</li>`)
    .join('');
  return `<ol class="ds-numbered-list" role="list">${rows}</ol>`;
}
