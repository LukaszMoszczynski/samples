# Sample: Hospůdka Noir – a party photo story

**Brief, in general terms:** a one-page photo story of a night out with friends (meeting in the snow, a Czech restaurant, an Irish pub), told as a graphic novel. Unlisted:
online for whoever has the link, left out of the samples index and menu (the photos show real people).

**Stack:** Astro (no CMS needed). The design system copy (`ds/VERSION`) gives the tokens only; every component is new.

**Visual direction:** Sin City noir. Ink black page, paper white type, blood red and napkin yellow as the only colours
allowed to live. Anton for headlines, Special Elite (typewriter) for narration and captions. Comic spreads with white
gutters, caption boxes pinned to panel corners, film grain and rain.

## Motion (`scripts/noir.js`)
- Photo grading on canvas: crushed blacks, hot whites, only red and gold keep their colour (the flannel shirt, the
  napkins, the beer). Until it is ready, and without JS, the photos show in CSS greyscale.
- "Turn on the lights" switch: fades every photo back to full colour and back.
- Hero: rain falling, the title slams in line by line, the red line flickers like a bad neon sign.
- Panels wipe open from the top, then their captions drop in; other blocks rise in.
- Evidence log counts up from the receipt figures.
- Film grain redrawn about nine times a second (a still frame with reduced motion).

## New in this sample
- Noir hero (`components/sections/noir-hero/`)
- Chapter with the spread grid and narration (`components/sections/chapter/`)
- Panel: photo, noir canvas, corner captions (`components/molecules/panel/`)
- Cast list (`components/molecules/cast-list/`)
- Evidence log (`components/molecules/evidence-log/`)
- Pull quote (`components/atoms/pull-quote/`), lights switch (`components/atoms/lights-button/`)
- Case closed (`components/sections/case-closed/`)

## Client look
`brand.css` changes the palette (primary = blood red, accent = napkin yellow, neutrals = ink and paper) and the fonts.
Small red text uses the lighter red (primary-400) for contrast on black.

## Content
Photos and the receipt are the owner's own. The receipt is cropped below the seller's details. People are named by
nickname only.
