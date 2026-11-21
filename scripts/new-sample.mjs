// Starts a sample: samples/<slug>/ from the stack's starter, plus a filtered, pinned copy of the design system.
// Usage: node scripts/new-sample.mjs <slug> <pl|en> "<title>"
import { cpSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_BANNED, findInText } from './banned-names.mjs';
import { copyDs } from './copy-ds.mjs';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validateSlug(slug, banned = DEFAULT_BANNED) {
  if (typeof slug !== 'string' || slug.length > 40 || !SLUG.test(slug)) {
    throw new Error(`bad slug "${slug}": lowercase letters, digits and single hyphens, max 40 characters`);
  }
  if (findInText(slug.replaceAll('-', ' '), banned).length) throw new Error(`slug "${slug}" contains a banned name`);
  return slug;
}

export function newSample({ slug, stack = 'astro', lang, title, root = resolve('.'), copy = copyDs }) {
  validateSlug(slug);
  if (stack !== 'astro') throw new Error(`stack "${stack}": only astro in part 1 (WordPress and Payload come later)`);
  if (!['pl', 'en'].includes(lang)) throw new Error(`lang "${lang}": pl or en`);
  const dir = join(root, 'samples', slug);
  if (existsSync(dir)) throw new Error(`samples/${slug} exists already`);
  cpSync(join(root, 'starters', stack), dir, { recursive: true });
  copy({ dest: join(dir, 'ds') });
  writeFileSync(join(dir, 'sample.json'), `${JSON.stringify({ slug, stack, lang, title, pages: ['index'] }, null, 2)}\n`);
  return dir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [slug, lang, title] = process.argv.slice(2);
  console.log(newSample({ slug, lang, title: title ?? slug }));
}
