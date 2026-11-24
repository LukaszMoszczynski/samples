import { renderLabel } from '../label/label.template.js';

export const BADGE_VARIANTS = { polecane: 'accent', promocja: 'inverse', akcja: 'primary' };
const DEFAULT_TEXT = { polecane: 'Polecane', promocja: 'Promocja', akcja: 'Akcja' };

export function renderBadgePill({ variant = 'polecane', text = '' } = {}) {
  const variantName = BADGE_VARIANTS[variant] ? variant : 'polecane';
  return renderLabel({ text: text || DEFAULT_TEXT[variantName], variant: BADGE_VARIANTS[variantName] });
}
