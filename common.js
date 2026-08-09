// common.js — Kissago Art Co. | Shared functionality for all pages

// =============================================
// Page Transition — reveal on entry
// =============================================
(function () {
    const overlay = document.getElementById('page-transition');
    if (!overlay) return;
    function revealPage() {
        if (typeof gsap === 'undefined') {
            overlay.style.transform = 'translateY(-100%)';
            overlay.style.transition = 'transform 1s cubic-bezier(0.76,0,0.24,1)';
            setTimeout(() => { overlay.style.pointerEvents = 'none'; }, 1000);
            return;
        }
        gsap.to(overlay, {
            yPercent: -100,
            duration: 1.0,
            ease: 'power4.inOut',
            delay: 0.05,
            onComplete: () => { overlay.style.pointerEvents = 'none'; }
        });
    }
    // Reveal as soon as the DOM is parsed — waiting for window 'load' kept the
    // brown overlay up until every image finished downloading.
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', revealPage);
    else revealPage();

    // bfcache restore: hitting Back after a page transition would otherwise
    // bring the page back with the overlay still covering it.
    window.addEventListener('pageshow', (e) => {
        if (!e.persisted) return;
        if (typeof gsap !== 'undefined') gsap.set(overlay, { yPercent: -100 });
        else overlay.style.transform = 'translateY(-100%)';
        overlay.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        if (window._lenis) window._lenis.start();
    });
})();


