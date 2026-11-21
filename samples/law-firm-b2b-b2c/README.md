# Sample: law firm with separate paths for firms and individuals

**Brief, in general terms:** a full rebuild of a law firm's website. Two goals: a clear split between the offer for
firms (B2B) and for individuals (B2C), so every visitor knows from the first visit where their services are and how to
get in touch; and better visibility in Google and in AI answers (ChatGPT, Gemini, Perplexity). The firm wants
templates for service pages and articles it can update itself, content migration with redirects, and advice on
measuring results.

**Stack:** for the real project, the firm edits pages and articles itself, so a CMS (Payload or a WordPress block
theme). This sample is the front end in Astro: the home page and one service page built from the service template.

## How the sample answers the two goals
- **Two paths:** the header switch ("Dla firm" / "Dla Ciebie"), two doors in the hero, the offer tabs, the contact
  choice and the contact facts all follow one path, remembered for the next visit. Each path has its own services,
  its own contact box and its own contact details.
- **Google and AI tools:** answer-first content (every article and service page opens with a short answer), the author
  and review date on every answer, FAQ sections, and structured data: LegalService, Service, BreadcrumbList, FAQPage.
  The service page has breadcrumbs and a table of contents that marks the section in view.

## Visual direction: "editorial counsel"
Warm ivory paper, ink text, deep green and brass, Fraunces serif headlines with italic accents, chapter marks
(i., ii., …) and thin rules. Calm on purpose. Motion (GSAP, `scripts/law.js`): the headline rises in word by word,
the § draws itself in a slowly turning seal, the doors rise in, the path switch slides its underline and staggers the
services in, monogram rings draw, step rules sweep across, FAQ answers slide open. All motion is off with "reduce
motion"; content is complete without JS.

## Design system parts
- Tokens only: `ds/tokens/shared.css` and the reset in `ds/components/base`.

## New in this sample (built from tokens, class prefix `ds-`)
- Base: Page (smooth scroll, header offset, container, section heading, hidden rule).
- Atoms: Ink button (solid / outline / light), Eyebrow (chapter mark).
- Organisms: Law header (with the path switch), Law footer.
- Sections: Path hero (doors + seal), Path tabs (ARIA tabs), Answers, Team (drawn monograms), Steps, Law FAQ
  (with FAQPage data), Contact (path choice).
- Template: Service page (summary box, TOC, article, author box, related services).
- Logo (`assets/logo.svg`, `assets/logo-light.svg`): a placeholder, "Kancelaria Przykładowa".

## Client look
`brand.css`: ivory neutrals, ink secondary, deep green primary, brass accent (`--palette-accent-500` for text on
ivory, `--palette-accent-400` on dark; lightened once to pass WCAG AA on green). Headings Fraunces, text Inter.

## To Figma (after a win)
1. Add a brand mode in the Primitives collection with the values from `brand.css`.
2. Capture both pages into Figma with the Figma connector.
3. Rebuild the new components as Figma components bound to variables, then add them to the design system
   (template, CSS, PHP version, story).
