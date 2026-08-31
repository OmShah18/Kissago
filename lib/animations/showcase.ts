import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/smooth-scroll';

/** Below this the CSS hides the two columns and shows stacked cards instead,
 *  so there is nothing here to drive. */
const NARROW = 768;

/** How much the arriving photograph is oversized before it settles. Small
 *  enough that it reads as the image coming forward rather than as a zoom. */
const BLOOM = 1.07;

/** Long enough to read as one photograph dissolving into the next; short
 *  enough to have finished by the time the service name is settled. */
const FADE = 0.7;

/**
 * The "what we shoot" showcase.
 *
 * The layout is the browser's: the services are ordinary full-height blocks in
 * the left column and the photograph is `position: sticky` in the right one.
 * All this does is decide which photograph is showing — whichever service is
 * crossing the middle of the screen owns it.
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

    // The columns are display:none here, so the steps have no height to
    // measure and there is no sticky photograph to change.
    if (window.innerWidth <= NARROW) return;

    // Reduced motion keeps the swap — otherwise one photograph would hold for
    // the whole of a six-screen section — but cuts rather than dissolves.
    const reduced = prefersReducedMotion();
    const fade = reduced ? 0 : FADE;

    gsap.set(figures, { autoAlpha: 0 });
    gsap.set(figures[0], { autoAlpha: 1 });

    let active = 0;

    function show(next: number) {
        if (next === active || !figures[next]) return;
        const outgoing = figures[active];
        active = next;

        // `overwrite` for the same reason the featured names need it: a flick
        // that crosses two services fires these in quick succession, and a
        // photograph can end up being faded in by its own arrival while it is
        // also being faded out by the next one.
        gsap.to(outgoing, { autoAlpha: 0, duration: fade, ease: 'power2.inOut', overwrite: true });
        gsap.fromTo(
            figures[next],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: fade, ease: 'power2.inOut', overwrite: true },
        );
        if (!reduced) {
            gsap.fromTo(
                figures[next].querySelector('img'),
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
