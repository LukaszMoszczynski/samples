// Makes the link-preview image (1200x630, og.jpg) for one sample, for several, or for the index:
// the brand's colours and fonts, its light logo, the hero headline and summary, and a framed screenshot of the hero.
// Usage: node scripts/make-og.mjs <slug> [<slug> ...] | --all   (add --no-build to reuse dist/)
// Writes samples/<slug>/assets/og.jpg (index: src/assets/og.jpg); the layouts pick it up on the next build.
import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const PORT = 4397;
const BASE = '/samples/';
const args = process.argv.slice(2);
const build = !args.includes('--no-build');
const all = args.includes('--all');
const targets = all
  ? [...readdirSync('samples').filter((slug) => existsSync(join('samples', slug, 'sample.json'))), 'index']
  : args.filter((arg) => !arg.startsWith('--'));
if (!targets.length) {
  console.error('usage: node scripts/make-og.mjs <slug> [...] | --all [--no-build]');
  process.exit(1);
}

const escapeHtml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function card({ fonts, colours, heading, body, logo, brandName, title, summary, label, shot }) {
  return `<!doctype html><html><head><meta charset="utf-8">${fonts ? `<link rel="stylesheet" href="${fonts}">` : ''}
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: ${body}; }
  .og { position: relative; width: 1200px; height: 630px; overflow: hidden; color: ${colours.light};
    background: radial-gradient(circle at 88% 8%, ${colours.primary}99, transparent 46%), radial-gradient(circle at 6% 104%, ${colours.accent}33, transparent 40%), ${colours.dark}; }
  .copy { position: absolute; left: 72px; top: 64px; bottom: 60px; width: 560px; display: flex; flex-direction: column; }
  .logo { height: 46px; display: flex; align-items: center; }
  .logo img { height: 46px; width: auto; max-width: 330px; }
  .logo span { font-family: ${heading}; font-size: 30px; font-weight: 600; }
  h1 { margin-top: auto; font-family: ${heading}; font-size: 58px; line-height: 1.06; font-weight: 600; letter-spacing: -0.01em;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  p { margin-top: 22px; font-size: 22px; line-height: 1.45; opacity: 0.84;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .foot { margin-top: 30px; display: flex; align-items: center; gap: 16px; font-size: 17px; opacity: 0.95; }
  .pill { padding: 8px 16px; border-radius: 999px; background: ${colours.accent}; color: ${colours.dark}; font-weight: 700; }
  .frame { position: absolute; left: 676px; top: 74px; width: 660px; border-radius: 18px; overflow: hidden; transform: rotate(-4deg);
    background: #fff; box-shadow: 0 40px 80px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.12); }
  .bar { height: 30px; display: flex; gap: 7px; align-items: center; padding-left: 14px; background: #eceae7; }
  .bar i { width: 11px; height: 11px; border-radius: 50%; background: #c9c4be; }
  .frame img { display: block; width: 100%; }
</style></head><body><div class="og">
  <div class="copy">
    <div class="logo">${logo ? `<img src="${logo}" alt="">` : `<span>${escapeHtml(brandName)}</span>`}</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(summary)}</p>
    <div class="foot"><span class="pill">${escapeHtml(label)}</span><span>lukaszmoszczynski.github.io/samples</span></div>
  </div>
  <div class="frame"><div class="bar"><i></i><i></i><i></i></div><img src="${shot}" alt=""></div>
</div></body></html>`;
}

async function waitFor(url) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch(url)).ok) return; } catch { /* not up yet */ }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(`preview did not start: ${url}`);
}

if (build) execSync('node node_modules/astro/bin/astro.mjs build', { stdio: 'ignore' });
const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
try {
  await waitFor(`http://localhost:${PORT}${BASE}`);
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  for (const target of targets) {
    const isIndex = target === 'index';
    const sample = isIndex ? null : JSON.parse(readFileSync(join('samples', target, 'sample.json'), 'utf8'));
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(`http://localhost:${PORT}${BASE}${isIndex ? '' : `${target}/`}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const shot = `data:image/jpeg;base64,${(await page.screenshot({ type: 'jpeg', quality: 82 })).toString('base64')}`;
    const read = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const value = (name) => style.getPropertyValue(name).trim();
      const h1 = document.querySelector('h1');
      return {
        fonts: document.querySelector('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]')?.href ?? '',
        heading: value('--font-heading') || 'system-ui, sans-serif',
        body: value('--font-body') || 'system-ui, sans-serif',
        colours: { dark: value('--palette-secondary-800') || '#161a22', primary: value('--palette-primary-600') || '#2448b5', accent: value('--palette-accent-400') || '#e6b874', light: value('--palette-neutral-0') || '#ffffff' },
        title: (h1?.innerText ?? document.title).replace(/\s+/g, ' ').trim(),
        description: document.querySelector('meta[name="description"]')?.content ?? '',
      };
    });
    await page.close();
    const logoFile = isIndex ? null : join('samples', target, 'assets', 'logo-light.svg');
    const logo = logoFile && existsSync(logoFile) ? `data:image/svg+xml;base64,${readFileSync(logoFile).toString('base64')}` : '';
    const html = card({
      ...read,
      logo,
      brandName: isIndex ? 'Łukasz Moszczyński' : sample.title.split(' – ')[0],
      title: isIndex ? 'Przykładowe strony' : read.title,
      summary: isIndex ? read.description : sample.summary ?? read.description,
      label: isIndex ? 'Strony pod konkretne briefy' : 'Przykładowa strona',
      shot,
    });
    if (isIndex) Object.assign(read.colours, { dark: '#161a22', primary: '#d92558', accent: '#e6b874' });
    const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await ogPage.setContent(isIndex ? card({ ...read, logo: '', brandName: 'Łukasz Moszczyński', title: 'Przykładowe strony', summary: read.description, label: 'Strony pod konkretne briefy', shot }) : html, { waitUntil: 'networkidle' });
    await ogPage.evaluate(() => document.fonts.ready);
    const png = await ogPage.screenshot({ type: 'png' });
    await ogPage.close();
    const out = isIndex ? join('src', 'assets', 'og.jpg') : join('samples', target, 'assets', 'og.jpg');
    await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
    console.log(`✓ ${out}`);
  }
  await browser.close();
} finally {
  server.kill();
}
