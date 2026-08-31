import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/smooth-scroll';

/** How much the arriving photograph is oversized before it settles. Small
 *  enough that it reads as the image coming forward rather than as a zoom. */
const BLOOM = 1.07;

/** Long enough to read as one photograph dissolving into the next; short
 *  enough to have finished by the time the service name is settled. */
const FADE = 0.7;

/** Where the plate sits above the services rather than beside them, and the
 *  reveal changes with it. Matches the breakpoint in collections.css. */
const NARROW = '(max-width: 768px)';

/** The narrow-screen reveal: the arriving photograph opens out of nothing at
 *  the centre of the one it replaces. Slower than the cross-fade because the
 *  whole of the movement is the point — at the cross-fade's pace it reads as
 *  a pop rather than as something opening. */
const OPEN = 0.95;

/**
 * The "what we shoot" showcase.
 *
 * The layout is the browser's: the services are ordinary blocks and the
 * photograph is `position: sticky` beside them — or above them, on a narrow
 * screen. All this does is decide which photograph is showing, and the rule is
 * the same in both arrangements: whichever service is crossing the middle of
 * the screen owns it.
 *
 * Driven by however many services the markup contains, so the six can become
 * seven without touching this file.
 */
export function initShowcase() {
    const section = document.querySelector<HTMLElement>('.projects-showcase');
    if (!section) return;

    const figures = gsap.utils.toArray<HTMLElement>('.showcase-figure', section);
    const steps = gsap.utils.toArray<HTMLElement>('.showcase-step', section);
    if (figures.length < 2 || steps.length < figures.length) return;

    // Reduced motion keeps the swap — otherwise one photograph would hold for
    // the whole of a six-screen section — but cuts rather than dissolves.
    const reduced = prefersReducedMotion();
    const fade = reduced ? 0 : FADE;

    const narrow = window.matchMedia(NARROW);

    figures.forEach((f) => { f.style.zIndex = ''; });
    gsap.set(figures, { autoAlpha: 0, scale: 1 });
    gsap.set(figures[0], { autoAlpha: 1 });

    let active = 0;
    /** Whichever photograph arrived last has to be the one on top, and the
     *  order they arrive in is not the order they sit in the markup — scrolling
     *  back up brings an earlier one forward. A rising counter covers both. */
    let front = 0;

    function show(next: number) {
        if (next === active || !figures[next]) return;
        const outgoing = figures[active];
        const incoming = figures[next];
        active = next;

        // `overwrite` throughout: a flick that crosses two services fires these
        // in quick succession, and a photograph can end up being brought in by
        // its own arrival while it is also being taken out by the next one.
        if (narrow.matches) {
            // The arriving photograph opens out of the middle of the one it
            // replaces, which stays where it is underneath until it is covered
            // — no fade at all, the growing image does the hiding.
            incoming.style.zIndex = String(++front);
            gsap.killTweensOf(outgoing);
            gsap.set(outgoing, { autoAlpha: 1, scale: 1 });
            gsap.fromTo(
                incoming,
                { autoAlpha: 1, scale: 0 },
                { scale: 1, duration: reduced ? 0 : OPEN, ease: 'power2.out', overwrite: true },
            );
            return;
        }

        gsap.to(outgoing, { autoAlpha: 0, duration: fade, ease: 'power2.inOut', overwrite: true });
        gsap.fromTo(
            incoming,
            { autoAlpha: 0, scale: 1 },
            { autoAlpha: 1, duration: fade, ease: 'power2.inOut', overwrite: true },
        );
        if (!reduced) {
            gsap.fromTo(
                incoming.querySelector('img'),
                { scale: BLOOM },
                { scale: 1, duration: FADE * 1.6, ease: 'power3.out', overwrite: true },
            );
        }
    }

    steps.forEach((step, i) => {
        ScrollTrigger.create({
            trigger: step,
            // The photograph belongs to whichever service is crossing the
            // middle of the screen.
            start: 'top center',
            end: 'bottom center',
            onEnter: () => show(i),
            onEnterBack: () => show(i),
        });
    });
}
