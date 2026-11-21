// Copied from the design system (scripts/glob-files.mjs): component CSS may only use tokens.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

export function globFiles(pattern) {
  const normalized = pattern.replaceAll('\\', '/').replace(/^\.\//, '');
  const parts = normalized.split('/');
  const wildcard = parts.findIndex((part) => part.includes('*'));
  if (wildcard === -1) return existsSync(normalized) ? [normalized] : [];
  const root = parts.slice(0, wildcard).join('/') || '.';
  if (!existsSync(root)) return [];
  const source = normalized
    .split('**/')
    .map((piece) => piece.replace(/[.+?^${}()|[\]]/g, '\\$&').replaceAll('*', '[^/]*'))
    .join('(?:.*/)?');
  const matcher = new RegExp(`^${source}$`);
  return filesUnder(root)
    .map((file) => file.replaceAll('\\', '/').replace(/^\.\//, ''))
    .filter((file) => matcher.test(file));
}
