import { escapeHtml } from '../../_shared/escape.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { renderText } from '../../atoms/text/text.template.js';
import { renderBadgeCircular } from '../../molecules/badge-circular/badge-circular.template.js';
import { renderHeadingGroup } from '../../molecules/heading-group/heading-group.template.js';
import { renderNumberedList } from '../../molecules/numbered-list/numbered-list.template.js';

export const TEXT_IMAGE_VARIANTS = ['image-right', 'image-left', 'panorama', 'centered', 'photos'];
export const TEXT_IMAGE_HEADING_TAGS = ['h2', 'h3'];

const ABOUT = 'Pracujemy z firmami technologicznymi, produkcyjnymi i usługowymi. Łączymy doświadczenie menedżerskie z warsztatem coachingowym, dlatego nasze programy są praktyczne, osadzone w realiach biznesu i mierzone efektami.';

export const TEXT_IMAGE_COPY = {
  'image-right': { overline: 'O nas', title: 'Partnerzy w rozwoju organizacji', text: ABOUT, steps: [], actions: [{ text: 'Poznaj nasz zespół', href: '#' }] },
  'image-left': {
    overline: 'O nas',
    title: 'Partnerzy w rozwoju organizacji',
    text: '',
    steps: ['Diagnoza potrzeb i celów', 'Program szyty na miarę', 'Warsztaty i wdrożenie', 'Mierzenie efektów'],
    actions: [],
  },
  panorama: {
    overline: 'O nas',
    title: 'Towarzyszy nam silna ekipa',
    text: 'Zespół trenerów, coachów i konsultantów, którzy łączą praktykę menedżerską z warsztatem rozwojowym. Pracujemy razem od lat.',
    steps: [],
    actions: [{ text: 'Poznaj zespół', href: '#' }, { text: 'Zadzwoń', href: 'tel:+48000000000' }],
  },
  centered: {
    overline: 'Szkolenia otwarte',
    title: '#rozwijamyWarszawa',
    text: 'Dołącz do najbliższego szkolenia otwartego w Warszawie – poznaj aktualne terminy, tematy i prowadzących.',
    steps: [],
    actions: [{ text: 'Zobacz terminy', href: '#' }],
  },
  photos: {
    overline: 'Zespoły',
    title: 'Już ponad 100 zespołów pracowało z nami nad tym, jak grać do jednej bramki',
    text: 'Warsztaty zespołowe, team coaching i diagnoza ról – pracujemy z zespołami sprzedaży, produkcji i IT, które chcą lepiej współpracować.',
    steps: [],
    actions: [],
  },
};

const BUTTON_STYLES = { centered: ['accent', 'light'] };

function renderActions(variant, actions) {
  if (!actions.length) return '';
  if (variant === 'panorama') {
    return `<div class="ds-text-image__links">${actions.map((action) => renderLink({ text: action.text, href: action.href ?? '#', variant: 'arrow', uppercase: true })).join('')}</div>`;
  }
  const [first, rest] = BUTTON_STYLES[variant] ?? ['primary', 'light'];
  const uppercase = variant === 'centered';
  return `<div class="ds-text-image__buttons">${actions.map((action, index) => renderButton({ text: action.text, href: action.href ?? '', variant: index === 0 ? first : rest, uppercase })).join('')}</div>`;
}

function renderSteps(steps) {
  return steps.length ? `<div class="ds-text-image__steps">${renderNumberedList({ items: steps })}</div>` : '';
}

function renderMedia(image, imageAlt, className) {
  const photo = image ? `<img class="ds-text-image__image" src="${escapeHtml(image)}" alt="${escapeHtml(imageAlt)}" loading="lazy">` : '';
  const classes = ['ds-text-image__media', className].filter(Boolean).join(' ');
  return `<figure class="${classes}" data-ds-reveal>${photo}</figure>`;
}

export function renderTextImage({
  variant = 'image-right',
  overline,
  title,
  text,
  steps,
  actions,
  image = '',
  imageAlt = '',
  image2 = '',
  image2Alt = '',
  background = '',
  badgeText = 'Wyzwanie? Znajdziemy rozwiązanie',
  headingTag = 'h2',
} = {}) {
  const variantName = TEXT_IMAGE_VARIANTS.includes(variant) ? variant : 'image-right';
  const copy = TEXT_IMAGE_COPY[variantName];
  const tag = TEXT_IMAGE_HEADING_TAGS.includes(headingTag) ? headingTag : 'h2';
  const heading = renderHeadingGroup({
    overline: overline ?? copy.overline,
    title: title || copy.title,
    lead: '',
    leadStrong: '',
    variant: variantName === 'centered' ? 'centered' : 'stacked',
    headingTag: tag,
  });
  const bodyText = text ?? copy.text;
  const centered = variantName === 'centered';
  const prose = bodyText ? renderText({ text: bodyText, variant: centered ? 'question' : 'body', mobile: centered ? 'body' : '', className: 'ds-text-image__prose' }) : '';
  const actionMarkup = renderActions(variantName, actions ?? copy.actions);
  const classes = `ds-text-image ds-text-image--${variantName}`;

  if (variantName === 'photos') {
    const card = `<div class="ds-text-image__card">${prose}${badgeText ? renderBadgeCircular({ text: badgeText, variant: 'accent', className: 'ds-text-image__badge' }) : ''}</div>`;
    return `<section class="${classes}"><div class="ds-text-image__container"><div class="ds-text-image__head" data-ds-reveal>${heading}</div></div><div class="ds-text-image__trio">${renderMedia(image, imageAlt, 'ds-text-image__media--first')}${card}${renderMedia(image2, image2Alt, 'ds-text-image__media--last')}</div></section>`;
  }

  if (variantName === 'panorama') {
    const split = `<div class="ds-text-image__split" data-ds-reveal>${heading}<div class="ds-text-image__aside">${prose}${actionMarkup}</div></div>`;
    return `<section class="${classes}"><div class="ds-text-image__container">${split}${renderMedia(image, imageAlt, 'ds-text-image__media--wide')}</div></section>`;
  }

  const textColumn = `<div class="ds-text-image__text" data-ds-reveal>${heading}${prose}${renderSteps(steps ?? copy.steps)}${actionMarkup}</div>`;
  if (variantName === 'centered') {
    const art = background ? `<img class="ds-text-image__background" src="${escapeHtml(background)}" alt="" loading="lazy">` : '';
    return `<section class="${classes}">${art}<div class="ds-text-image__container">${textColumn}</div></section>`;
  }
  return `<section class="${classes}"><div class="ds-text-image__container ds-text-image__grid">${textColumn}${renderMedia(image, imageAlt, '')}</div></section>`;
}
