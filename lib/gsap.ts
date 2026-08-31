import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The single place GSAP is set up, registered at import time rather than from
 * an effect.
 *
 * React runs child effects before parent ones, so a page's animations are
 * created before anything in the shell above them gets a turn. Registering the
 * plugin from the shell's effect was therefore too late: GSAP silently dropped
 * every `scrollTrigger` config it was handed and `ScrollTrigger.create()` threw
 * outright, which took the whole page down. Importing from here instead means
 * the plugin is registered by the time any module that uses it has loaded.
 */
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    // Stop mobile address-bar show/hide from re-triggering layout jumps.
    ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
