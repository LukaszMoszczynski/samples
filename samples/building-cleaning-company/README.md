# Sample: building cleaning and maintenance company

**Brief, in general terms:** a website for a company that cleans and maintains residential buildings for housing
cooperatives and homeowner associations (stairwells and common areas, windows and facades, green areas, snow
clearing, bin shelters, small repairs, disinfection). The audience is property managers and association boards (B2B),
so the site sells reliability: a fixed schedule, reports after every visit, liability insurance, a steady crew, a
reaction time on call-outs and flat-rate contracts.

**Stack:** Astro (no CMS assumed). In production the client panel with real reports would be a custom backend (login,
crew app sending checklists and photos); here it is a front-end demo on example data.

## Visual direction: "Blueprint"
Fresh and orderly: cobalt blue and clean white with a lime-green accent for "done and clean" (ticks, lit windows,
actions), thin blueprint grids, architectural line drawings of blocks of flats, a tidy card grid. Headings Archivo,
text Public Sans, labels DM Mono.

## Motion (GSAP + ScrollTrigger, `scripts/osiedle.js`)
- Hero: copy rises in; two blocks of flats draw line by line (dimension lines too); a lime squeegee blade wipes the
  grey haze off from left to right and the windows light up clean one by one as it passes; status chips arrive.
- Figures count up (buildings, staircases, years, reaction hours).
- Process: the dimension line draws once on enter, numbered nodes pop in step, cards rise.
- Estimator: the range tweens to the new amounts, the breakdown refreshes.
- Report demo: ticks draw one after another, the progress bar fills, the task counter climbs; tabs switch the
  staircase in place (fade and rise) and replay the ticks.
- Season calendar: tabs switch the season in place, the season icon redraws.
- Coverage map: river, roads and rings draw, building pins and the base pop; hovering a zone lights its ring.
- Hovers: squeegee shine on buttons, card lift with a shine pass and the icon redrawing in lime, link underlines
  drawing, FAQ answers sliding.
- Phone menu: full-screen overlay wiping down under the header, links rising in, burger to cross, scroll locked.
All motion is off with "reduce motion"; content is complete without JS (tabs then show every panel).

## Design system parts
- Tokens only: `ds/tokens/shared.css` (spacing, type scale, semantic colours) and the reset in `ds/components/base`.
- Forms kit from the starter (`scripts/forms.js`, `components/base/forms/forms.css`): animated dropdowns, date picker,
  validation demo.

## New in this sample (all built from tokens, class prefix `ds-`)
- Base: Page (container, section rhythm, blueprint grid and navy section backgrounds, first-paint motion states).
- Atoms: Button (lime / cobalt / ghost / outline, squeegee shine), Eyebrow (ticked label).
- Molecules: Logo (mark + wordmark), Service card, Reference card.
- Organisms: Site header (sticky, phone overlay), Site footer.
- Sections: Blueprint hero, Stats band, Services, Process ruler, Estimator (demo, `scripts/estimate.js`), Report demo
  (manager's panel), Season calendar, Coverage map, References, FAQ list, Contact form.

## Client look
`brand.css`: cobalt primary (`#1d4ed8`), navy ink secondary (`#101d42`), lime accent (`#c5f04a` for fills and text on
dark; `#3d6b0f` for accent text on white), cool neutrals, slightly rounder radii; fonts Archivo, Public Sans, DM Mono.

## Placeholders to replace
- Brand name "Twoje Osiedle" and the logo are generic placeholders.
- Phone, e-mail, address, figures (140 buildings, 620 staircases, 12 years, 4 h), OC amount, zones and district names.
- Estimator rates in `scripts/estimate.js` are illustrative, not a price list.
- References are marked as examples; reports, crews and addresses are example data.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild the new components as Figma components bound to variables, then add them to the design system
   (template, CSS, PHP version, story).
