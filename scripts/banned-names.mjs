// Guard: internal brand and project names must never appear in this public repo.
// The names are kept only as short SHA-256 hashes, so this file does not list them either. Text is split into words
// (letters and digits, lowercased, accents removed); a hit is a word or two adjacent words whose hash is listed,
// or a word whose first five letters hash to a listed prefix, or a listed name glued inside a longer word. Add a name: hashName('<name in lowercase>').
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const hashName = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);

export const DEFAULT_BANNED = {
  words: new Set(['c26a44776f63a2d0', '8df988050419784a', 'd14c71a5e3129d6d', 'e44317c7381a0086', '72deb7b4831ed7e4', '76acf9b43b06c406', 'b952d044d13af6c8']),
  prefixes: new Set(['d75d53cfcb836fe8']),
  // Hashes of the names written as one word, and the lengths to try inside longer words (xyzButton).
  glued: new Set(['30aa224728f8c34b', 'a3d714f3951b16b6', '29d39164dc59b87e']),
  lengths: [3, 5, 6, 9, 10, 12],
};
export const PREFIX_LENGTH = 5;

const SKIPPED_DIRS = new Set(['node_modules', 'dist', '.git', '.astro', 'test-results', 'screenshots']);
// Lockfiles hold only package names and random checksums, which glued-name matching would flag by chance.
const SKIPPED_FILES = new Set(['package-lock.json']);
const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|pdf|zip)$/i;

export const normalize = (word) => word.normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l').replace(/Ł/g, 'L').toLowerCase();

// A banned name inside a longer word: every substring of a listed length, checked against all the hashes.
function containsGlued(plain, banned) {
  const all = [banned.words, banned.prefixes, banned.glued ?? new Set()];
  for (const length of banned.lengths ?? []) {
    for (let start = 0; start + length <= plain.length; start += 1) {
      const hash = hashName(plain.slice(start, start + length));
      if (all.some((set) => set.has(hash))) return true;
    }
  }
  return false;
}

export function findInText(text, banned = DEFAULT_BANNED) {
  const hits = [];
  text.split('\n').forEach((lineText, index) => {
    const words = [...lineText.matchAll(/[\p{L}\p{N}]+/gu)].map((found) => found[0]);
    words.forEach((word, position) => {
      const plain = normalize(word);
      const next = words[position + 1];
      if (banned.words.has(hashName(plain))) hits.push({ line: index + 1, match: word });
      else if (plain.length >= PREFIX_LENGTH && banned.prefixes.has(hashName(plain.slice(0, PREFIX_LENGTH)))) hits.push({ line: index + 1, match: word });
      else if (containsGlued(plain, banned)) hits.push({ line: index + 1, match: word });
      if (next && banned.words.has(hashName(`${plain} ${normalize(next)}`))) hits.push({ line: index + 1, match: `${word} ${next}` });
    });
  });
  return hits;
}

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return SKIPPED_DIRS.has(entry.name) ? [] : filesUnder(join(directory, entry.name));
    return [join(directory, entry.name)];
  });
}

export function findBannedNames(rootDir, banned = DEFAULT_BANNED) {
  return filesUnder(rootDir).flatMap((path) => {
    const file = relative(rootDir, path).split(sep).join('/');
    if (BINARY.test(file) || SKIPPED_FILES.has(file.split('/').pop())) return [];
    return findInText(readFileSync(path, 'utf8'), banned).map((hit) => ({ file, ...hit }));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const hits = findBannedNames(process.argv[2] ?? '.');
  for (const { file, line, match } of hits) console.error(`${file}:${line}  ${match}`);
  process.exit(hits.length ? 1 : 0);
}
