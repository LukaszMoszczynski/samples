// brand.css may only give new values to the design system's primitive tokens: one :root block, known names only.
// The allowed names are the ones the starter's brand.css declares (every primitive of a DS brand).
import { readFileSync } from 'node:fs';

export function declaredNames(cssText) {
  return new Set([...cssText.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:/g)].map((found) => found[1]));
}

export function loadAllowedNames(starterBrandFile = new URL('../starters/astro/brand.css', import.meta.url)) {
  return declaredNames(readFileSync(starterBrandFile, 'utf8'));
}

export function checkBrandCss(cssText, allowedNames) {
  const problems = [];
  const css = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (selector.trim() !== ':root') problems.push(`selector "${selector.trim()}": brand.css may only use :root`);
    for (const [, name] of body.matchAll(/(--[\w-]+)\s*:/g)) {
      if (!allowedNames.has(name)) problems.push(`${name}: not a design-system primitive (change values only, never add names)`);
    }
  }
  return problems;
}
