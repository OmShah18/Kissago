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
                       scroll.css, hero.css, featured.css, frames.css,
                       collections.css, films.css and footer.css are new work,
                       kept separate so those three cannot drift
components/
  site/                the chrome each route sits inside: transition curtain,
                       header, menu overlay, parallax footer, photograph viewer
  sections/            the repeated page furniture: inner hero, story card,
                       films, two-column showcase, closing CTA, enquiry form
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

## The preloader

It plays once per tab session and then gets out of the way: the first arrival
anywhere on the site claims the visit, and every load after that — a reload of
the home page, or reaching it from another route — goes straight to the hero.

Two halves keep that honest. `lib/preloader-state.ts` holds the flag in
`sessionStorage`; only the preloader may `claimFirstVisit()`, and the routes
without one call `markSiteVisited()` instead, so no route both reads and writes
and nothing depends on the order React runs effects in. And because the overlay
is in the prerendered HTML, an inline script in `app/layout.tsx` marks the
document before the first paint so `hero.css` can hide it — React unmounting it
a tick later would be a tick too late to avoid a flash of cream.

The hero's own entrance still plays either way. It just has nothing in front of
it the second time.

## Scroll

`lib/smooth-scroll.ts` runs Lenis at `duration: 1.6` with `wheelMultiplier:
0.8` — longer to settle and a little less ground per notch. The pages are built
out of full-height moments, and at the usual 1.2 with no multiplier they flicked
past. Touch is deliberately left native: damping a finger drag reads as lag, not
as polish.

`app/styles/scroll.css` turns off the browser's own `scroll-behavior: smooth`,
which `style.css` carries over from the static site. Lenis moves the page by
writing `documentElement.scrollTop` every frame, and that setter obeys
`scroll-behavior`, so the browser was easing its way towards each position Lenis
asked for instead of taking it — two easings deep, and a `scrollTo(…,
{ immediate: true })` took the best part of a second. Read the comment in that
file before touching the `!important`: ScrollTrigger re-applies the value as an
inline style, which no ordinary rule can outrank.

## The home hero

`components/sections/Hero.tsx` is 230vh tall. The footage is `position: sticky`
for the whole of it, so the wordmark, the introduction and the featured story
travel up over a frame that stays put.

The opening lives in `lib/animations/hero.ts` and waits on the preloader rather
than on mount — starting at mount would play it behind the preloader, where
nobody sees it. The frame expands out of the small centred panel the preloader
leaves behind while the letters are already rising into it, so the two read as
one movement.

The wordmark is Bodoni Moda at `wght` 600 with `opsz` pinned to 20. Left to
itself, `font-optical-sizing: auto` ties opsz to the font-size, and at this size
that asks for the 96pt display cut — the finest hairlines on the axis, which
disappeared over the footage. Both of those override `kissago.css`, along with
a smaller `font-size`: heavier letters are wider ones, and the word was already
set to nearly the full line. Past that the letters are flex items with nowhere
to go, so they shrink and clip their own glyphs against the masks that make the
reveal work — silently, serifs first. `hero.css` has the numbers.

The expansion drives `--kg-clip-y` / `--kg-clip-x` rather than a whole
`clip-path` string. A symmetric `inset()` always reports back from computed
style in its collapsed two-value form, which leaves GSAP two numbers to
interpolate against a four-value target — the frame then opens from a corner
instead of the middle. Custom properties hold exactly what they were given.
`hero.ts` also owns the `will-change` for both the frame and the letters,
setting it for the entrance and giving it back on completion: the frame is the
size of the screen, and promoting it declaratively kept a full-viewport
compositor layer alive for the whole life of the page.

The two heights in the hero are deliberately different units, and neither is
`dvh`. On a phone the address bar retracts on the first scroll, and anything
measured in `dvh` grows by its height mid-gesture — the frame gained ~99px and
the wordmark slid half that down the screen while the reader's finger was still
on it. The frame is `100lvh`, sized for the tall state from the outset so it
never resizes and never uncovers the ground beneath it; the band that centres
the wordmark is `100svh`, matching the screen as first seen. The section around
them is `vh`, which is the same as `lvh`. Everything in the hero is therefore a
constant, and the section does not move while it is being scrolled. On a desktop
browser all four units are equal, so none of this changes anything there.

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

The scatter needs width to read, so below 900px it gives way to what the
reference does on a phone: one photograph per couple at 360x456 with 15px
gutters, and the couple's name centred directly beneath it — no second or third
frame, no drift, no floating name. The block becomes a flex column so the name
can sit under its photograph: the heading is written before the frames so the
markup reads correctly unstyled, and `order` puts it back.

