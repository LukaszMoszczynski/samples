// Astro integration: every samples/<slug>/sample.json with "stack": "astro" becomes routes under /<slug>/.
// Other stacks (WordPress, Payload) live in the same folder but are built elsewhere, so they are skipped here.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function listAstroSamples(samplesDir) {
  if (!existsSync(samplesDir)) return [];
  return readdirSync(samplesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const dir = join(samplesDir, entry.name);
      const file = join(dir, 'sample.json');
      if (!existsSync(file)) return [];
      try {
        const sample = JSON.parse(readFileSync(file, 'utf8'));
        if (sample.stack !== 'astro') return [];
        if (sample.slug !== entry.name || !Array.isArray(sample.pages)) {
          console.warn(`samples: skipped ${entry.name} (sample.json needs "slug": "${entry.name}" and a "pages" list)`);
          return [];
        }
        return [{ slug: sample.slug, dir, pages: sample.pages }];
      } catch {
        console.warn(`samples: skipped ${entry.name} (sample.json is not valid JSON)`);
        return [];
      }
    })
    .sort((first, second) => first.slug.localeCompare(second.slug));
}

export function routesFor(sample) {
  return sample.pages.map((page) => ({
    pattern: page === 'index' ? `/${sample.slug}/` : `/${sample.slug}/${page}/`,
    entrypoint: resolve(sample.dir, 'pages', `${page}.astro`),
  }));
}

export default function samplesIntegration({ samplesDir = resolve('samples') } = {}) {
  return {
    name: 'samples',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        for (const sample of listAstroSamples(samplesDir)) for (const route of routesFor(sample)) injectRoute(route);
      },
    },
  };
}
