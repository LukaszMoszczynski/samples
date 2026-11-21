# Sample: wedding consultations

**Brief, in general terms:** a new site for a wedding expert who runs a wedding venue (hall, restaurant, rooms) and now
offers consultations to couples who organise their wedding themselves: one 60–90 minute conversation, topic
consultations, and a premium package with coordination on the day. Wanted: a gallery, hearts as a motif, and motion
that makes the site feel special. Made as a proposal for an existing client of the owner; the page uses the client's
brand with the owner's approval. Copy is based on the client's current site, rewritten and shortened.

**Stack:** Astro (the client edits little; a CMS can come later for the gallery and FAQ).

## Visual direction: "romantic editorial"
White and blush pink; plum only for text, buttons and the featured package; champagne gold. Cormorant Garamond headlines with italic accents, Jost text. Hearts as
the motif: a gold heart that draws itself around two linking rings in the hero, heart labels, heart bullets, buttons
whose heart beats on hover, a heart that fills in the planner, a heart-burst when the booking form is sent, hearts
drifting up the hero.

## Motion (GSAP, `scripts/wedding.js`)
Hero: the headline un-blurs, the heart and rings draw, the stone and small heart pop, counters count up, hearts drift.
About: the arch frame draws and the monogram rises. Know list: lines slide in, hearts pop. Planner: the gold line
moves to the chosen moment, tasks slide in, the heart fills to the percentage. Gallery: tiles rise in; a filter fades the grid
out and the chosen moments rise back in; tiles tilt toward the cursor, zoom, and open in a lightbox (arrow keys, Escape). Each gallery drawing has its own loop
(petals, sparkles, bubbles, lanterns, string lights, a swaying couple, lit windows). Offer cards tilt toward the cursor; buttons
shine and their heart beats. Recommendations are a deck of wedding cards: drag one aside, use Previous / Next or the
arrow keys. Marquee band, FAQ answers that slide open. A reload starts at the top. All motion off with "reduce motion"; content complete without JS.

## Design system parts
- Tokens only: `ds/tokens/shared.css` and the reset in `ds/components/base`.

## New in this sample (built from tokens, class prefix `ds-`)
- Base: Page (smooth scroll, header offset, container, section heading, blush section, hidden rule).
- Atoms: Heart button (solid / outline / light), Heart label.
- Molecules: Offer card (arched), Art tile (9 animated scenes in place of photos).
- Organisms: Wedding header, Wedding footer (with newsletter).
- Sections: Wedding hero, About, Know list, Offers, Planner (interactive timeline), Gallery (filters + lightbox),
  Marquee, Stories, Wedding FAQ (with FAQPage data), Booking.
- Logo (`assets/logo.svg`, `assets/logo-light.svg`): a typeset wordmark for the proposal, not the client's own logo.

## Placeholders to replace
- Gallery drawings → the client's photos (same frames, the lightbox already works).
- The "K" monogram in the arch → a portrait of the expert.
- Recommendations → real ones (the page marks the current quotes as examples).

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild the new components as Figma components bound to variables, then add them to the design system.
