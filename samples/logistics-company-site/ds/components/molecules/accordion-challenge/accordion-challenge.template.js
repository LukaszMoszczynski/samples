import { escapeHtml } from '../../_shared/escape.js';
import { renderAccordionSummary } from '../accordion/accordion.template.js';
import { renderLink } from '../../atoms/link/link.template.js';
import { renderText } from '../../atoms/text/text.template.js';

export const DEFAULT_CHALLENGES = [
  { question: 'Ludzie się po prostu nie dogadują', answer: 'Komunikacja się rwie, decyzje grzęzną i nie wiadomo, kto właściwie za co odpowiada. Zamiast współpracy pojawiają się napięcia i ciche pretensje.', linkText: 'Zobacz program', href: '#' },
  { question: 'Szef jest przeciążony', answer: 'Wszystko spływa na jedną osobę, a zespół czeka na decyzje. Brakuje delegowania i jasnych priorytetów.', linkText: 'Zobacz program', href: '#' },
  { question: 'Sprzedaż stoi w miejscu', answer: 'Handlowcy mają wiedzę o produkcie, ale rozmowy kończą się rabatem albo odłożeniem decyzji.', linkText: 'Zobacz program', href: '#' },
];

export function renderAccordionChallenge({
  question = DEFAULT_CHALLENGES[0].question,
  answer = DEFAULT_CHALLENGES[0].answer,
  linkText = DEFAULT_CHALLENGES[0].linkText,
  href = DEFAULT_CHALLENGES[0].href,
  name = '',
  open = false,
} = {}) {
  const link = href ? renderLink({ text: linkText, href, variant: 'inverse' }) : '';
  const answerText = answer ? renderText({ text: answer, variant: 'body', className: 'ds-accordion-challenge__text' }) : '';
  const nameAttribute = name ? ` name="${escapeHtml(name)}"` : '';
  return `<details class="ds-details ds-accordion-challenge"${nameAttribute}${open ? ' open' : ''}>${renderAccordionSummary({ text: question, className: 'ds-accordion-challenge__summary' })}<div class="ds-accordion-challenge__body">${answerText}${link}</div></details>`;
}

export function renderAccordionChallengeList({ items = DEFAULT_CHALLENGES, name = 'wyzwania' } = {}) {
  return `<div class="ds-accordion-challenge-list">${items.map((item) => renderAccordionChallenge({ ...item, name })).join('')}</div>`;
}
