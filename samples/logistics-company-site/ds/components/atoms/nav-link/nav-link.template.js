import { escapeHtml } from '../../_shared/escape.js';

export function renderNavLink({ text = 'Oferta', href = '#', current = false } = {}) {
  return `<a class="ds-nav-link" href="${escapeHtml(href)}"${current ? ' aria-current="page"' : ''}>${escapeHtml(text)}</a>`;
}

export function renderNavCta({ text = 'Dzwonię', href = 'tel:+48000000000' } = {}) {
  return `<a class="ds-nav-cta" href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
}

export function renderNavBurger({ open = false, ariaLabel = 'Menu', controls = '' } = {}) {
  const controlsAttribute = controls ? ` aria-controls="${escapeHtml(controls)}"` : '';
  return `<button type="button" class="ds-nav-burger" aria-expanded="${open ? 'true' : 'false'}" aria-label="${escapeHtml(ariaLabel)}"${controlsAttribute}><span class="ds-nav-burger__lines"></span></button>`;
}
