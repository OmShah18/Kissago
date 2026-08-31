import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

export function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let lenis: Lenis | null = null;
/** Guards against React's development double-mount handing us two instances,
 *  which would drive the same scroll twice and halve the easing. */
let refCount = 0;

export function getLenis(): Lenis | null {
    return lenis;
}

/**
 * Brings up smooth scroll and hands ScrollTrigger the same clock.
 *
 * Lenis must be driven by exactly ONE ticker: GSAP's, so that every scrubbed
 * animation is measured against the position Lenis has already settled on for
 * this frame. A second `requestAnimationFrame` loop would advance Lenis after
 * ScrollTrigger had read it, and pinned sections would judder by a frame.
 */
export function startSmoothScroll(): () => void {
    if (typeof window === 'undefined') return () => {};

    refCount += 1;

    if (!lenis && !prefersReducedMotion()) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
    }

    // Trigger positions depend on image heights, and web fonts change text
    // block heights — re-measure once each has arrived.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (document.fonts?.ready) void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
        window.removeEventListener('load', onLoad);
        refCount -= 1;
        if (refCount > 0 || !lenis) return;
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenis = null;
    };
}

function tick(time: number) {
    lenis?.raf(time * 1000);
}

/** Lenis owns the scroll position, so pausing it is what actually freezes the
 *  page behind an overlay — `overflow: hidden` alone does not stop its rAF. */
export function lockScroll() {
    document.body.style.overflow = 'hidden';
    lenis?.stop();
}

export function unlockScroll() {
    document.body.style.overflow = '';
    lenis?.start();
}