document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // Lenis Smooth Scroll
    // =============================================
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    let lenis;
    if (typeof Lenis !== 'undefined' && !reducedMotion) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });
        // Lenis must be driven by exactly ONE clock: GSAP's ticker when
        // available (below), a plain rAF loop only as fallback.
        if (!hasGsap) {
            (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
        }
    }
    window._lenis = lenis;

    // =============================================
    // GSAP + ScrollTrigger
    // =============================================
    if (hasGsap) {
        gsap.registerPlugin(ScrollTrigger);
        // Stop mobile address-bar show/hide from re-triggering layout jumps
        ScrollTrigger.config({ ignoreMobileResize: true });
        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }
        // Trigger positions depend on image heights; re-measure after load
        window.addEventListener('load', () => ScrollTrigger.refresh());
        // Web fonts change text block heights — re-measure when they arrive.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => ScrollTrigger.refresh());
        }
    }

    // =============================================
    // Page Navigation with Transitions
    // =============================================
    const ptOverlay = document.getElementById('page-transition');

    function navigateTo(href) {
        if (!ptOverlay || typeof gsap === 'undefined') { window.location.href = href; return; }
        if (lenis) lenis.stop();
        const menu = document.getElementById('menu-overlay');
        if (menu) menu.classList.remove('active');
        document.body.style.overflow = '';
        ptOverlay.style.pointerEvents = 'auto';
        gsap.fromTo(ptOverlay, { yPercent: 100 }, {
            yPercent: 0,
            duration: 0.85,
            ease: 'power4.inOut',
            onComplete: () => { window.location.href = href; }
        });
    }
    window.navigateTo = navigateTo;

    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-nav]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        e.preventDefault();
        navigateTo(href);
    });

    // =============================================
    // Menu Overlay
    // =============================================
    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('close-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuOpenBtn && menuCloseBtn && menuOverlay) {
        menuOpenBtn.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        });
        menuCloseBtn.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
                if (lenis) lenis.start();
            }
        });
    }

    // =============================================
    // Contact Modal
    // =============================================
    const contactModal = document.getElementById('contact-modal');

    function openContact() {
        if (!contactModal) return;
        contactModal.classList.add('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.contact-panel', { x: '100%' }, { x: '0%', duration: 0.85, ease: 'power4.inOut' });
            gsap.from('.contact-backdrop', { autoAlpha: 0, duration: 0.5 });
            gsap.from('.contact-form-field', { autoAlpha: 0, y: 24, stagger: 0.07, delay: 0.35, duration: 0.7, ease: 'power3.out' });
            gsap.from('.contact-panel-heading', { autoAlpha: 0, y: 30, delay: 0.2, duration: 0.8, ease: 'power3.out' });
        }
    }

    function closeContact() {
        if (!contactModal) return;
        if (typeof gsap !== 'undefined') {
            gsap.to('.contact-panel', {
                x: '100%', duration: 0.7, ease: 'power4.inOut',
                onComplete: () => {
                    contactModal.classList.remove('active');
                    document.body.style.overflow = '';
                    if (lenis) lenis.start();
                }
            });
            gsap.to('.contact-backdrop', { autoAlpha: 0, duration: 0.4 });
        } else {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }
    }

    // Only hijack these clicks when there is a modal to open — pages that link
    // to contact.html instead must be left alone to navigate.
    if (contactModal) {
        document.querySelectorAll('.get-in-touch-btn, [data-contact]').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openContact(); }));
        document.querySelectorAll('.contact-close').forEach(btn => btn.addEventListener('click', closeContact));
        const backdrop = document.querySelector('.contact-backdrop');
        if (backdrop) backdrop.addEventListener('click', closeContact);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('active')) closeContact();
        });
    }

    // Floating label inputs
    document.querySelectorAll('.contact-input, .contact-textarea, .contact-select').forEach(input => {
        if (input.value && input.value.trim()) input.closest('.contact-form-field').classList.add('has-value');
        input.addEventListener('focus', () => input.closest('.contact-form-field').classList.add('focused'));
        input.addEventListener('blur', () => {
            input.closest('.contact-form-field').classList.remove('focused');
            input.closest('.contact-form-field').classList.toggle('has-value', input.value.trim().length > 0);
        });
    });

    // Contact form submit
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.contact-submit');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Message Sent ✓';
                btn.classList.add('sent');
                setTimeout(() => {
                    closeContact();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('sent');
                        btn.disabled = false;
                        contactForm.reset();
                        document.querySelectorAll('.contact-form-field').forEach(f => f.classList.remove('has-value', 'focused'));
                    }, 800);
                }, 1800);
            }, 1200);
        });
    }

    // =============================================
    // Back to Top
    // =============================================
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            if (lenis) lenis.scrollTo(0, { duration: 2 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // Scroll Progress Bar
    // =============================================
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        function updateProgress(scroll) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.transform = `scaleX(${Math.min(scroll / max, 1)})`;
        }
        if (lenis) lenis.on('scroll', ({ scroll }) => updateProgress(scroll));
        else window.addEventListener('scroll', () => updateProgress(window.scrollY));
    }

    // =============================================
    // Footer Parallax Margin
    // =============================================
    const siteMainWrapper = document.getElementById('site-main-wrapper');
    const siteFooter = document.getElementById('site-footer');
    const footerInFlow = window.matchMedia('(max-width: 768px)');
    function updateFooterMargin() {
        if (!siteMainWrapper || !siteFooter) return;
        // On phones the footer is position: static (normal flow) — no margin.
        const margin = footerInFlow.matches ? 0 : siteFooter.offsetHeight;
        const value = margin + 'px';
        if (siteMainWrapper.style.marginBottom !== value) {
            siteMainWrapper.style.marginBottom = value;
            // Content below shifted — ScrollTrigger must re-measure.
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }
    }
    window.addEventListener('load', updateFooterMargin);
    window.addEventListener('resize', updateFooterMargin);
    if (footerInFlow.addEventListener) footerInFlow.addEventListener('change', updateFooterMargin);
    updateFooterMargin();
    setTimeout(updateFooterMargin, 500);
    setTimeout(updateFooterMargin, 2000);

    // =============================================
    // Generic data-reveal animations
    // =============================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('[data-reveal]').forEach(el => {
            const dir = el.dataset.reveal || 'up';
            const delay = parseFloat(el.dataset.delay || 0);
            const from = { autoAlpha: 0 };
            if (dir === 'up') from.y = 50;
            else if (dir === 'down') from.y = -30;
            else if (dir === 'left') from.x = -60;
            else if (dir === 'right') from.x = 60;
            gsap.from(el, { ...from, duration: 1.0, delay, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
        });

        gsap.utils.toArray('[data-stagger]').forEach(container => {
            gsap.from(Array.from(container.children), {
                autoAlpha: 0, y: 40, duration: 0.9,
                stagger: parseFloat(container.dataset.stagger || 0.12),
                delay: parseFloat(container.dataset.delay || 0),
                ease: 'power3.out',
                scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        // Animated counters
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const obj = { val: 0 };
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(obj, {
                        val: target, duration: 2, ease: 'power2.out',
                        onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
                    });
                }
            });
        });
    }

});
