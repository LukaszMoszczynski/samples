import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../icon/icon.template.js';

export const BUTTON_VARIANTS = ['primary', 'accent', 'light'];
export const BUTTON_SHAPES = ['arrow', 'pill'];
export const BUTTON_ARROW_VARIANTS = ['default', 'inverted'];

function openTag({ href, disabled, classes, tag, type }) {
  if (tag === 'span') return { open: `<span class="${classes}">`, close: '</span>' };
  if (href && disabled) return { open: `<a class="${classes}" role="link" aria-disabled="true">`, close: '</a>' };
  if (href) return { open: `<a class="${classes}" href="${escapeHtml(href)}">`, close: '</a>' };
  return { open: `<button type="${type === 'submit' ? 'submit' : 'button'}" class="${classes}"${disabled ? ' disabled' : ''}>`, close: '</button>' };
}

export function renderButton({ text = 'Poznaj ofertę', href = '', variant = 'primary', shape = 'arrow', disabled = false, tag = '', type = 'button', accentIcon = false, uppercase = false } = {}) {
  const variantName = BUTTON_VARIANTS.includes(variant) ? variant : 'primary';
  const classes = [
    'ds-button',
    `ds-button--${variantName}`,
    shape === 'pill' ? 'ds-button--pill' : '',
    accentIcon && shape !== 'pill' ? 'ds-button--accent-icon' : '',
    uppercase ? 'ds-button--uppercase' : '',
  ].filter(Boolean).join(' ');
  const { open, close } = openTag({ href, disabled, classes, tag, type });
  const icon = shape === 'pill' ? '' : `<span class="ds-button__icon">${renderIcon({ name: 'arrow-diagonal' })}</span>`;
  return `${open}<span class="ds-button__label">${escapeHtml(text)}</span>${icon}${close}`;
}

export function renderButtonOutline({ text = 'Więcej', href = '' } = {}) {
  if (href) return `<a class="ds-button-outline" href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
  return `<span class="ds-button-outline">${escapeHtml(text)}</span>`;
}

export function renderButtonArrow({ href = '', ariaLabel = 'Czytaj dalej', variant = 'default' } = {}) {
  const classes = ['ds-button-arrow', variant === 'inverted' ? 'ds-button-arrow--inverted' : ''].filter(Boolean).join(' ');
  const icon = renderIcon({ name: 'arrow-diagonal' });
  if (href) return `<a class="${classes}" href="${escapeHtml(href)}" aria-label="${escapeHtml(ariaLabel)}">${icon}</a>`;
  return `<span class="${classes}" aria-hidden="true">${icon}</span>`;
}
