import { renderSocialList } from '../../atoms/social-button/social-button.template.js';

export const SOCIAL_ROW_VARIANTS = ['plain', 'raised'];
export const DEFAULT_SOCIAL_ITEMS = ['linkedin', 'facebook', 'instagram', 'youtube'].map((network) => ({ network, href: '#' }));

export function renderSocialRow({ items = DEFAULT_SOCIAL_ITEMS, variant = 'plain' } = {}) {
  return renderSocialList({ items, variant: SOCIAL_ROW_VARIANTS.includes(variant) ? variant : 'plain' });
}
