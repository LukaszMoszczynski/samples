import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBrandCss } from '../scripts/check-brand.mjs';

const ALLOWED = new Set(['--palette-primary-600', '--font-heading']);

test('accepts known primitives', () => {
  assert.deepEqual(checkBrandCss(':root {\n  --palette-primary-600: #2f55d4;\n  --font-heading: "Inter", sans-serif;\n}\n', ALLOWED), []);
});

test('rejects an unknown name', () => {
  const problems = checkBrandCss(':root { --brand-new: red; }', ALLOWED);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /--brand-new/);
});

test('rejects a semantic token', () => {
  assert.match(checkBrandCss(':root { --color-text: #000; }', ALLOWED)[0], /--color-text/);
});

test('rejects a selector other than :root', () => {
  assert.match(checkBrandCss('.ds-hero { --palette-primary-600: #000; }', ALLOWED).join('\n'), /selector/);
});

test('ignores comments', () => {
  assert.deepEqual(checkBrandCss('/* --nope: 1 */\n:root { --font-heading: serif; }', ALLOWED), []);
});

test('rejects at-rules such as @import', () => {
  assert.match(checkBrandCss('@import url("x.css");\n:root { --font-heading: serif; }', ALLOWED).join('\n'), /@import/);
});
