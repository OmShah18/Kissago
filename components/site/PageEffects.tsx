'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { initReveals } from '@/lib/animations/reveals';
import { initShowcase } from '@/lib/animations/showcase';
import { initProcessRail } from '@/lib/animations/process-rail';
import { initHeroReveal, initHeroDrift } from '@/lib/animations/hero';
import { initBackgroundVideo } from '@/lib/animations/background-video';
import { initFeatured } from '@/lib/animations/featured';
import { initFilms } from '@/lib/animations/films';

/**
 * Wires up every scroll-driven animation for the route that is mounted.
 *
 * Each initialiser is a no-op when its markup is absent, so this one component
 * covers all the pages — the same arrangement the old scripts had, except that
 * everything is created inside a `gsap.context` and so can be torn down again.
 * Without that teardown a client-side navigation would leave the previous
 * page's ScrollTriggers measuring elements that no longer exist.
 *
 * Remounted per route by its `key`, so the setup runs once per page.
 */
export function PageEffects() {
    useEffect(() => {
        const disposers: Array<() => void> = [];

        const ctx = gsap.context(() => {
            initReveals();
            initShowcase();
            initProcessRail();
            disposers.push(initHeroReveal());
            disposers.push(initFeatured());
            initFilms();
        });

        disposers.push(initHeroDrift());
        disposers.push(initBackgroundVideo());

        // Images in the fresh page have no height yet, so every trigger
        // position measured above is provisional until they land.
        const refresh = () => ScrollTrigger.refresh();
        const settle = setTimeout(refresh, 300);
        window.addEventListener('load', refresh);

        return () => {
            clearTimeout(settle);
            window.removeEventListener('load', refresh);
            disposers.forEach((fn) => fn());
            ctx.revert();
        };
    }, []);

    return null;
}
