# Sample: municipal cultural centre

**Brief, in general terms (written for the sample, no client brief):** a website for a town's cultural centre, a public
institution. It runs events (concerts, a cinema club, exhibitions, theatre, workshops, shows for children), regular
classes for children, teens, adults and seniors (dance, music, art, theatre, languages, computer classes for seniors),
rents out its rooms and publishes news. The team edits the programme itself. Visitors of every age, many of them
seniors, must find "what's on" and "how do I sign up" fast; as a public body the site must meet WCAG 2.2 AA and show
the accessibility statement, BIP, easy-to-read text and sign-language information.

**Stack:** Payload + Astro (the centre edits its programme, classes, news and rooms itself, and there is no shop).
Only the Astro front end is built here: the editing side is shown as a working demo screen ("Panel redakcji (demo)"),
and ticket buying is a link-out to an external ticketing service (demo note), not a shop.

## Pages
- `index`: stage hero, this week's events, classes grouped by audience (each with its own link), the centre in
  numbers, news, rooms teaser, editor demo, newsletter, contact, hours and building access.
- `wydarzenia`: the programme (15 events, Nov–Jan) grouped by month, with filters by kind, month and free entry; tickets
  and discounts.
- `zajecia`: all 20 classes in four sections by audience (jump links, nothing hidden), free places per group, the
  enrolment form (card links preselect the class).
- `wynajem`: five rooms with capacity, equipment, use and price from; the inquiry form (room preselected, date
  required, future days only).
- `dostepnosc`: accessibility statement, building access, easy-to-read text with pictograms, sign-language (PJM) info.

## Visual direction: "riso poster wall"
A wall of risograph posters on cream paper: flat riso green and cornflower-blue inks that overprint (multiply) a little
off register, cut-paper shapes (circle, half-moon, arch, star, zigzag, film frame) as each category's sign, heavy ink
outlines and hard offset shadows in the second ink. Calm and readable for seniors: Atkinson Hyperlegible (made for
low-vision readers) for text at 18 px by default, Bricolage Grotesque for poster headings, 48 px controls.

Motion (GSAP + ScrollTrigger, `scripts/centre.js`): on the home page the stage arch draws itself, the curtain parts to
both sides, the spotlight swings in, three posters slide up and stack, cut-paper shapes pop in and then drift slowly;
the headline's underline is drawn by hand. Inner pages pin three paper sheets one after another. Sections and cards
rise in, counters count up, the footer's flag garland draws its string and swings the flags down, the map draws the walk
from the bus stop. Hovers: cards lift and tip and the second ink slips off register, buttons press into their shadow
with a shine, nav links get a strip of riso ink. Programme filters fade and rise in place; the editor's poster follows
the fields and a published event slides into the list; the phone menu wipes down. Everything is off with "reduce
motion", and the page is complete without JS (all events show, forms are plain forms, the access switches hide).

Accessibility extras: access bar on every page (accessibility statement, easy-to-read text, sign language, BIP; text
size A / A+ / A++ and high contrast, remembered in localStorage when allowed), skip link, current page marked, events
tagged with induction loop / subtitles / wheelchair places.

## Design system parts
- Tokens only: `ds/tokens/shared.css` (spacing, type scale, semantic colours) and the reset in `ds/components/base`.
- Forms kit (`scripts/forms.js`, `components/base/forms/`): animated dropdowns, the calendar (future days only) and the
  validation demo.

## New in this sample (all built from tokens, class prefix `ds-`)
- Base: Page (`components/base/page/`): colour roles (so high contrast swaps them in one place), the A+ / A++ type
  steps, container, section rhythm, tint and night bands, section heading, card grids, arrow link, skip link.
- Layout: `layouts/CentrePage.astro`, the frame every page shares (access bar, header, footer, toast, script).
- Atoms: Cut shape (two riso inks), Brand mark (placeholder logo), Ink button, Eyebrow (riso tape label).
- Molecules: Event card (poster + facts + ticket link), Class card (free places), News card (pinned notice), Room card,
  Audience tile.
- Organisms: Access bar, Site header (sticky, phone drawer), Site footer (flag garland, institution links), Demo toast.
- Sections: Stage hero, Page hero, Numbers, Editor demo, Newsletter, Visit info (hours, access, drawn map), Programme
  (filters), Enrolment form, Hire form (uses the enrolment form's sheet plus `hire-form.css`), Access statement.
- Data: `data/content.js` (events, classes, rooms, news), standing in for the Payload collections.

## Client look
`brand.css`: riso green primary (`#0b7a4b` for buttons and text, `#5fc08e` ink, `#e2f1e7` bands), ink-navy secondary
(`#1c2232`), cornflower-blue accent (`#6aa6ea` ink, `#1d5aa8` for links and the blue button), cream paper
(`#f7f2e6`), small radii. Fonts: Bricolage Grotesque and Atkinson Hyperlegible. Colours adjusted for contrast: none
needed beyond picking the dark shades for text (all pairs pass AA).

## Placeholders to replace
- Brand name "Twój Dom Kultury", the logo (placeholder mark), address, phones, e-mail, hours, bus lines.
- The whole programme, classes, teachers (first names), fees, free places, rooms and prices, news, the numbers.
- Accessibility statement: dates, the coordinator's name, the PJM video, the register number and organiser; BIP link
  points to the national BIP page until the centre's own BIP address is known.
- Ticketing: the external service and its links; the newsletter tool (double opt-in); where forms are delivered.
- In production the editor demo is Payload's admin; the poster preview becomes the live preview.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the pages into Figma with the Figma connector.
3. Rebuild the new components as Figma components bound to variables, then add them to the design system
   (template, CSS, PHP version, story).
