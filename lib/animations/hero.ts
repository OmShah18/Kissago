import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/smooth-scroll';
import { onPreloaderDone } from '@/lib/preloader-state';

/** Where the footage starts: a small upright panel in the middle of the screen,
 *  roughly the proportion of a printed frame, sized off the shorter edge so it
 *  is the same object on any screen. */
const PANEL_H_VH = 30;
const PANEL_ASPECT = 0.72;

/**
 * The opening: the footage expands out of the panel the preloader left behind,
 * and the wordmark rises into it letter by letter.
 *
 * Choreographed against the preloader rather than against mount — starting on
 * mount would play the whole thing behind the preloader, where nobody sees it.
 * The two overlap on purpose: the letters begin while the frame is still
 * opening, so the hero arrives as one movement instead of two.
 */
export function initHeroReveal(): () => void {
    const media = document.querySelector<HTMLElement>('.kg-hero-media');
    const letters = gsap.utils.toArray<HTMLElement>('.kg-hero-letter > span');
    if (!media && !letters.length) return () => {};

    const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');

    if (prefersReducedMotion()) return () => {};

    // Held at the resting state until the preloader hands over. Setting this
    // synchronously — not inside the callback — is what stops a frame of
    // full-bleed footage and finished type showing through first.
    if (media) gsap.set(media, panelVars());
    gsap.set(letters, { yPercent: 100 });
    gsap.set(fades, { autoAlpha: 0, y: 26 });

    // Promoted for the entrance only, and handed back below. The frame is the
    // size of the screen, so leaving it promoted costs a full-viewport layer
    // for the whole life of the page in exchange for one 1.25s opening — and
    // the page is scrolled past it within seconds.
    if (media) gsap.set(media, { willChange: 'clip-path' });
    gsap.set(letters, { willChange: 'transform' });

    // The panel is measured in viewport units, so a resize before the reveal
    // runs would leave it the wrong size.
    const onResize = () => {
        if (media && !started) gsap.set(media, panelVars());
    };
    let started = false;
    window.addEventListener('resize', onResize);

    const unsubscribe = onPreloaderDone(() => {
        started = true;
        const tl = gsap.timeline({
            onComplete: () => {
                if (media) gsap.set(media, { willChange: 'auto' });
                gsap.set(letters, { willChange: 'auto' });
            },
        });

        if (media) {
            tl.fromTo(media, panelVars(), {
                '--kg-clip-y': '0%',
                '--kg-clip-x': '0%',
                duration: 1.25,
                ease: 'power4.inOut',
            });
        }

        tl.to(
            letters,
            {
                yPercent: 0,
                duration: 1.15,
                ease: 'power4.out',
                stagger: 0.055,
            },
            media ? 0.45 : 0,
        );

        tl.to(
            fades,
            {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.12,
            },
            '-=0.55',
        );
    });

    return () => {
        window.removeEventListener('resize', onResize);
        unsubscribe();
    };
}

/** The two insets that leave only the opening panel showing. */
function panelVars(): gsap.TweenVars {
    const h = (window.innerHeight * PANEL_H_VH) / 100;
    const w = h * PANEL_ASPECT;
    const y = (((window.innerHeight - h) / 2) / window.innerHeight) * 100;
    const x = (((window.innerWidth - w) / 2) / window.innerWidth) * 100;
    return { '--kg-clip-y': y.toFixed(3) + '%', '--kg-clip-x': x.toFixed(3) + '%' };
}

/**
 * Four full-bleed stills animating scale forever is real GPU work on every
 * frame, and it kept running long after the hero had been scrolled past. Park
 * it while it is off screen; the animation is on a `-delay` cycle, so resuming
 * picks up wherever it would have been anyway.
 */
export function initHeroDrift(): () => void {
    const wall = document.querySelector<HTMLElement>('.kg-hero-wall');
    if (!wall || !('IntersectionObserver' in window)) return () => {};

    const io = new IntersectionObserver(
        ([entry]) => wall.classList.toggle('is-idle', !entry.isIntersecting),
        { rootMargin: '100px' },
    );
    io.observe(wall);
    return () => io.disconnect();
}
