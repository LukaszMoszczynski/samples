import { escapeHtml } from '../../_shared/escape.js';

export const DEFAULT_TRAIL = [
  { text: 'Strona główna', href: '/' },
  { text: 'Szkolenia', href: '/szkolenia/' },
  { text: 'Negocjacje handlowe' },
];

export function renderBreadcrumbs({ items = DEFAULT_TRAIL, ariaLabel = 'Ścieżka nawigacji' } = {}) {
  const list = items
    .map((item, index) => {
      const content =
        index === items.length - 1
          ? `<span class="ds-breadcrumbs__current" aria-current="page">${escapeHtml(item.text)}</span>`
          : `<a class="ds-breadcrumbs__link" href="${escapeHtml(item.href ?? '#')}">${escapeHtml(item.text)}</a>`;
      return `<li class="ds-breadcrumbs__item">${content}</li>`;
    })
    .join('');
  return `<nav class="ds-breadcrumbs" aria-label="${escapeHtml(ariaLabel)}"><ol class="ds-breadcrumbs__list">${list}</ol></nav>`;
}
