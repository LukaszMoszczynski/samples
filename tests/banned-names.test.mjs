import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findBannedNames, findInText } from '../scripts/banned-names.mjs';
import { FAKE_BANNED } from './fixtures/fake-banned.mjs';

function tree(files) {
  const root = mkdtempSync(join(tmpdir(), 'banned-'));
  for (const [path, text] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, text);
  }
  return root;
}

test('finds a banned name in a css comment', () => {
  const hits = findBannedNames(tree({ 'a.css': '/* .acmecorp-btn */\n.ds-button {}\n' }), FAKE_BANNED);
  assert.deepEqual(hits, [{ file: 'a.css', line: 1, match: 'acmecorp' }]);
});

test('is case- and accent-insensitive', () => {
  assert.equal(findInText('Strona AcmeCórp', FAKE_BANNED).length, 1);
});

test('matches two-word names across punctuation', () => {
  assert.equal(findInText('see acme-studio and acme.studio', FAKE_BANNED).length, 2);
});

test('matches a prefix with any ending', () => {
  assert.equal(findInText('Zorbośkiego and zorbo', FAKE_BANNED).length, 2);
});

test('matches names glued into longer words', () => {
  assert.equal(findInText('acmecorpButton myacmestudio xzorbo', FAKE_BANNED).length, 3);
});

test('does not match unrelated words', () => {
  assert.deepEqual(findInText('acme corporation zorb', FAKE_BANNED), []);
});

test('ignores node_modules', () => {
  assert.deepEqual(findBannedNames(tree({ 'node_modules/x.js': 'acmecorp' }), FAKE_BANNED), []);
});

test('clean tree has no hits', () => {
  assert.deepEqual(findBannedNames(tree({ 'c.js': 'const sample = 1;\n' }), FAKE_BANNED), []);
});
