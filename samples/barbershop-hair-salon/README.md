# Sample: barbershop and hair salon

**Brief, in general terms:** a website for a barbershop that is also a hair salon (men's cuts, fades, beard and razor
shaves, women's cuts and colour), with a team of four. The site needs a strong hero, services with prices and times in
groups, the team, online booking in steps, a style gallery, reviews, opening hours, location and a gift voucher teaser.
The brand name on the page, "Twój Barber", is a generic placeholder.

**Stack:** Astro, no CMS (the content changes rarely); bookings are not paid online, so in production the booking steps
connect to a booking tool (e.g. Booksy) or a small custom booking backend.

## Visual direction: "Barber pole"
Classic barber, modern edge: near-black and bone white like the chair and the towel, copper for actions, brass for
lines and small details on dark, condensed uppercase display type (Big Shoulders Display) over a calm body face
(Figtree), mono labels (DM Mono). The barber-pole stripe is the motif: in the logo mark, the eyebrows, the section
dividers, the voucher edge and the map pin.

Motion (GSAP + ScrollTrigger, `scripts/barber.js`): the hero headline rises line by line while a mirror frame, scissors
and a straight razor draw themselves and the barber pole keeps turning; pole-stripe dividers slide sideways; price rows
rise with a copper rule sweeping under each one and prices counting up; drawn portraits and haircuts draw their lines,
then fill; team cards tilt toward the pointer (read on the steady parent) with a brass glare; booking steps slide and
fade in place, hour slots ripple in, the thank-you tick draws itself; the voucher swings in and catches a light sweep
on hover; the map streets draw and the pin drops in; the open-now dot breathes. All motion is off with "reduce motion",
and the content is complete without JS (the booking form is then one long form).

## Design system parts
- Tokens only: `ds/tokens/shared.css` (spacing, type scale, semantic colours) and the reset in `ds/components/base`.
- Forms kit from the starter (`scripts/forms.js`, `components/base/forms/`): the calendar for the day field
  (`data-min="today"`) and the validation demo on the contact step.

## New in this sample (all built from tokens, class prefix `ds-`)
- Base: Page (`components/base/page/`): smooth anchor scrolling, sticky-header offset, container, light and dark
  sections, section heading, hidden-before-motion rules.
- Atoms: Barber button (solid / outline, light sweep), Eyebrow (label with a pole stripe), Pole stripe (divider).
- Molecules: Portrait (drawn bust, 4 hairstyles, 4 tones), Style art (drawn profile, 6 haircuts), Team card (tilt),
  Review card (marked "Przykład").
- Organisms: Site header (sticky, full-screen phone menu), Site footer.
- Sections: Barber hero (mirror with scissors and razor, turning pole), Service menu (grouped price board), Team,
  Booking demo (5 steps + thank-you, summary ticket), Style gallery, Reviews, Voucher, Visit (hours with today and
  open-now status, drawn map).
- Logo (`assets/logo.svg`, `assets/logo-light.svg`) and tab icon (`assets/favicon.svg`, `assets/apple-touch-icon.png`):
  a placeholder pole mark and wordmark.

## Client look
`brand.css`: near-black secondary (`#191714`, `#11100e`), bone neutrals (`#f2ede4`, `#e5ded2`), copper primary
(`#8c4524` for fills under white text, `#d9926a` for lines on dark), brass accent (`#d6a75c` for text and lines on dark,
`#80561c` on light), small radii; headings Big Shoulders Display, text Figtree, labels DM Mono.
Colours adjusted for contrast: none needed (axe clean at 400 and 1440 px).

## Placeholders to replace
- Brand name, logo, address, phone, e-mail, map (drawn, not a real map), opening hours.
- Prices and times (example values), team names and portraits (drawn; real photos later), the haircut gallery (drawn;
  real before/after photos later), reviews (examples, marked on the page), voucher amount and number.
- Booking: free and taken hours are generated in the browser; nothing is sent.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild the new components as Figma components bound to variables, then add them to the design system
   (template, CSS, PHP version, story).
