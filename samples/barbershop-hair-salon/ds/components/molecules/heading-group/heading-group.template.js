import { escapeHtml } from '../../_shared/escape.js';
import { renderText } from '../../atoms/text/text.template.js';

export const HEADING_GROUP_VARIANTS = ['stacked', 'split', 'centered'];
export const HEADING_TAGS = ['h1', 'h2', 'h3'];

export function renderHeadingGroup({
  overline = 'Szkolenia otwarte',
  title = 'Programy, które wybierają zespoły sprzedaży',
  lead = 'Warsztaty prowadzone przez praktyków: krótkie bloki teorii, dużo ćwiczeń i',
  leadStrong = 'przykłady z Waszej branży.',
  variant = 'stacked',
  headingTag = 'h2',
} = {}) {
  const variantName = HEADING_GROUP_VARIANTS.includes(variant) ? variant : 'stacked';
  const tagName = HEADING_TAGS.includes(headingTag) ? headingTag : 'h2';
  const hashtag = String(overline).startsWith('#');
  const parts = [
    overline
      ? renderText({ text: overline, variant: 'overline', tone: 'accent', className: `ds-heading-group__overline${hashtag ? ' is-hashtag' : ''}` })
      : '',
    title ? renderText({ text: title, variant: '3xl', tag: tagName, className: 'ds-heading-group__title' }) : '',
    lead || leadStrong ? renderText({ text: lead, strong: leadStrong, variant: 'body', className: 'ds-heading-group__lead' }) : '',
  ];
  return `<header class="ds-heading-group ds-heading-group--${escapeHtml(variantName)}">${parts.join('')}</header>`;
}
