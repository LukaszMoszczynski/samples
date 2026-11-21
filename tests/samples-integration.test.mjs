import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { listAstroSamples, routesFor } from '../integrations/samples.mjs';

function samplesDir() {
  const root = mkdtempSync(join(tmpdir(), 'samples-'));
  const add = (slug, json) => {
    mkdirSync(join(root, slug), { recursive: true });
    if (json !== undefined) writeFileSync(join(root, slug, 'sample.json'), typeof json === 'string' ? json : JSON.stringify(json));
  };
  add('landing', { slug: 'landing', stack: 'astro', lang: 'en', title: 'Landing', pages: ['index', 'contact'] });
  add('shop', { slug: 'shop', stack: 'wp', lang: 'pl', title: 'Shop', pages: ['index'] });
  add('empty');
  add('broken', '{ not json');
  return root;
}

test('lists only astro samples', () => {
  const samples = listAstroSamples(samplesDir());
  assert.deepEqual(samples.map((sample) => sample.slug), ['landing']);
});

test('maps index and named pages to routes', () => {
  const [sample] = listAstroSamples(samplesDir());
  const routes = routesFor(sample);
  assert.deepEqual(routes.map((route) => route.pattern), ['/landing/', '/landing/contact/']);
  assert.match(routes[1].entrypoint.replaceAll('\\', '/'), /landing\/pages\/contact\.astro$/);
});

test('skips a sample whose slug does not match its folder', () => {
  const root = samplesDir();
  mkdirSync(join(root, 'renamed'));
  writeFileSync(join(root, 'renamed', 'sample.json'), JSON.stringify({ slug: 'other', stack: 'astro', pages: ['index'] }));
  assert.ok(!listAstroSamples(root).some((sample) => sample.slug === 'other'));
});
