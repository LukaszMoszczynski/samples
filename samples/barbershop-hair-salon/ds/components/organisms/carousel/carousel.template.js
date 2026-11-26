import { escapeHtml } from '../../_shared/escape.js';
import { renderCarouselControls } from '../../atoms/carousel-controls/carousel-controls.template.js';
import { renderHeadingGroup } from '../../molecules/heading-group/heading-group.template.js';

export const CAROUSEL_ITEMS = [2, 3, 4];
export const CAROUSEL_NAVS = ['below', 'beside-heading', 'above-right'];
export const CAROUSEL_PAGINATIONS = ['dots', 'counter'];

export const DEFAULT_CAROUSEL_HEADING = {
  overline: 'Szkolenia otwarte',
  title: 'Programy, które wybierają zespoły sprzedaży',
  lead: 'Warsztaty prowadzone przez praktyków: krótkie bloki teorii, dużo ćwiczeń i',
  leadStrong: 'przykłady z Waszej branży.',
};

export function renderCarousel({
  slides = [],
  items = 3,
  nav = 'below',
  pagination = 'dots',
  heading = DEFAULT_CAROUSEL_HEADING,
  ariaLabel = '',
  id = '',
  centered = false,
  mobileArrows = true,
} = {}) {
  const itemCount = CAROUSEL_ITEMS.includes(Number(items)) ? Number(items) : 3;
  const navName = CAROUSEL_NAVS.includes(nav) ? nav : 'below';
  const paginationName = CAROUSEL_PAGINATIONS.includes(pagination) ? pagination : 'dots';
  const name = ariaLabel || heading?.title || 'Karuzela';
  const group = heading ? renderHeadingGroup({ variant: navName === 'above-right' ? 'split' : 'stacked', ...heading }) : '';
  const controls = `<div class="ds-carousel__nav">${renderCarouselControls({ count: slides.length, counter: paginationName === 'counter' })}</div>`;
  const head = group || navName === 'beside-heading' ? `<div class="ds-carousel__head">${group}${navName === 'beside-heading' ? controls : ''}</div>` : '';
  const list = slides.map((slide) => `<li class="ds-carousel__slide">${slide}</li>`).join('');
  const trackId = id ? ` id="${escapeHtml(id)}"` : '';
  const track = `<div class="ds-carousel__clip"><div class="ds-carousel__viewport"><ul class="ds-carousel__track" role="list"${trackId}>${list}</ul></div></div>`;
  const attributes = `data-ds-carousel data-ds-items="${itemCount}" data-ds-nav="${navName}" data-ds-pagination="${paginationName}" aria-roledescription="karuzela" aria-label="${escapeHtml(name)}"${centered ? ' data-ds-centered' : ''}${mobileArrows ? '' : ' data-ds-mobile-arrows="off"'}`;
  return `<section class="ds-carousel" ${attributes}>${head}${navName === 'above-right' ? controls : ''}${track}${navName === 'below' ? controls : ''}</section>`;
}
