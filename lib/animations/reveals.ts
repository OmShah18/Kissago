import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * The generic entrance animations, driven entirely from markup:
 *
 *   data-reveal="up|down|left|right"  fade the element in from that side
 *   data-stagger="0.12"               fade its children in one after another
 *   data-count="120" data-suffix="+"  count a number up when it scrolls in
 *
 * `data-delay` shifts either of the first two.
 *
 * Every tween here is created inside the caller's `gsap.context`, so the whole
 * set is reverted together when the route unmounts.
 */
export function initReveals() {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const dir = el.dataset.reveal || 'up';
        const delay = parseFloat(el.dataset.delay || '0');
        const from: gsap.TweenVars = { autoAlpha: 0 };
        if (dir === 'up') from.y = 50;
        else if (dir === 'down') from.y = -30;
        else if (dir === 'left') from.x = -60;
        else if (dir === 'right') from.x = 60;

        gsap.from(el, {
            ...from,
            duration: 1.0,
            delay,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        });
    });

    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((container) => {
        gsap.from(Array.from(container.children), {
            autoAlpha: 0,
            y: 40,
            duration: 0.9,
            stagger: parseFloat(container.dataset.stagger || '0.12'),
            delay: parseFloat(container.dataset.delay || '0'),
            ease: 'power3.out',
            scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' },
        });
    });

    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = parseInt(el.dataset.count || '0', 10);
        const suffix = el.dataset.suffix || '';
        const obj = { val: 0 };
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = Math.round(obj.val) + suffix;
                    },
                });
            },
        });
    });
}