Nothing there moves at all. The drift is off below that width anyway, but the
frames are links and a touch screen latches `:hover` on tap, so the zoom meant
for a mouse fired whenever someone opened a wedding. It and the pill's lift are
switched off with it.

## Selected frames

The home page's photograph grid is a tile wall: three flush columns of 2:3
portraits running the full width of the section. `app/styles/frames.css` adds
`.kg-tilegrid`, which only redefines the tracks, the gutter and the aspect
ratio — the hover, the scrim and the viewer still come from `.kg-grid`.

Its selectors name both classes so they beat `.kg-grid`'s own responsive rules
on specificity rather than on import order. The sampler strips on `/about` and
`/contact` keep `.kg-grid-4` and are unaffected.

## Films

Three 16:9 frames staggered down the page between the tile wall and the
showcase. The section above it is a flush three-column grid, so another even
row here would read as more of the same; the stagger picks up the featured
weddings' language instead, on the page's own cream ground.

`data/films.ts` holds three real uploads from the studio's channel, each one
belonging to a wedding that already has a gallery here — so a film opens the
set it was cut from rather than leading nowhere. Posters are derived from the
video id, not stored: a still of the film's own first frame is always the right
image, and there is nothing to keep in step when a film is swapped.

Nothing loads from YouTube until someone asks for it. Each frame is the film's
poster with a play control over it, and the player replaces it on click —
three embeds mounted up front would cost more than the rest of the page.

`lib/animations/films.ts` lifts each frame like a curtain as it arrives, its
poster easing back to size behind it, then drifts the three at alternating
rates so the column does not travel as one slab. The curtain drives a
`--kg-film-open` custom property rather than a whole `clip-path`, for the
reason the hero does: a symmetric `inset()` reports back collapsed and opens
the frame from a corner.

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

Below 768px it is the same arrangement turned through ninety degrees: the
photograph holds the top of the screen and the services pass underneath it and
away behind it. Dropping the grid is all that takes — in normal flow the two
fall into DOM order, photograph first, and `grid-area` stops applying, so the
markup is identical at both sizes and the stacked cards are gone.

The reveal changes with it. Wide screens dissolve one photograph into the next;
narrow ones use the reference's: the arriving photograph opens out of nothing
at the centre of the one it replaces, which stays put underneath until it is
covered. Nothing fades — the growing image does the hiding. That needs a
`z-index`, because the order they arrive in is not the order they sit in the
markup: scrolling back up brings an earlier one forward, so a rising counter
puts whichever arrived last on top.

Three things that box needs on a phone. It is opaque and runs to all three
edges with the inset as padding, not a margin, or the outgoing service shows
through the gap above it on its way past. It needs a `z-index`: it comes first
in flow, so without one every block after it paints over the picture instead of
disappearing behind it. And it keeps a plain `margin: 0`.

That last one is worth the words. Each service reserves the picture's height
with its own `padding-top`, so it is tempting to pull the box out of the flow
with a negative `margin-bottom` and stop paying for that height twice. Doing so
breaks the release: sticky is clamped by the element's *margin* box, so a
bottom margin of minus its own height lets it stay glued until its top — not
its bottom — reaches the end of the section, and the closing panel then slides
up underneath the photograph instead of after it. The box stays in the flow and
the first service alone drops the padding, its `min-height` shortened to match
so the one-service-per-screen rhythm still starts at the first one.

## Photographs

Each frame exists twice: `name.jpg` at 900px for the grid and `name-lg.jpg` at
1200px for the viewer. `lib/frames.ts` pairs them. The originals live outside
the repo (see `.gitignore`); `public/assets/manifest.json` records what the
optimised set was generated from.

Grids use plain `<img>` rather than `next/image` — the files are already sized
for their two uses, so the optimiser has nothing to add.

## Footer

`app/styles/footer.css` puts a painted botanical behind the footer, tinted with
a scrim in `--accent-ink` so the cream text stays clear of the lighter passages
between the leaves. Longhands only — the `background` shorthand would clear the
colour `style.css` and `kissago.css` set, and that colour is the fallback if
the file ever 404s.

## Type

Cormorant Garamond, DM Sans, Bodoni Moda and Courier Prime come from Google
Fonts in `app/layout.tsx`; Boska and Satoshi from Fontshare, one request per
family because it only honours the first `f[]` in a URL. The first two families
are requested twice on purpose — see the comment there before removing either
request.

Nothing sets Boska, Satoshi or Courier Prime yet, so no browser downloads their
faces; they cost three stylesheet requests until something names them.
