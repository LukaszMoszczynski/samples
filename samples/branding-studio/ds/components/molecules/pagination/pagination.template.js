import { escapeHtml } from '../../_shared/escape.js';
import { renderCarouselControls } from '../../atoms/carousel-controls/carousel-controls.template.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';
import { renderPageNumber } from '../../atoms/number/number.template.js';

export const PAGINATION_VARIANTS = ['dots', 'counter', 'pages'];

function renderPages({ count, current, href, ariaLabel, nextAriaLabel }) {
  const items = Array.from({ length: count }, (_, index) => {
    const page = index + 1;
    return `<li>${renderPageNumber({ text: String(page), href: href(page), current: page === current })}</li>`;
  });
  if (current < count) {
    items.push(
      `<li class="ds-pagination__next-item"><a class="ds-pagination__next" href="${escapeHtml(href(current + 1))}" aria-label="${escapeHtml(nextAriaLabel)}">${renderIcon({ name: 'chevron-right' })}</a></li>`,
    );
  }
  return `<nav class="ds-pagination ds-pagination--pages" aria-label="${escapeHtml(ariaLabel)}"><ul class="ds-pagination__list" role="list">${items.join('')}</ul></nav>`;
}

export function renderPagination({
  variant = 'dots',
  count = 5,
  active = 1,
  current = 1,
  hrefPattern = '/blog/page/{page}/',
  ariaLabel = 'Stronicowanie',
  nextAriaLabel = 'Następna strona',
} = {}) {
  if (variant === 'pages') {
    const href = (page) => String(hrefPattern).replace('{page}', String(page));
    return renderPages({ count, current, href, ariaLabel, nextAriaLabel });
  }
  return renderCarouselControls({ count, active, counter: variant === 'counter' });
}
