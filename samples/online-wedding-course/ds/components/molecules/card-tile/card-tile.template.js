import { escapeHtml } from '../../_shared/escape.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';

export function renderCardTile({
  title = 'Akredytacja Insights Discovery',
  subtitle = 'Certyfikacja · 3 dni',
  text = 'Uprawnienia do pracy z profilem Insights Discovery w zespołach i w coachingu indywidualnym.',
  href = '#',
  headingTag = 'h3',
} = {}) {
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const body = [
    `<div class="ds-card-tile__title-box">${renderText({ text: title, variant: '2xl', tag, className: 'ds-card-tile__title' })}</div>`,
    `<div class="ds-card-tile__texts">${subtitle ? renderText({ text: subtitle, variant: 'body', className: 'ds-card-tile__subtitle' }) : ''}${text ? renderText({ text, variant: 'body', className: 'ds-card-tile__text' }) : ''}</div>`,
  ].join('');
  if (href) return `<a class="ds-card-tile" href="${escapeHtml(href)}">${body}</a>`;
  return `<article class="ds-card-tile">${body}</article>`;
}
