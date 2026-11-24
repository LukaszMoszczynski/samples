# Sample: Online wedding-planning course for couples

**Brief, in general terms:** a course sold online to engaged couples who want to plan their wedding themselves, calmly
and in the right order. The site presents the four modules, shows what the course platform looks like, sells two
packages and offers a free first lesson. The look comes from a brand handoff (palette, fonts, brand brief).

**Stack:** WordPress + WooCommerce in the finished site (the course is paid online). This sample is the Astro front end;
the cart, the checkout step and the course panel are working demo screens marked as demo.

## Visual direction
"Book-like elegance": ecru and warm greys as the base, rosewood and plum as character, gold as the accent (60 / 30 /
10), with more gold in the graphics (lines, outlines, micro-hearts; never in text) and the P·L·A·N heart as a motif. Gilda Display for headings (one style: accents are made with colour, never italics), Libre Franklin Light for
text, capitals with wide tracking for labels. The mark's shape, a clover of four hearts (P·L·A·N: Pragnienia, Lekkość,
Atmosfera, Na zawsze), holds the "photos" and shows where you are.

## Motion
- Hero: the clover's thin gold outline draws heart by heart, the hearts fill, the letters and the copy rise in; then
  the clover sways slowly.
- Modules: a sticky clover lights the heart of the module in view and dims the others (from the brand brief: "always
  show which part we are in"); on phones each module card carries its own clover.
- Steps: a gold line draws with the scroll. Sections rise in as they arrive.
- Course panel: ticking tasks draws the tick, moves the progress and fills the module's heart.
- Shop: "Do koszyka" pops the cart count and slides the cart panel in; checkout step and thank-you.
- Opinions: a deck of cards (drag aside, Previous / Next, arrow keys); the top card flies off with a turn.
- Questions: the answer slides open and shut, its words rise in; the heart outline fills and beats once; a gold line
  draws under the row on hover and while open.
- Menu links: a micro-heart pops in above the link on hover and on the current section.
- The sign-up lights the clover's hearts one by one.
- Small hearts (from the handoff's motion board, each plays once): three micro-hearts rise from a heart button on
  hover; the label's micro-heart beats once when its section arrives; the gold dividers' hearts light up one by one.
- Quiet brand hearts drift up behind the hero (taken from the wedding sample, fewer and slower; paused off screen).
  The brand board says "no loops": this is the one deliberate exception, easy to turn into a single pass.
- Everything respects reduced motion; content is complete without JS.

## Design system parts
- Tokens (shared, semantic, breakpoint) and the base styles; the forms kit (dropdown, date picker, validation demo).

## New in this sample
- Clover (`components/atoms/clover/`): the brand's four-heart mark as a component with an active heart.
- Heart (`components/atoms/heart/`): one clover heart turned upright; outline, rosewood, gold, tint and echo variants.
- Overline, Pill button (`components/atoms/`): the label under a short gold line with micro-hearts, and the rosewood
  "Zapisy trwają ♥" button.
- Divider (`components/molecules/divider/`): gold hairlines with micro-hearts that light up one by one.
- Wordmark (`components/molecules/wordmark/`): the logo lockup, clover mark plus the outlined wordmark.
- Header and footer (`components/organisms/plan-header`, `plan-footer`): menu, demo cart, phone overlay drawer.
- Sections: hero, modules with the clover guide, steps, course panel demo, pricing with the cart dialog, opinions, FAQ,
  sign-up.

## Client look
`brand.css` takes every value 1:1 from the handoff (Brand collection, mode "plan"): palette, Gilda Display / Libre
Franklin, weights Light / Regular / SemiBold, container 1240 px. Colours adjusted for contrast: none.

## Placeholders to replace
- Photos: the hero hearts hold soft colour fields; a new photo set for the identity is in progress.
- Prices, numbers of lessons, access time and the opinions are examples.

## Logo
The clover follows the chosen mark ("Znak – P1 na Ecru 1": each heart is a square plus two circles, tips toward the centre);
`assets/logo.svg` and `assets/logo-light.svg` are the P·L·A·N wordmark with micro-hearts, outlined from the identity file.

## To Figma (after a win)
1. Add a brand mode in the Brand collection with the values from `brand.css`.
2. Capture the page into Figma with the Figma connector.
3. Rebuild each "new" component as a Figma component bound to variables, then add it to the design system
   (template, CSS, PHP version, story).
