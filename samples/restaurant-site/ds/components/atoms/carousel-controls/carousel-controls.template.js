import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../icon/icon.template.js';

const ARROW_LABELS = { prev: 'Poprzednie', next: 'Następne' };

export function renderCarouselArrow({ direction = 'next', ariaLabel = '', disabled = false } = {}) {
  const directionName = direction === 'prev' ? 'prev' : 'next';
  const icon = renderIcon({ name: directionName === 'prev' ? 'chevron-left' : 'chevron-right' });
  const name = escapeHtml(ariaLabel || ARROW_LABELS[directionName]);
  return `<button type="button" class="ds-carousel-arrow ds-carousel-arrow--${directionName}" data-ds-carousel-${directionName} aria-label="${name}"${disabled ? ' disabled' : ''}>${icon}</button>`;
}

export function renderCarouselDot({ index = 0, active = false } = {}) {
  const current = active ? ' aria-current="true"' : '';
  return `<button type="button" class="ds-carousel-dot" data-ds-dot="${index}" aria-label="Przejdź do slajdu ${index + 1}"${current}></button>`;
}

export function renderCarouselCounter({ active = 0, count = 1 } = {}) {
  return `<span class="ds-carousel-controls__counter">${active + 1} / ${count}</span>`;
}

export function renderCarouselControls({ count = 4, active = 0, counter = false, prevDisabled = false, nextDisabled = false } = {}) {
  const dots = counter
    ? renderCarouselCounter({ active, count })
    : Array.from({ length: count }, (_, index) => renderCarouselDot({ index, active: index === active })).join('');
  return `<div class="ds-carousel-controls">${renderCarouselArrow({ direction: 'prev', disabled: prevDisabled })}<div class="ds-carousel-controls__dots" data-ds-carousel-dots${counter ? ' aria-live="polite"' : ''}>${dots}</div>${renderCarouselArrow({ direction: 'next', disabled: nextDisabled })}</div>`;
}
