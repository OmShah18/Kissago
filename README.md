# Kissago Art Co.

Wedding photography site for Kissago Art Co. — Next.js App Router, built and
served through Turbopack.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
npm run lint
```

Every route is prerendered at build time; there is no server-side data.

## Layout

```
app/
  layout.tsx           document shell, font requests, global stylesheets
  page.tsx             home
  about|contact|portfolio|weddings/
  weddings/[slug]/     one gallery per featured wedding
  styles/              style.css, inner-style.css, kissago.css — unchanged from
                       the static site, and the source of truth for every
                       colour, size and transition on the page.
                       hero.css, featured.css, frames.css and collections.css
                       are new work, kept separate so those three cannot drift
components/
  site/                the chrome each route sits inside: transition curtain,
                       header, menu overlay, parallax footer, photograph viewer
  sections/            the repeated page furniture: inner hero, story card,
                       two-column showcase, closing CTA, enquiry form
lib/
  gsap.ts              the single place GSAP and ScrollTrigger are registered
  smooth-scroll.ts     Lenis, driven by GSAP's ticker
  animations/          one initialiser per scroll-driven effect
data/                  copy, galleries and navigation, as plain TypeScript
public/assets/         the photographs, two files per frame (see below)
```

## How the animations are wired

`components/site/PageEffects.tsx` mounts once per route, keyed on the pathname,
and runs every initialiser in `lib/animations/`. Each one is a no-op when its
markup is absent, so a single component covers all the pages.

Everything is created inside a `gsap.context`, which is reverted when the route
unmounts — without that, a client-side navigation would leave the previous
page's ScrollTriggers measuring elements that no longer exist.

GSAP is registered at import time in `lib/gsap.ts`, not from an effect. React
runs child effects before parent ones, so registering from the shell would
happen after the page below it had already tried to create its ScrollTriggers.
Import GSAP from `@/lib/gsap`, never from `gsap` directly.

## The home hero

`components/sections/Hero.tsx` is 230vh tall. The footage is `position: sticky`
for the whole of it, so the wordmark, the introduction and the featured story
travel up over a frame that stays put.

The opening lives in `lib/animations/hero.ts` and waits on the preloader rather
than on mount — starting at mount would play it behind the preloader, where
nobody sees it. The frame expands out of the small centred panel the preloader
leaves behind while the letters are already rising into it, so the two read as
one movement.

The expansion drives `--kg-clip-y` / `--kg-clip-x` rather than a whole
`clip-path` string. A symmetric `inset()` always reports back from computed
style in its collapsed two-value form, which leaves GSAP two numbers to
interpolate against a four-value target — the frame then opens from a corner
instead of the middle. Custom properties hold exactly what they were given.

## Featured weddings

Three frames per couple scattered across the page rather than lined up, each
drifting at its own rate, with the name held at the centre of the screen and
swapped a letter at a time as you reach the next set.

The nine positions live in `data/featured.ts` as `vw` values, so the
composition holds its proportions at any width; `lib/animations/featured.ts`
does the drift and the swapping. Every name is in the DOM at once — that is what
lets one turn into another rather than cut.

`.kg-featured` uses `overflow-x: clip`, never `hidden`: `hidden` would make the
section the scrollport for the sticky name inside it, which would then sit at
the top of the section instead of the middle of the screen.

## Selected frames

The home page's photograph grid is a tile wall: three flush columns of 2:3
portraits running the full width of the section. `app/styles/frames.css` adds
`.kg-tilegrid`, which only redefines the tracks, the gutter and the aspect
ratio — the hover, the scrim and the viewer still come from `.kg-grid`.

Its selectors name both classes so they beat `.kg-grid`'s own responsive rules
on specificity rather than on import order. The sampler strips on `/about` and
`/contact` keep `.kg-grid-4` and are unaffected.

## What we shoot

Two columns for the length of the section: the six services scroll up the left
half a screen at a time while one photograph holds the right half of the
viewport and changes to match whichever service is passing.

The layout is the browser's — the photograph column is `position: sticky`, not
a GSAP pin — so `lib/animations/showcase.ts` only decides which photograph is
showing. `app/styles/collections.css` carries the layout as a modifier on
`.projects-showcase`; the step rail, the dots and the framed landscape plate
are gone from the markup and their rules in `style.css` are now inert.

That sheet has to undo `style.css`'s `overflow: hidden` on the section, for the
same reason the featured section avoids it: it would make the section the
scrollport for the sticky column inside it.

## Photographs

Each frame exists twice: `name.jpg` at 900px for the grid and `name-lg.jpg` at
1200px for the viewer. `lib/frames.ts` pairs them. The originals live outside
the repo (see `.gitignore`); `public/assets/manifest.json` records what the
optimised set was generated from.

Grids use plain `<img>` rather than `next/image` — the files are already sized
for their two uses, so the optimiser has nothing to add.

## Type

Cormorant Garamond, DM Sans and Bodoni Moda are requested from Google Fonts in
`app/layout.tsx`, deliberately twice. See the comment there before removing
either request.
