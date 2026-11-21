import { escapeHtml } from '../../_shared/escape.js';
import { renderButton } from '../../atoms/button/button.template.js';
import { renderFormField, renderQuantityStepper } from '../../atoms/form-field/form-field.template.js';

const NBSP = ' ';

export function formatPrice(amount) {
  const value = Math.round(Number(amount) * 100) / 100;
  const [whole, cents] = value.toFixed(Number.isInteger(value) ? 0 : 2).split('.');
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)}${cents ? `,${cents}` : ''}${NBSP}zł`;
}

export const DEFAULT_TERMS = [
  { value: '2026-03-12', text: '12–13 marca 2026 · Warszawa' },
  { value: '2026-04-16', text: '16–17 kwietnia 2026 · Warszawa' },
  { value: '2026-05-21', text: '21–22 maja 2026 · online' },
];

export const DEFAULT_FACTS = [
  { label: 'Kiedy', value: '12–13 marca 2026' },
  { label: 'Godziny', value: '9:00–16:00' },
  { label: 'Czas trwania', value: '2 dni (16 h)' },
  { label: 'Gdzie', value: 'Warszawa, ul. Przykładowa 1' },
];

export function renderBuyBox({
  gross = 1490,
  net = 1211.38,
  terms = DEFAULT_TERMS,
  term = DEFAULT_TERMS[0].value,
  termLabel = 'Termin',
  quantityLabel = 'Liczba miejsc',
  seats = 20,
  facts = DEFAULT_FACTS,
  buttonText = 'Dodaj do koszyka',
  priceModeAriaLabel = 'Pokaż cenę',
  action = '#',
  id = 'ds-buy-box',
} = {}) {
  const quantityId = `${id}-quantity-label`;
  const price = [
    '<div class="ds-buy-box__price">',
    `<p class="ds-buy-box__amount" data-ds-buy-amount>${escapeHtml(formatPrice(gross))}</p>`,
    `<p class="ds-buy-box__note" data-ds-buy-note>brutto · ${escapeHtml(formatPrice(net))} netto</p>`,
    `<div class="ds-buy-box__modes" role="group" aria-label="${escapeHtml(priceModeAriaLabel)}">`,
    '<button type="button" class="ds-buy-box__mode" data-ds-price-mode="brutto" aria-pressed="true">brutto</button>',
    '<button type="button" class="ds-buy-box__mode" data-ds-price-mode="netto" aria-pressed="false">netto</button>',
    '</div></div>',
  ].join('');
  const termField = terms.length ? renderFormField({ type: 'select', label: termLabel, name: 'termin', id: `${id}-term`, options: terms, value: term }) : '';
  const quantity = `<div class="ds-buy-box__quantity" role="group" aria-labelledby="${escapeHtml(quantityId)}"><p class="ds-buy-box__label" id="${escapeHtml(quantityId)}">${escapeHtml(quantityLabel)}</p><div class="ds-buy-box__row">${renderQuantityStepper({ value: 1, min: 1, max: seats, ariaLabel: quantityLabel })}<p class="ds-buy-box__total" data-ds-buy-total aria-live="polite">Razem: ${escapeHtml(formatPrice(gross))}</p></div></div>`;
  const factList = facts.length
    ? `<dl class="ds-buy-box__facts">${facts.map((fact) => `<div class="ds-buy-box__fact"><dt class="ds-buy-box__fact-label"><span class="ds-buy-box__fact-icon" aria-hidden="true"></span>${escapeHtml(fact.label)}</dt><dd class="ds-buy-box__fact-value">${escapeHtml(fact.value)}</dd></div>`).join('')}</dl>`
    : '';
  const submit = renderButton({ text: buttonText, variant: 'accent', type: 'submit' });
  return `<form class="ds-buy-box" id="${escapeHtml(id)}" action="${escapeHtml(action)}" method="post" data-ds-buy-box data-ds-gross="${escapeHtml(gross)}" data-ds-net="${escapeHtml(net)}">${price}${termField}${quantity}${factList}${submit}</form>`;
}
