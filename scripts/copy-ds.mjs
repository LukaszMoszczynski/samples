// Copies the design-system files a sample needs into samples/<slug>/ds/, pinned to the DS commit.
// Filtered: no stories, READMEs or docs, no comments, and the internal names replaced, because this repo is public.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_BANNED, findBannedNames } from './banned-names.mjs';

export const DEFAULT_DS_ROOT = 'E:/projekty/design-system';
const COMPONENT_PARTS = ['_shared', 'base', 'atoms', 'molecules', 'organisms', 'sections'];
const KEPT = /(\.template\.js|\.css|\.js)$/;
const DROPPED = /\.stories\.js$/;

// Values in component defaults that carry an internal name are replaced from a private file kept outside this public
// repo: a JSON array of [pattern, value] pairs (pattern = a regular expression source, applied globally).
export const DEFAULT_REPLACEMENTS_FILE = process.env.DS_REPLACEMENTS ?? 'E:/projekty/job-hunt/profile/ds-replacements.json';

export function loadReplacements(file = DEFAULT_REPLACEMENTS_FILE) {
  return JSON.parse(readFileSync(file, 'utf8')).map(([pattern, value]) => [new RegExp(pattern, 'g'), value]);
}

export function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((line) => !/^\s*\/\//.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

function copyFiltered(from, to, replacements) {
  let text = stripComments(readFileSync(from, 'utf8'));
  for (const [pattern, value] of replacements) text = text.replace(pattern, value);
  mkdirSync(dirname(to), { recursive: true });
  writeFileSync(to, text);
}

export function copyDs({ dsRoot = DEFAULT_DS_ROOT, dest: finalDest, replacements = loadReplacements(), banned = DEFAULT_BANNED }) {
  const dirty = execFileSync('git', ['-C', dsRoot, 'status', '--porcelain']).toString().trim();
  if (dirty) throw new Error(`the design system has uncommitted changes: commit them first, so ds/VERSION names what was copied
${dirty}`);
  const commit = execFileSync('git', ['-C', dsRoot, 'rev-parse', 'HEAD']).toString().trim();
  // Build in a sibling folder and move it into place only when clean, so a failed copy leaves nothing behind.
  const dest = `${finalDest}.tmp`;
  rmSync(dest, { recursive: true, force: true });
  let files = 0;
  copyFiltered(join(dsRoot, 'dist/tokens/shared.css'), join(dest, 'tokens/shared.css'), replacements);
  files += 1;
  for (const part of COMPONENT_PARTS) {
    const root = join(dsRoot, 'components', part);
    if (!existsSync(root)) continue;
    for (const path of filesUnder(root)) {
      if (!KEPT.test(path) || DROPPED.test(path)) continue;
      copyFiltered(path, join(dest, 'components', part, path.slice(root.length + 1)), replacements);
      files += 1;
    }
  }
  const placeholders = join(dsRoot, 'public/placeholders');
  if (existsSync(placeholders)) {
    for (const path of filesUnder(placeholders).filter((file) => file.endsWith('.svg'))) {
      copyFiltered(path, join(dest, 'placeholders', path.slice(placeholders.length + 1)), replacements);
      files += 1;
    }
  }
  writeFileSync(join(dest, 'VERSION'), `design-system ${commit} filtered\n`);
  const hits = findBannedNames(dest, banned);
  if (hits.length) {
    rmSync(dest, { recursive: true, force: true });
    throw new Error(`banned names left in the DS copy:\n${hits.map(({ file, line, match }) => `${file}:${line} ${match}`).join('\n')}`);
  }
  rmSync(finalDest, { recursive: true, force: true });
  renameSync(dest, finalDest);
  return { commit, files };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [dest, dsRoot] = process.argv.slice(2);
  console.log(copyDs({ dest, dsRoot }));
}
