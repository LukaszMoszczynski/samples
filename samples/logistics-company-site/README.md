# Sample: logistics company site

**Brief, in general terms:** a modern website for a transport and logistics company, in a style that fits transport
and new technology. The client wants to run the site themselves: add sub-pages, edit text, photos, videos and links,
and change the structure without a developer. Business events are a plus.

**Stack:** for the real project, the client edits content, so a CMS (WordPress block theme, or Payload). This sample is
the front end in Astro. Every section is a component with fields, which is what the client would fill in the editor.

## Visual direction: "signal"
Dark navy surfaces with a thin grid, signal orange for actions and live data, monospace labels that read like a
tracking readout, small radii. Motion (GSAP, `scripts/logistics.js`) shows how the site behaves: the hero route draws
itself and a vehicle drives it, figures count up, the tracking panel lights its steps, the process line fills as you
scroll, coverage arcs draw out from the hub, sections rise in. All of it is off with "reduce motion", and the content is
complete without JS.

## Design system parts
- Tokens only: `ds/tokens/shared.css` (spacing, type scale, semantic colours) and the reset in `ds/components/base`.

## New in this sample (all built from tokens, class prefix `ds-`)
- Base: Page (`components/base/page/`): smooth anchor scrolling, sticky-header offset, container, section rhythm,
  section heading.
- Atoms: Signal button (solid / ghost), Mono label.
- Molecules: Service card, News card.
- Organisms: Site header (sticky, solid on scroll, phone drawer), Site footer.
- Sections: Route hero (with a tracking field), Stats band (count-up), Services, Tracking demo (client panel),
  Process line, Coverage (country list + dot map), News grid, FAQ list (native details), Quote form.
- Logo (`assets/logo.svg`, `assets/logo-light.svg`): a placeholder wordmark, "Twoja Logistyka".

## Client look
`brand.css`: navy primary, signal orange accent (`--palette-accent-500` for fills under white text,
`--palette-accent-400` for text and lines on dark), slate secondary, cool neutrals; headings Sora, text Inter,
data JetBrains Mono.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild the new components as Figma components bound to variables, then add them to the design system
   (template, CSS, PHP version, story).
