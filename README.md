# Samples

Small website samples for client briefs, all built from one design system:
https://lukaszmoszczynski.github.io/design-system/

Each sample lives in `samples/<slug>/` and is published at
`https://lukaszmoszczynski.github.io/samples/<slug>/`. The slug names the type of project.
The index at `https://lukaszmoszczynski.github.io/samples/` (`src/pages/index.astro`) lists every sample with a live
preview; it reads `sample.json` (`title`, `summary`, `direction`, `tags`, `date`) and the colours from `brand.css`.

## Which stack

| The brief needs | Stack |
|---|---|
| CMS and shop | WordPress block theme + WooCommerce (coming) |
| Shop, no CMS | WordPress + WooCommerce (coming) |
| CMS, no shop | Payload + Astro (coming) |
| No CMS | Astro |

## A sample

- `ds/`: a pinned copy of the design-system files it uses (`ds/VERSION` names the commit).
- `brand.css`: the client's look. It changes token values only, never names.
- `components/`: components made for this sample, built from tokens only.
- `pages/`: the Astro pages. `sample.json`: slug, stack, language, title, pages.
- `README.md`: the brief in general terms, which parts are design system and which are new, and the steps to move it
  into Figma.

## Add a sample

```sh
npm install
node scripts/new-sample.mjs <slug> <pl|en> "<title>"
node scripts/check-sample.mjs <slug>
```

`npm test` runs the unit tests; `npm run banned` checks the repo for names that must not appear here.
