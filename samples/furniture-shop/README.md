# Sample: furniture shop

**Brief, in general terms:** a furniture brand that sells online and in its own showroom: sofas, tables, chairs,
bookcases, beds and made-to-measure pieces, in solid wood and natural fabrics. The site shows the collection with
filters, a product page with variants (fabric, wood, size), delivery time, a cart and checkout, a made-to-measure
enquiry, showroom visit booking, materials and care, delivery and assembly, returns, reviews and a newsletter.

**Stack:** production = WordPress + WooCommerce (a shop, edited by the client). This sample is the Astro front end; the
shop parts (filters, quick view, cart drawer, checkout step, configurator, forms) are working demos marked as demo:
nothing is charged or sent.

Pages: `index` (home) and `produkt` (product page, sofa "Fala").

## Visual direction: "Scandinavian warmth"
Linen page, light oak and walnut, warm charcoal text, an ochre-mustard accent (warm and brown-leaning), generous
whitespace, furniture drawn as clean flat SVG on soft colour blocks (no product photos). Headings Fraunces (soft serif,
italic accents), text Figtree.

**Motion** (GSAP + ScrollTrigger, `scripts/furniture.js`, `scripts/cart.js`): the hero room's pieces (window, picture,
shelf, lamp, rug, sofa, armchair, coffee table) slide into place and the floorboards' grain draws; sections rise in;
a wood-grain band, the delivery line and the newsletter lamp draw on enter; filters fade the grid out and let matching
cards rise back in place; product cards lift on hover with a quick-view pill; "Do koszyka" sends the drawing flying
into the cart icon, the icon bumps, then the drawer slides in; quantities roll; swatches recolour the drawing smoothly
and the size picker resizes it while the price counts; the configurator redraws the bookcase and counts the estimate.
All of it is off with "reduce motion", and the content is complete without JS.

## Design system parts
- Tokens only: `ds/tokens/shared.css` and the reset in `ds/components/base`. Forms kit (`scripts/forms.js`,
  `components/base/forms/`) for dropdowns, the calendar (future dates only) and the validation demo.

## New in this sample (all built from tokens, class prefix `ds-`)
- Base: Page (container, section rhythm and colour variants, section heading, demo note, scroll lock).
- Atoms: Shop button (solid / accent / ghost / light), Eyebrow, Swatch.
- Molecules: Logo, Furniture art (10 drawings recoloured through `--art-fabric` / `--art-wood`), Product card.
- Organisms: Site header (cart button with count, phone overlay menu), Site footer, Cart drawer (items, quantities,
  free-delivery bar, checkout step, thank-you), Quick view.
- Sections: Room hero, Category grid, Product listing (filters + sort), Custom order (configurator + enquiry form),
  Materials and care, Delivery and returns, Showroom booking, Reviews, Newsletter, Product detail, Related.
- Data: `data/catalog.ts` (example catalogue, as WooCommerce would hold it), `data/site.ts` (menu, footer),
  `scripts/bookcase.js` (bookcase drawing and demo estimate, used on the server and in the browser).

## Client look
`brand.css`: walnut primary (`#7b5330`), ochre-mustard accent (`--palette-accent-400` `#d9a13b` for fills and lines,
`--palette-accent-500` `#8a5d12` for text and focus), warm charcoal secondary (`#2a2622`), linen neutrals (page
`#f8f4ee`); softer large radii; headings Fraunces, text Figtree. Colours adjusted for contrast: none needed.

## Placeholders to replace
Brand name and logo ("Twoje Meble" is a placeholder), product names, prices, delivery times, the estimate formula,
showroom address, phone, e-mail, opening hours, reviews (examples, marked on the page), legal links.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the pages into Figma with the Figma connector.
3. Rebuild the new components as Figma components bound to variables, then add them to the design system
   (template, CSS, PHP version, story).
