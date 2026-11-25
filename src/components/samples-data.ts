// Every Astro sample for the index and the samples menu: name, summary, direction, tags, its three brand colours
// (read from brand.css) and its link-preview image (assets/og.jpg). Newest first; a sample with "unlisted": true stays online but is left out.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface SampleMeta { slug: string; stack: string; title: string; summary?: string; direction?: string; tags?: string[]; date?: string; unlisted?: boolean }

export interface SampleCard {
  slug: string;
  name: string;
  summary: string;
  direction: string;
  tags: string[];
  date: string;
  colours: { primary: string; accent: string; page: string; dark: string };
  preview: string;
  href: string;
}

const files = import.meta.glob<SampleMeta>('../../samples/*/sample.json', { eager: true, import: 'default' });
const previews = import.meta.glob<string>('../../samples/*/assets/og.jpg', { eager: true, query: '?url', import: 'default' });

function palette(slug: string) {
  let css = '';
  try {
    css = readFileSync(join(process.cwd(), 'samples', slug, 'brand.css'), 'utf8');
  } catch { /* no brand file: fall back below */ }
  const read = (name: string, fallback: string) => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim() ?? fallback;
  return {
    primary: read('--palette-primary-600', '#d92558'),
    accent: read('--palette-accent-400', '#e6b874'),
    page: read('--palette-neutral-50', '#ffffff'),
    dark: read('--palette-secondary-800', '#161a22'),
  };
}

export const CONTACT_URL = 'https://lukaszmoszczynski.github.io/pl/#contact';
export const PORTFOLIO_URL = 'https://lukaszmoszczynski.github.io/pl/';

export function sampleCards(base: string): SampleCard[] {
  return Object.values(files)
    .filter((sample) => sample.stack === 'astro' && !sample.unlisted)
    .sort((first, second) => (second.date ?? '').localeCompare(first.date ?? ''))
    .map((sample) => ({
      slug: sample.slug,
      name: sample.title.split(' – ')[0].replace(/\s*\(przykładowa strona\)\s*$/i, ''),
      summary: sample.summary ?? '',
      direction: sample.direction ?? '',
      tags: sample.tags ?? [],
      date: sample.date ?? '',
      colours: palette(sample.slug),
      preview: previews[`../../samples/${sample.slug}/assets/og.jpg`] ?? '',
      href: `${base}${sample.slug}/`,
    }));
}
