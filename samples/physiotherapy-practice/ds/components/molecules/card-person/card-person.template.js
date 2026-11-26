import { escapeHtml } from '../../_shared/escape.js';
import { renderText } from '../../atoms/text/text.template.js';
import { CARD_HEADING_TAGS } from '../../_shared/heading-tags.js';

export function renderCardPerson({
  name = 'Anna Kowalska',
  roles = ['Executive coaching  |  Coaching menedżerski', 'Warsztaty zespołowe  |  Konsulting'],
  image = './placeholders/portrait.svg',
  imageAlt = '',
  href = '#',
  headingTag = 'h3',
} = {}) {
  const tag = CARD_HEADING_TAGS.includes(headingTag) ? headingTag : 'h3';
  const photo = image ? `<span class="ds-card-person__photo"><img src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy"></span>` : '';
  const roleLines = [].concat(roles).filter(Boolean).map((line) => escapeHtml(line)).join('<br>');
  const body = `<div class="ds-card-person__body">${renderText({ text: name, variant: '2xl', tag, className: 'ds-card-person__name' })}${roleLines ? `<p class="ds-card-person__roles">${roleLines}</p>` : ''}</div>`;
  if (href) return `<a class="ds-card-person" href="${escapeHtml(href)}">${photo}${body}</a>`;
  return `<article class="ds-card-person">${photo}${body}</article>`;
}
