# Sample: logistics company site

**Brief, in general terms:** a modern website for a transport and logistics company, in a style that fits transport
and new technology. The client wants to run the site themselves: add sub-pages, edit text, photos, videos and links,
and change the structure without a developer. Business events are a plus.

**Stack:** for the real project, the client edits content, so a CMS (WordPress block theme, or Payload). This sample is
the front end in Astro, built from the design system (`ds/VERSION` names the commit). Every section is a design-system
block with fields, which is what the client would fill in the editor.

## Design system parts
- Header with mobile menu, Hero (large, three tiles), Text + image (numbered steps), Heading group, Card/Post,
  FAQ (accordion), Call to action (band), Footer.

## New in this sample
- Page section (`components/sections/page-section/`): the container for an organism used outside a DS section.
- Stats band (`components/sections/stats-band/`): four key figures on the brand surface.
- Post grid (`components/sections/post-grid/`): a heading and three Card/Post in a row (news and events), each card
  stacked (photo above text).
- Header brand (`components/organisms/header-brand/`): hides the empty partner-badge slot.
- Logo (`assets/logo.svg`, `assets/logo-light.svg`): a placeholder wordmark, "Twoja Logistyka".

## Client look
`brand.css`: navy primary (`--palette-primary-*`), signal orange accent (`--palette-accent-*`), slate secondary,
cool neutrals; headings in Sora, text in Inter. Contrast: the orange accent word in the hero title was dropped
(orange on navy fails WCAG AA); the hero title is white.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild Stats band and Post grid as Figma components bound to variables, then add them to the design system
   (template, CSS, PHP version, story).
