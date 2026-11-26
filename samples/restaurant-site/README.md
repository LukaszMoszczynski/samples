# Sample: restaurant and bistro

**Brief, in general terms:** a website for a city restaurant and bistro with a seasonal menu, a weekday lunch offer and
private events. The site must make people hungry, show the menu by course with prices, allergens and vegetarian marks,
show the lunch of the day, take table reservations, collect event and catering enquiries, and show a gallery, opening
hours, the way there and guest reviews.

**Stack:** Astro, no CMS (the owner changes the menu a few times a year; reservations are not paid online). If the
owner wants to edit the menu or lunch every day, a CMS (Payload + Astro) comes in.

## Visual direction: "bistro paper"
Cream paper with a faint dot grain, charcoal ink, tomato red for actions and prices, basil green for vegetarian marks; a
soft serif (Fraunces) for headings and italic accents, DM Sans for text; hand-drawn line illustrations of dishes
instead of photos. Motion (GSAP, `scripts/restaurant.js`): the hero plate draws itself, its sauce and basil fill in and
steam keeps rising over it; a round stamp turns slowly; the lunch-of-the-day note drops in; figures and the lunch price
count up; menu dishes fade and rise in place when filtered; the kitchen drawing (bread, tomatoes, herbs on a board)
draws line by line once it comes into view, and every other drawing draws on entering; on the map the streets draw and
the pin drops; cards and notes lift on hover, the gallery drawings grow, button fills wipe in. All of it is off with
"reduce motion", and the content is complete without JS (the whole menu is listed, the filter bar appears with JS).

## Design system parts
- Tokens only: `ds/tokens/shared.css` (spacing, type scale, semantic colours) and the reset in `ds/components/base`.
- Forms kit (`scripts/forms.js`, `components/base/forms/`): animated dropdowns, the calendar (dates from today on),
  the validation demo.

## New in this sample (all built from tokens, class prefix `ds-`)
- Base: Page (`components/base/page/`): paper background, container, section rhythm, section heading, motion start
  states.
- Atoms: Bistro button (tomato / ink / cream), Eyebrow (italic label with a squiggle), Diet mark (V, VG, BG, hot).
- Molecules: Dish drawing (10 line drawings with fills and steam, drawn with `pathLength="1000"`), Logo, Menu item
  (dotted leader to the price, marks, allergens), Field (label + input / select / date / textarea), Event card.
- Organisms: Site header (sticky, frosted on scroll, drawn underline on hover, full-screen phone menu), Site footer
  (closing invitation, columns, legal bar).
- Sections: Hero (drawn plate with steam, stamp, lunch note, "open now" line), Facts band (count-up), Menu board (course
  tabs + vegetarian switch, legend of marks and the 14 allergens), Lunch board (week on a chalkboard, today marked,
  price counter), Kitchen story (drawing on scroll, produce, seasons), Reservation (ticket-style form, demo thank-you
  with the booking summary), Events (three offers + enquiry form), Gallery (mosaic of drawn tiles), Reviews (three
  example notes, marked as examples), Visit (hours with today marked, address, directions, drawn map).

## Client look
`brand.css`: tomato primary (`#b3361e` for fills and text on cream, `#ee7a5c` on charcoal), charcoal secondary
(`#26221f`), basil accent (`#2e6a3b` marks, `#a6c98f` on dark), warm cream neutrals (`#f7efe2` page, `#fffcf6` cards);
headings Fraunces, text DM Sans; softer radii. Colours adjusted for contrast: none needed (axe clean at 400 and
1440 px).

## Placeholders to replace
- Name and logo: "Twoja Restauracja" and the round plate-and-steam mark are placeholders (`assets/logo*.svg`,
  `assets/favicon.svg`).
- All dishes, prices, allergens, the lunch week, hours, address, phone, e-mail and event prices are example content.
- Gallery tiles: drawings stand in for the restaurant's photos.
- Reviews are written for the sample and marked "Przykład" on the page.
- Map: a drawn placeholder; the real site gets a map that loads only after a click.
- Forms send nothing: the reservation and enquiry show a demo thank-you.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild each "new" component as a Figma component bound to variables, then add it to the design system
   (template, CSS, PHP version, story).
