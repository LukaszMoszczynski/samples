import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { copyDs } from '../scripts/copy-ds.mjs';
import { FAKE_BANNED } from './fixtures/fake-banned.mjs';

const REPLACEMENTS = [[/biuro@acmecorp\.pl/g, 'biuro@example.com']];
const run = (dsRoot, out) => copyDs({ dsRoot, dest: out, replacements: REPLACEMENTS, banned: FAKE_BANNED });

const BUTTON_TEMPLATE = [
  '// ACMECORP: the brand button',
  "const url = 'https://example.com/a'; // keep me",
  "export const email = 'biuro@acmecorp.pl';",
  '/* block',
  '   comment */',
  'export function renderButton() { return `<a href="${url}">x</a>`; }',
  '',
].join('\n');

function fixtureDs(extraTemplateLine = '') {
  const root = mkdtempSync(join(tmpdir(), 'ds-'));
  const files = {
    'dist/tokens/shared.css': ':root { --space-8: 8px; }\n',
    'components/atoms/button/button.css': '/* .acmecorp-btn */\n.ds-button { color: var(--x); }\n',
    'components/atoms/button/button.template.js': BUTTON_TEMPLATE + extraTemplateLine,
    'components/atoms/button/button.stories.js': 'export default {};\n',
    'components/atoms/button/README.md': '# Button\n',
    'components/_template/_template.css': '.ds-template {}\n',
    'public/placeholders/wide.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>\n',
  };
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { stdio: 'pipe' });
  git('init', '-q');
  git('add', '-A');
  git('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-qm', 'fixture');
  return { root, commit: git('rev-parse', 'HEAD').toString().trim() };
}

const dest = () => join(mkdtempSync(join(tmpdir(), 'copy-')), 'ds');

test('drops stories, readmes and the _template folder', () => {
  const { root } = fixtureDs();
  const out = dest();
  run(root, out);
  assert.ok(existsSync(join(out, 'components/atoms/button/button.css')));
  assert.ok(!existsSync(join(out, 'components/atoms/button/button.stories.js')));
  assert.ok(!existsSync(join(out, 'components/atoms/button/README.md')));
  assert.ok(!existsSync(join(out, 'components/_template')));
  assert.ok(existsSync(join(out, 'tokens/shared.css')));
});

test('strips css and full-line js comments', () => {
  const { root } = fixtureDs();
  const out = dest();
  run(root, out);
  assert.doesNotMatch(readFileSync(join(out, 'components/atoms/button/button.css'), 'utf8'), /\/\*/);
  const js = readFileSync(join(out, 'components/atoms/button/button.template.js'), 'utf8');
  assert.doesNotMatch(js, /ACMECORP: the brand button/);
  assert.doesNotMatch(js, /block/);
});

test('keeps // inside strings', () => {
  const { root } = fixtureDs();
  const out = dest();
  run(root, out);
  assert.match(readFileSync(join(out, 'components/atoms/button/button.template.js'), 'utf8'), /'https:\/\/example\.com\/a'/);
});

test('writes VERSION with the commit', () => {
  const { root, commit } = fixtureDs();
  const out = dest();
  const result = run(root, out);
  assert.equal(result.commit, commit);
  assert.equal(readFileSync(join(out, 'VERSION'), 'utf8').trim(), `design-system ${commit} filtered`);
});

test('replaces the known email', () => {
  const { root } = fixtureDs();
  const out = dest();
  run(root, out);
  assert.match(readFileSync(join(out, 'components/atoms/button/button.template.js'), 'utf8'), /biuro@example\.com/);
});

test('throws on a leftover banned name in code', () => {
  const { root } = fixtureDs("export const brand = 'acmecorp';\n");
  assert.throws(() => run(root, dest()), /acmecorp/);
});

test('copies the placeholder images', () => {
  const { root } = fixtureDs();
  const out = dest();
  run(root, out);
  assert.ok(existsSync(join(out, 'placeholders/wide.svg')));
});

test('copies only svg placeholders', () => {
  const { root } = fixtureDs();
  writeFileSync(join(root, 'public/placeholders/photo.png'), 'binary');
  execFileSync('git', ['-C', root, 'add', '-A']);
  execFileSync('git', ['-C', root, '-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-qm', 'png']);
  const out = dest();
  run(root, out);
  assert.ok(!existsSync(join(out, 'placeholders/photo.png')));
});

test('leaves no ds folder when a banned name remains', () => {
  const { root } = fixtureDs("export const brand = 'acmecorp';\n");
  const out = dest();
  assert.throws(() => run(root, out));
  assert.ok(!existsSync(out));
});

test('refuses a design system with uncommitted changes', () => {
  const { root } = fixtureDs();
  writeFileSync(join(root, 'components/atoms/button/button.css'), '.ds-button { color: var(--y); }\n');
  assert.throws(() => run(root, dest()), /uncommitted/);
});
