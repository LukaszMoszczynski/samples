import { escapeHtml } from '../../_shared/escape.js';
import { renderIcon } from '../../atoms/icon/icon.template.js';
import { renderNavBurger, renderNavCta, renderNavLink } from '../../atoms/nav-link/nav-link.template.js';
import { renderMegaMenu } from '../mega-menu/mega-menu.template.js';
import { renderMobileMenu } from '../mobile-menu/mobile-menu.template.js';

export const HEADER_TAGS = ['header', 'div'];

export const DEFAULT_HEADER_ITEMS = [
  { text: 'Oferta', href: '#', mega: true },
  { text: 'Szkolenia', href: '#', current: true },
  { text: 'Metody', href: '#' },
  { text: 'O nas', href: '#' },
  { text: 'Blog', href: '#' },
  { text: 'Kontakt', href: '#' },
];

function renderBrand({ logo, logoAlt, homeHref, homeAriaLabel, badge, badgeAlt }) {
  const logoMark = logo ? `<img class="ds-header__logo-image" src="${escapeHtml(logo)}" alt="${escapeHtml(logoAlt)}">` : '<span class="ds-header__logo-placeholder" aria-hidden="true"></span>';
  const badgeMark = badge
    ? `<img class="ds-header__badge" src="${escapeHtml(badge)}" alt="${escapeHtml(badgeAlt)}">`
    : '<span class="ds-header__badge ds-header__badge--placeholder" aria-hidden="true"></span>';
  return `<div class="ds-header__brand"><a class="ds-header__logo" href="${escapeHtml(homeHref)}" rel="home" aria-label="${escapeHtml(homeAriaLabel)}">${logoMark}</a>${badgeMark}</div>`;
}

export function renderHeader({
  items = DEFAULT_HEADER_ITEMS,
  ctaText = 'Dzwonię',
  ctaHref = 'tel:+48000000000',
  logo = '',
  logoAlt = '',
  homeHref = '/',
  homeAriaLabel = 'Firma Przykładowa — strona główna',
  badge = '',
  badgeAlt = 'Certyfikat jakości',
  navAriaLabel = 'Menu główne',
  megaToggleAriaLabel = 'Pokaż menu oferty',
  burgerAriaLabel = 'Menu',
  mega = {},
  mobileMenu = {},
  id = 'ds-header',
  tag = 'header',
  open = false,
  scrolled = false,
} = {}) {
  const tagName = HEADER_TAGS.includes(tag) ? tag : 'header';
  const megaId = `${id}-mega`;
  const menuId = `${id}-menu`;
  const megaIndex = items.findIndex((item) => item.mega);
  const menu = items
    .map((item, index) => {
      const toggle = index === megaIndex
        ? `<button type="button" class="ds-header__toggle" aria-expanded="${open ? 'true' : 'false'}" aria-controls="${escapeHtml(megaId)}" aria-label="${escapeHtml(megaToggleAriaLabel)}" data-ds-mega-toggle>${renderIcon({ name: 'chevron-right' })}</button>`
        : '';
      const panel = index === megaIndex ? renderMegaMenu({ ...mega, id: megaId, open }) : '';
      return `<li class="ds-header__item">${renderNavLink({ text: item.text, href: item.href, current: item.current })}${toggle}${panel}</li>`;
    })
    .join('');
  const bar = [
    renderBrand({ logo, logoAlt, homeHref, homeAriaLabel, badge, badgeAlt }),
    `<nav class="ds-header__nav" aria-label="${escapeHtml(navAriaLabel)}"><ul class="ds-header__menu" role="list">${menu}</ul></nav>`,
    `<div class="ds-header__actions">${renderNavCta({ text: ctaText, href: ctaHref })}${renderNavBurger({ ariaLabel: burgerAriaLabel, controls: menuId })}</div>`,
  ].join('');
  const panels = renderMobileMenu({ ...mobileMenu, id: menuId });
  const classes = scrolled ? 'ds-header is-scrolled' : 'ds-header';
  return `<${tagName} class="${classes}" data-ds-header><div class="ds-header__bar">${bar}</div>${panels}</${tagName}>`;
}
