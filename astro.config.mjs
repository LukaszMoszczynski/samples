import { defineConfig } from 'astro/config';
import samplesIntegration from './integrations/samples.mjs';

// One build serves every Astro sample: samples/<slug>/ → https://lukaszmoszczynski.github.io/samples/<slug>/
export default defineConfig({
  site: 'https://lukaszmoszczynski.github.io',
  base: '/samples/',
  trailingSlash: 'always',
  integrations: [samplesIntegration()],
});
