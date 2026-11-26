import { escapeHtml } from '../../_shared/escape.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';

export const CARD_PARTNER_VARIANTS = ['grid', 'carousel'];

export function renderCardPartner({
  title = 'Lokalna organizacja biznesowa',
  subtitle = 'Aktywni przedsiębiorcy w regionie',
  text = 'Działamy razem z lokalnymi firmami i wspieramy biznes w regionie.',
  logo = './placeholders/wide.svg',
  logoAlt = 'Logo partnera',
  variant = 'grid',
  headingTag = 'h3',
} = {}) {
  const variantName = CARD_PARTNER_VARIANTS.includes(variant) ? variant : 'grid';
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const parts = [
    logo ? `<img class="ds-card-partner__logo" src="${escapeHtml(logo)}" alt="${escapeHtml(logoAlt)}" loading="lazy">` : '',
    subtitle ? renderText({ text: subtitle, variant: 'body', className: 'ds-card-partner__subtitle' }) : '',
    renderText({ text: title, variant: variantName === 'carousel' ? 'xl' : '2xl', tag, className: 'ds-card-partner__title' }),
    text ? renderText({ text, variant: 'body', className: 'ds-card-partner__text' }) : '',
  ];
  return `<article class="ds-card-partner ds-card-partner--${variantName}">${parts.join('')}</article>`;
}
