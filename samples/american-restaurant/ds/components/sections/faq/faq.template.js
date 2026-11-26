import { ACCORDION_VARIANTS, DEFAULT_FAQ, renderAccordion } from '../../molecules/accordion/accordion.template.js';
import { renderHeadingGroup } from '../../molecules/heading-group/heading-group.template.js';

export const FAQ_VARIANTS = ACCORDION_VARIANTS;
export const FAQ_HEADING_TAGS = ['h2', 'h3'];

export function renderFaq({
  overline = 'FAQ',
  title = 'Najczęstsze pytania',
  lead = 'Nie znalazłeś odpowiedzi? Napisz do nas, odpowiadamy w ciągu jednego dnia roboczego.',
  items = DEFAULT_FAQ,
  variant = 'two-columns',
  single = false,
  headingTag = 'h2',
} = {}) {
  const variantName = FAQ_VARIANTS.includes(variant) ? variant : 'two-columns';
  const tag = FAQ_HEADING_TAGS.includes(headingTag) ? headingTag : 'h2';
  const heading = renderHeadingGroup({ overline, title: title || 'Najczęstsze pytania', lead, leadStrong: '', headingTag: tag });
  return `<section class="ds-faq ds-faq--${variantName}"><div class="ds-faq__container"><div class="ds-faq__head" data-ds-reveal>${heading}</div>${renderAccordion({ items, variant: variantName, single })}</div></section>`;
}
