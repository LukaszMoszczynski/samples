# Sample: <title>

**Brief, in general terms:** <type of business, who the site is for, what it must do. Never the client's name or where
the offer was posted.>

**Stack:** Astro (no CMS needed), built from the design system (`ds/VERSION` names the commit).

## Design system parts
- <section or component>: from the design system, unchanged.

## New in this sample
- Page section (`components/sections/page-section/`): the container for an organism used outside a DS section.
- <component> (`components/<level>/<name>/`): why the design system had nothing close.

## Client look
`brand.css` changes these values: <palette colours, fonts, radius>. Colours adjusted for contrast: <none / which>.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild each "new" component as a Figma component bound to variables, then add it to the design system
   (template, CSS, PHP version, story).
