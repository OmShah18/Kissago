import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/smooth-scroll';

/** The four-stage process rail on /about: the line draws in with the scroll and
 *  each marker lights as the line reaches it. */
export function initProcessRail() {
    const wrap = document.querySelector<HTMLElement>('.kg-process');
    if (!wrap) return;

    const fill = wrap.querySelector<HTMLElement>('.kg-process-fill');
    const steps = gsap.utils.toArray<HTMLElement>('.kg-process-step', wrap);
    if (!steps.length) return;

    // With motion reduced, show the finished state rather than an empty rail.
    if (prefersReducedMotion()) {
        if (fill) fill.style.transform = 'scaleX(1)';
        steps.forEach((s) => s.classList.add('is-on'));
        return;
    }

    // Markers sit at the left edge of each column, so step i is reached at
    // i/(n-1) of the rail.
    const n = steps.length;
    ScrollTrigger.create({
        trigger: wrap,
        start: 'top 78%',
        end: 'bottom 70%',
        scrub: 0.5,
        onUpdate: (self) => {
            const p = self.progress;
            // scaleX, not a percentage width: this fires on every scrubbed
            // frame and a width write would force a layout pass each time.
            if (fill) fill.style.transform = 'scaleX(' + p + ')';
            steps.forEach((s, i) => s.classList.toggle('is-on', p >= i / (n - 1) - 0.001));
        },
    });
}
