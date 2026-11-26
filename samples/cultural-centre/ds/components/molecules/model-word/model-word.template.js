import { renderLetterCircle } from '../../atoms/number/number.template.js';

export function renderModelWord({ word = 'EVOLUTION', active = -1 } = {}) {
  const letters = Array.from(String(word)).map((letter, index) => renderLetterCircle({ text: letter, variant: 'word', active: index === Number(active) }));
  return `<p class="ds-model-word" aria-hidden="true">${letters.join('')}</p>`;
}
