import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/smooth-scroll';

/** How far a frame drifts, as a multiple of `speed` × viewport height. Tuned by
 *  eye: enough separation between the three frames of a set to read as depth,
 *  short of the frames visibly sliding out of their intended composition. */
const DRIFT = 0.75;

/** Below this the CSS stacks the frames into a column and hides the floating
 *  name, so neither effect has anything to act on. */
const WIDE = 901;

/** Letters are parked further out than their own height. The masks carry a
 *  little padding so descenders are not shaved, and that padding would
 *  otherwise let a parked letter peek over the edge. */
const PARK = 130;

/**
 * The featured weddings section: the frames drift against the scroll, and the
 * couple's name swaps to the next one as you reach their set.
 */
export function initFeatured(): () => void {
    const section = document.querySelector<HTMLElement>('[data-featured]');
    if (!section) return () => {};

    if (prefersReducedMotion() || window.innerWidth < WIDE) {
        // Show the first name rather than an empty centre line.
        const first = section.querySelector<HTMLElement>('[data-featured-name="0"]');
        if (first) gsap.set(first.querySelectorAll('.kg-featured-letter > span'), { yPercent: 0 });
        return () => {};
    }

    drift(section);
    return switchNames(section);
}

/** Each frame moves against the scroll at its own rate. Negative speeds lag
 *  behind it, positive ones run ahead — the difference is what separates the
 *  three frames of a set as they pass. */
function drift(section: HTMLElement) {
    gsap.utils.toArray<HTMLElement>('.kg-featured-frame', section).forEach((frame) => {
        const speed = parseFloat(frame.dataset.speed || '0');
        if (!speed) return;
        const travel = speed * window.innerHeight * DRIFT;
        gsap.fromTo(
            frame,
            { y: travel },
            {
                y: -travel,
                ease: 'none',
                scrollTrigger: {
                    trigger: frame,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            },
        );
    });
}

/**
 * Holds one couple's name at the centre of the screen and swaps it for the next
 * as their set arrives.
 *
 * All the names are in the DOM at once, stacked; the outgoing one's letters
 * leave upward while the incoming one's rise into place behind them. Rendering
 * only the active name and replacing its text would cut between them instead.
 */
function switchNames(section: HTMLElement): () => void {
    const names = gsap.utils.toArray<HTMLElement>('[data-featured-name]', section);
    const blocks = gsap.utils.toArray<HTMLElement>('[data-featured-block]', section);
    if (!names.length || !blocks.length) return () => {};

    const lettersOf = (el: HTMLElement) => el.querySelectorAll<HTMLElement>('.kg-featured-letter > span');

    // Everything parked below its mask; the first name is then raised into view.
    names.forEach((n) => gsap.set(lettersOf(n), { yPercent: PARK }));
    gsap.set(lettersOf(names[0]), { yPercent: 0 });

    let active = 0;
    const triggers: ScrollTrigger[] = [];

    function show(next: number) {
        if (next === active || !names[next]) return;
        const goingDown = next > active;
        const outgoing = names[active];
        active = next;

        // The outgoing name leaves the way the scroll is travelling, and the
        // incoming one arrives from the opposite edge — so scrolling back up
        // reverses the movement rather than repeating it.
        //
        // `overwrite` matters more than it looks: jumping the scroll, or moving
        // fast enough to cross two sets in one flick, fires these in quick
        // succession, and a name can end up being pulled towards 0 by its own
        // arrival while it is also being pushed away by the next one. Without
        // this the two tweens fight and both names stay on screen.
        gsap.to(lettersOf(outgoing), {
            yPercent: goingDown ? -PARK : PARK,
            duration: 0.55,
            ease: 'power3.in',
            stagger: 0.022,
            overwrite: true,
        });
        gsap.fromTo(
            lettersOf(names[next]),
            { yPercent: goingDown ? PARK : -PARK },
            {
                yPercent: 0,
                duration: 0.75,
                ease: 'power3.out',
                stagger: 0.022,
                delay: 0.12,
                overwrite: true,
            },
        );
    }

    blocks.forEach((block, i) => {
        triggers.push(
            ScrollTrigger.create({
                trigger: block,
                // The name belongs to whichever set is crossing the middle of
                // the screen.
                start: 'top center',
                end: 'bottom center',
                onEnter: () => show(i),
                onEnterBack: () => show(i),
            }),
        );
    });

    return () => triggers.forEach((t) => t.kill());
}
