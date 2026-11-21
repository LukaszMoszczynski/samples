// Checks one sample before it can go live. Usage: node scripts/check-sample.mjs <slug>
// 1 brand.css (values only)  2 component CSS (tokens only)  3 banned names  4 build + noindex + CSS sources
// 5 axe (WCAG 2.2 AA, colour contrast included) and no sideways scroll at 400 and 1440 px, with screenshots.
// Stops at the first failing group and lists every problem in it.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findBannedNames } from './banned-names.mjs';
import { checkBrandCss, loadAllowedNames } from './check-brand.mjs';
import { checkCssValues } from './lib/check-css-values.mjs';

const WIDTHS = [400, 1440];
const PORT = 4329;
const BASE = '/samples/';

function fail(group, problems) {
  console.error(`✗ ${group}`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

function pass(group) {
  console.log(`✓ ${group}`);
}

function pagesOf(slug) {
  const sample = JSON.parse(readFileSync(join('samples', slug, 'sample.json'), 'utf8'));
  return sample.pages.map((page) => ({ page, path: page === 'index' ? `${slug}/` : `${slug}/${page}/` }));
}

export function cssSourceProblems(html) {
  const links = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map((found) => found[0].match(/href="([^"]+)"/)?.[1] ?? '');
  return links
    .filter((href) => !href.startsWith(`${BASE}_astro/`) && !href.startsWith('https://fonts.googleapis.com/'))
    .map((href) => `stylesheet from an unexpected place: ${href}`);
}

async function waitFor(url, tries = 60) {
  for (let attempt = 0; attempt < tries; attempt += 1) {
    try {
      if ((await fetch(url)).ok) return;
    } catch { /* not up yet */ }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(`preview did not start: ${url}`);
}

async function browserChecks(slug) {
  const { chromium } = await import('playwright');
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  try {
    await fetch(`http://localhost:${PORT}/`);
    throw new Error(`port ${PORT} is already in use: stop the other server first`);
  } catch (error) {
    if (error.message.startsWith('port')) throw error;
  }
  const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
  const problems = [];
  try {
    await waitFor(`http://localhost:${PORT}${BASE}${slug}/`);
    const browser = await chromium.launch();
    rmSync(join('screenshots', slug), { recursive: true, force: true });
    mkdirSync(join('screenshots', slug), { recursive: true });
    for (const { page: pageName, path } of pagesOf(slug)) {
      for (const width of WIDTHS) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        await page.goto(`http://localhost:${PORT}${BASE}${path}`, { waitUntil: 'networkidle' });
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        for (const violation of results.violations) {
          for (const node of violation.nodes) {
            const colours = violation.id === 'color-contrast'
              ? ` (${node.any[0]?.data?.fgColor} on ${node.any[0]?.data?.bgColor}, ${node.any[0]?.data?.contrastRatio}:1)` : '';
            problems.push(`${pageName} @${width}px ${violation.id}: ${node.target.join(' ')}${colours}`);
          }
        }
        const sideways = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        if (sideways) problems.push(`${pageName} @${width}px scrolls sideways`);
        await page.screenshot({ path: join('screenshots', slug, `${pageName}-${width}.png`), fullPage: true });
        await context.close();
      }
    }
    await browser.close();
  } finally {
    server.kill();
  }
  return problems;
}

export async function checkSample(slug) {
  const dir = join('samples', slug);
  if (!existsSync(join(dir, 'sample.json'))) fail('sample', [`samples/${slug}/sample.json not found`]);

  const brand = checkBrandCss(readFileSync(join(dir, 'brand.css'), 'utf8'), loadAllowedNames());
  if (brand.length) fail('brand.css', brand);
  pass('brand.css changes values only');

  const css = checkCssValues(`samples/${slug}/components/**/*.css`).map(({ file, line, value }) => `${file}:${line} ${value}`);
  if (css.length) fail('component CSS', css);
  pass('component CSS uses tokens only');

  const names = findBannedNames(resolve('.')).map(({ file, line, match }) => `${file}:${line} ${match}`);
  if (names.length) fail('banned names', names);
  pass('no banned names');

  const build = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { encoding: 'utf8' });
  if (build.status !== 0) fail('build', [build.stdout.slice(-2000), build.stderr.slice(-2000)]);
  const built = pagesOf(slug).flatMap(({ path }) => {
    const file = join('dist', path, 'index.html');
    if (!existsSync(file)) return [`${file} was not built`];
    const html = readFileSync(file, 'utf8');
    return [...(html.includes('<meta name="robots" content="noindex">') ? [] : [`${file}: no noindex`]), ...cssSourceProblems(html)];
  });
  if (built.length) fail('build output', built);
  pass('built, noindex, CSS from this build only');

  const browser = await browserChecks(slug);
  if (browser.length) fail('accessibility and layout', browser);
  pass(`axe clean and no sideways scroll at ${WIDTHS.join(' and ')} px; screenshots in screenshots/${slug}/`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  if (!slug) fail('usage', ['node scripts/check-sample.mjs <slug>']);
  await checkSample(slug);
}
