# Sample: American restaurant (diner)

**Brief, in general terms:** a website for an American-style restaurant in a Polish city: burgers, smoked BBQ (ribs,
brisket, pulled pork), wings, milkshakes and a weekend pancake brunch. The site must make people hungry, show the menu
by category with prices, tell the smokehouse story, show the daily specials and happy hour, take table bookings and
takeaway orders, announce regular events (live music, game nights), and show reviews, opening hours and the way there.
No client brief was given: the brief and all copy were written for the sample.

**Stack:** Astro, no CMS (the owner changes the menu a few times a year; bookings and takeaway are paid on the spot).
If the restaurant wants to edit the menu and specials itself, a CMS (Payload + Astro) comes in; real online ordering
would need an ordering or POS integration.

## Visual direction: "Neon roadside diner"
A 1950s roadside diner at night: midnight-blue sky with star dust, a roadside sign whose cherry-red and mint neon
flickers on, chrome rims, black-and-white checkerboard floor strips, a cream menu card and a felt letter board. Retro
script (Shrikhand) for headings, Barlow for text, Barlow Condensed capitals for menu-board lettering, labels and
buttons; drawn dishes and props instead of photos.

## Motion (GSAP, `scripts/diner.js` and `scripts/order.js`)
- Hero: the copy rises in; the sign's neon tube draws itself, "Twój" and the DINER letters flicker on one by one, the
  OTWARTE/ZAMKNIĘTE box lights up (from today's hours), the bulbs around the board start to chase and the "N" buzzes
  every few seconds.
- A cherry ticker band of what is on the grill slides sideways without end (clipped, never widens the page).
- Menu: category pills; groups fade and rise in place, the plate beside the card swaps to the category's drawing with a
  spin. "Dodaj" sends a cherry dot flying to the bag in the header, whose count pops.
- Shake bar: the glass fills when it scrolls into view, cream puffs up, the cherry drops with a bounce; choosing another
  flavour drains the glass and refills it in the new colour.
- Smokehouse: the smoker draws itself and smoke curls keep rising from the chimney; the 12-hour dial fills while its
  hand spins twelve turns and the hours count up; figures count up.
- Specials: the letter-board rows slide in; today's row glows mint; the happy hour card shows a live line ("on now,
  X min left" / "today from 15:00" / "back on Monday") and a bar of the time left.
- Events: tickets tilt toward the pointer (read on the steady slot) with a chrome shine following it.
- Map: the roads draw in, centre lines appear, the pin drops with a bounce.
- Hovers: button shine sweep and lift, neon underline in the header, logo badge swing, cards straighten and lift.
- All of it is off with "reduce motion"; the content is complete without JS (the whole menu is listed; the filter pills
  and "add" buttons appear with JS).

## Design system parts
- Tokens only: `ds/tokens/shared.css` (spacing, type scale, semantic colours) and the reset in `ds/components/base`.
- Forms kit (`scripts/forms.js`, `components/base/forms/`): animated dropdowns, the calendar (dates from today on,
  booking date required), the validation demo.

## New in this sample (all built from tokens, class prefix `ds-`)
- Base: Page (`components/base/page/`): cream page, night sections with star dust, checkerboard strip, section heading,
  motion start states.
- Atoms: Diner button (cherry / mint / chrome / ghost, chrome-rim shadow, shine), Eyebrow (condensed label between
  stars).
- Molecules: Logo (burger badge), Diner art (10 drawings: burger, ribs, wings, fries, shake, pancakes, guitar, dice,
  jukebox, smoker with smoke; `pathLength="1000"`), Menu item (dotted leader to the price, tags, "add" button), Field.
- Organisms: Site header (midnight bar with chrome edge, takeaway bag with count, full-screen phone menu), Site footer.
- Sections: Neon hero (roadside sign), Ticker, Menu board (filter pills, sticky plate, menu card), Shake bar (flavour
  picker, filling glass), Takeaway (guest check with quantities and sum + pick-up form, demo), Smokehouse (smoker,
  12-hour dial, steps, figures), Specials (felt letter board + happy hour card), Booking (ticket form, demo), Events
  (tilting tickets + private party band), Reviews (guest checks, marked as examples), Visit (hours with today, address,
  directions, drawn map).

## Client look
`brand.css`: cherry-red primary (`#c1121f` for fills and text on cream, `#ff5a6a` neon on midnight), midnight-blue
secondary (`#1a2035`, `#11162a`) with chrome greys, mint accent (`#7fe0c8` neon on dark, `#0f7a68` for text and tags
on light), soda-fountain cream neutrals (`#fbf3e2` page, `#fffaf0` cards); headings Shrikhand, text Barlow, labels
Barlow Condensed (set as the mono font); rounder radii; container 1200 px. Colours adjusted for contrast: the warm grey
`neutral-400` darkened to `#736a5c` before the first check; axe clean at 400 and 1440 px.

## Placeholders to replace
- Name and logo: "Twój Diner" and the burger badge are placeholders (`assets/logo*.svg`, `assets/favicon.svg`).
- All dishes, prices, specials, happy hour, hours, address, phone, e-mail and events are example content.
- Drawings stand in for photos of the food and the place.
- Reviews are written for the sample and marked "Przykład" on the page.
- Map: a drawn placeholder; the real site gets a map that loads only after a click.
- Booking and takeaway send nothing and charge nothing: both show a demo thank-you with the summary.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild each "new" component as a Figma component bound to variables, then add it to the design system
   (template, CSS, PHP version, story).
