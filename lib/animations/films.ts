import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/smooth-scroll';

/** How far a frame drifts against the scroll, as a fraction of the viewport.
 *  Small: the frames are staggered across the page already, and this is only
 *  meant to stop the three of them moving as one slab. */
const DRIFT = 0.055;

/** The poster starts oversized and settles as the curtain lifts, so the frame
 *  opens onto something already moving rather than onto a still. */
const SETTLE = 1.1;

/**
 * The films section.
 *
 * Each frame opens like a curtain going up as it reaches the screen, its
 * poster easing back to size behind it, and the caption follows a beat later.
 * Afterwards the frames drift gently against the scroll, alternating direction
 * so the column reads as three separate things.
 *
 * A no-op when the section is absent, so it can sit in the same list of
 * initialisers as everything else.
 */
export function initFilms() {
    const section = document.querySelector<HTMLElement>('[data-films]');
    if (!section) return;

    const films = gsap.utils.toArray<HTMLElement>('[data-film]', section);
    if (!films.length) return;

    if (prefersReducedMotion()) {
        // The stylesheet already leaves the frames open; make sure nothing is
        // left parked from a previous route.
        films.forEach((film) => {
            gsap.set(film.querySelector('[data-film-frame]'), { '--kg-film-open': '0%' });
            gsap.set(film.querySelector('[data-film-meta]'), { autoAlpha: 1, y: 0 });
        });
        return;
    }

    films.forEach((film, i) => {
        const frame = film.querySelector<HTMLElement>('[data-film-frame]');
        const meta = film.querySelector<HTMLElement>('[data-film-meta]');
        const poster = film.querySelector<HTMLElement>('.kg-film-play img');
        if (!frame || !meta) return;

        // Resting state. The curtain is down and the caption is under it.
        gsap.set(frame, { '--kg-film-open': '100%' });
        gsap.set(meta, { autoAlpha: 0, y: 24 });
        if (poster) gsap.set(poster, { scale: SETTLE });

        const open = gsap.timeline({
            scrollTrigger: {
                trigger: film,
                start: 'top 82%',
                // Played once. A frame that re-closes when you scroll back is
                // a distraction on the way to somewhere else.
                toggleActions: 'play none none none',
            },
        });

        open.to(frame, { '--kg-film-open': '0%', duration: 1.15, ease: 'power4.inOut' });
        if (poster) open.to(poster, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
        open.to(meta, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.45);

        // Alternating drift, so the three pass at slightly different rates
        // instead of moving as one block.
        //
        // The whole article, not just the frame: the caption sits under the
        // frame in normal flow, and drifting the frame alone slides it down
        // over its own caption.
        const travel = (i % 2 ? -1 : 1) * window.innerHeight * DRIFT;
        gsap.fromTo(
            film,
            { y: travel },
            {
                y: -travel,
                ease: 'none',
                scrollTrigger: {
                    trigger: film,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            },
        );
    });

    // The posters come from YouTube and land after the triggers above were
    // measured, which leaves every start position a little out.
    ScrollTrigger.refresh();
}
