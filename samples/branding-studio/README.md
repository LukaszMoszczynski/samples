# Sample: Branding and web studio for mature brands

**Brief, in general terms:** a one-person studio that makes branding, websites and copy for established companies
("only for mature brands"). The site has to show the stance and the voice (relaxed but serious, ironic, never at a
person), the four services, how the work goes, and lead to one action: start with an audit. The look comes from the
studio's own brand handoff (palette, fonts, logo, brand brief, portrait); the real name may be public.

**Stack:** Payload + Astro in the finished site if the owner edits content herself (Astro alone otherwise). This
sample is the Astro front end; the mini-audit and the contact form are demos marked as such.

## Visual direction
"Na luzie, ale na poważnie": creative classic with claws. Cream and plum as the base, rose as the spice in accents,
lemon CTAs on dark. Unbounded for headings (light weight for the relaxed lines, bold for "Marek."), Sora for text,
Source Code Pro capitals with a rose slash for labels ("/ JAK PRACUJĘ"). Circles are the motif: balls as bullets, in
the meter, on cards, a huge rose sun behind the portrait (the change of scale from the brief).

## Motion
- Hero as a film: letterbox bars open, the title arrives line by line, the portrait opens from a circle while the photo
  settles, the ring turns in, two balls roll into the frame; in the header the logo's "o" rolls in and the "!" drops.
- Cursor ribbon (from the brief): a trail of balls in rose and plum follows a mouse pointer and fades when it rests.
- Sections rise in softly; nothing bounces.
- Manifesto and makeovers: a rose line strikes through the old words, then the new claim rises in.
- Process: the track draws once and a ball rolls along it, filling each step's circle as it passes (down the left on
  phones).
- Service cards tilt a little toward the pointer, the corner ball grows; makeover cards lift and the ball rolls away.
- Mini-audit: every "Tak" rolls a ball into the meter; the verdict changes with the count.
- CTA: a ball grows from the arrow side and fills the pill. Menu: a small rose ball rolls under the link.
- Heavy layer (owner's request, 25 Nov; goes beyond the brief's "subdued", eases stay smooth, nothing bounces):
  - background orbs in every section (rose, plum, lemon) drift and breathe, move at their own depth with the scroll
    and lean away from the pointer; a dashed ring turns slowly; loops pause off screen;
  - hero depth: sun, ring, frame and balls follow the pointer at different depths, the sun breathes, the copy drifts
    up and the portrait sinks as you leave the hero;
  - the oh!design logo, large, draws itself after the hero: outlines letter by letter, the "o" rolls in as a ball,
    the "!" drops, then the letters fill (marquee bands were tried and dropped as "cheap");
  - service cards flip up in 3D, makeover cards swing in from alternate sides; magnetic CTAs (not the form buttons); a scroll progress
    line with a rolling ball under the header; the About portrait floats against its circle.
- Everything respects reduced motion; content is complete without JS.

## Design system parts
- Tokens (shared, semantic, breakpoint) and the base styles; the forms kit (dropdown, validation demo).

## New in this sample
- Label, CTA, Ball (`components/atoms/`): the mono section label, the pill CTA with the growing ball, the circle motif.
- Logo (`components/molecules/logo/`): the handoff's outlined lockup inlined so its parts can move.
- Service card (`components/molecules/service-card/`).
- Header, footer, cursor ribbon (`components/organisms/`).
- Sections: hero, manifesto, services, mini-audit, process, makeovers, about, voices, contact.

## Client look
`brand.css` takes every value 1:1 from the handoff (Brand collection, mode "ohdesign"): palette, Unbounded / Sora /
Source Code Pro, container 1240 px. Colours adjusted for contrast: none.
The brief's heading colour #571933 has no token, so headings use the nearest palette colour, secondary/800 (#57083B).
The new heading weight tokens (heading-light / medium / regular) are not in the samples' starter yet, so the page uses
the regular / medium / bold weights.

## Placeholders to replace
- Makeovers (before / after claims) and the opinions are examples written for the sample.
- Service details, timing per week and the reply time are examples.

## To Figma (after a win)
1. The brand mode already exists in the library (ohdesign).
2. Capture the page into Figma with the Figma connector.
3. Rebuild each "new" component as a Figma component bound to variables, then add it to the design system
   (template, CSS, PHP version, story).
