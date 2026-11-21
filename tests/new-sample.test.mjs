import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { newSample, validateSlug } from '../scripts/new-sample.mjs';
import { FAKE_BANNED } from './fixtures/fake-banned.mjs';

const REPO = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

function fakeRoot() {
  const root = mkdtempSync(join(tmpdir(), 'repo-'));
  cpSync(join(REPO, 'starters'), join(root, 'starters'), { recursive: true });
  mkdirSync(join(root, 'samples'));
  return root;
}

const fakeCopy = ({ dest }) => {
  mkdirSync(dest, { recursive: true });
  return { commit: 'abc', files: 0 };
};

test('rejects a bad slug', () => {
  for (const slug of ['Law_Firm', 'a--b', 'x'.repeat(41), '-a', '']) assert.throws(() => validateSlug(slug), /slug/);
});

test('rejects a banned slug', () => {
  assert.throws(() => validateSlug('acmecorp-shop', FAKE_BANNED), /banned/);
});

test('refuses an existing folder', () => {
  const root = fakeRoot();
  newSample({ slug: 'law-firm', lang: 'pl', title: 'Kancelaria', root, copy: fakeCopy });
  assert.throws(() => newSample({ slug: 'law-firm', lang: 'pl', title: 'Kancelaria', root, copy: fakeCopy }), /exists/);
});

test('refuses stack wp', () => {
  assert.throws(() => newSample({ slug: 'shop', stack: 'wp', lang: 'pl', title: 'Shop', root: fakeRoot(), copy: fakeCopy }), /only astro/);
});

test('creates the sample with ds and sample.json', () => {
  const root = fakeRoot();
  const dir = newSample({ slug: 'law-firm', lang: 'pl', title: 'Kancelaria', root, copy: fakeCopy });
  assert.ok(existsSync(join(dir, 'ds')));
  assert.ok(existsSync(join(dir, 'brand.css')));
  assert.ok(existsSync(join(dir, 'pages/index.astro')));
  assert.deepEqual(JSON.parse(readFileSync(join(dir, 'sample.json'), 'utf8')),
    { slug: 'law-firm', stack: 'astro', lang: 'pl', title: 'Kancelaria', pages: ['index'] });
});
