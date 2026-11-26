import { escapeHtml } from '../../_shared/escape.js';
import { renderLetterCircle } from '../../atoms/number/number.template.js';

export const DEFAULT_MODEL_STEPS = [
  { letter: 'E', term: "EXPERT'S LOOK", text: 'Rzetelnie diagnozujemy sytuację. Rozmawiamy z właścicielami, HR, zarządem i określamy istotę problemu.' },
  { letter: 'V', term: 'VISION', text: 'Razem ustalamy, dokąd zmierza zespół i po czym poznamy, że jest lepiej.' },
  { letter: 'O', term: 'OPTIONS', text: 'Dobieramy formy pracy: warsztaty, coaching, mentoring albo ich połączenie.' },
];

export function renderModelStep({ letter = DEFAULT_MODEL_STEPS[0].letter, term = DEFAULT_MODEL_STEPS[0].term, text = DEFAULT_MODEL_STEPS[0].text, active = false } = {}) {
  const termMarkup = term ? `<strong>${escapeHtml(term)}</strong> ` : '';
  return `<li class="ds-model-step${active ? ' is-active' : ''}"><span class="ds-model-step__letter" aria-hidden="true">${renderLetterCircle({ text: letter, variant: 'step', active })}</span><p class="ds-model-step__text">${termMarkup}${escapeHtml(text)}</p></li>`;
}

export function renderModelSteps({ items = DEFAULT_MODEL_STEPS } = {}) {
  return `<ol class="ds-model-steps" role="list">${items.map((item) => renderModelStep(item)).join('')}</ol>`;
}
