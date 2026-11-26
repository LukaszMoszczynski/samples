# Sample: physiotherapy practice

**Brief, in general terms:** a website for a small physiotherapy practice (two or three physiotherapists): manual
therapy, rehabilitation after injuries and surgery, back pain, sports and urogynaecological physiotherapy, therapeutic
massage, kinesiotaping and home visits. The site should calm people who are in pain, make booking obvious, help them
find the right treatment by showing where it hurts, and explain the first visit, the team and the prices.

**Stack:** Astro, no CMS assumed; bookings are not paid online, so in production the booking demo becomes a booking tool
(or a small custom backend) connected to the practice's calendar.

## Visual direction: "calm movement"
Soft sage and warm off-white surfaces, deep slate text, a coral accent for actions, and flowing single-line drawings of
the body in motion. Headings in Outfit, text in Figtree, generous radii and pill buttons.

Motion (GSAP + ScrollTrigger, `scripts/physio.js`): in the hero a stretching figure draws itself in one continuous line
over a slowly breathing sage disc; sections rise in; the body map pulses softly on the chosen area and its answer fades in
place; the first-visit wave draws once and the steps follow; the exercise figures move gently between their two poses
while on screen; a breathing ring grows for 4 s and shrinks for 6 s; the contact map draws the route and drops the pin;
cards lift on hover, buttons get a shine, FAQ answers slide open. Everything is off with "reduce motion", and the page is
complete without JS (every body-map answer shows, the form is a plain form).

## Design system parts
- Tokens only: `ds/tokens/shared.css` (spacing, type scale, semantic colours) and the reset in `ds/components/base`.
- Forms kit (`scripts/forms.js`, `components/base/forms/`): animated dropdowns, the calendar (future days only) and the
  validation demo.

## New in this sample (all built from tokens, class prefix `ds-`)
- Base: Page (`components/base/page/`): smooth anchor scrolling, sticky-header offset, container, section rhythm, sage
  band, section heading, notes.
- Atoms: Pill button (solid / ghost / soft, with shine), Eyebrow (label with a wave), Brand mark (placeholder logo).
- Molecules: Service card (duration and price), Portrait (drawn, abstract), Therapist card, Exercise card (line figure
  with two poses), Review card (marked as an example).
- Organisms: Site header (sticky, frosted on scroll, full-screen phone drawer), Site footer.
- Sections: Calm hero, Body map ("gdzie boli?", buttons + drawing + answer panels), Services, First visit, Team, Booking
  demo (service, therapist, day, free hours, contact, live summary), Exercise tips (breathing ring + three exercises),
  Price list (with the NFZ note), Reviews, FAQ, Contact and hours (today's hours marked, drawn map).

## Client look
`brand.css`: sage primary (`#466b55` for text and fills, `#a3bfa9` for lines, `#e9f0ea` for bands), slate secondary
(`#26323d` text), coral accent (`#bf4b35` for buttons under white text, `#f39a82` for decoration), warm off-white page
(`#f8f5ef`); larger radii. Colours adjusted for contrast: the coral is a deeper shade for white button text.

## Placeholders to replace
- Brand name "Twoja Fizjoterapia" and the logo (a placeholder mark).
- Therapists (first names only), their focus areas and the drawn portraits (photos when the practice sends them).
- All prices, durations, packages, opening hours, address, phone and e-mail.
- NFZ: whether the practice has NFZ visits and on what terms (marked "do uzupełnienia" in the price list and FAQ).
- Reviews: example reviews, marked on the page; real ones (e.g. from Google) in production.
- Free hours in the booking demo are made up from the date; in production they come from the booking tool.
- Health copy and the exercises should be checked by the practice; the page says tips do not replace a consultation.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild the new components as Figma components bound to variables, then add them to the design system
   (template, CSS, PHP version, story).
