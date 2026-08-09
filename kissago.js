// kissago.js — preloader, gallery lightbox, portfolio filtering.
// Loads after common.js, which owns smooth scroll, page transitions and the menu.

// =============================================
// Preloader (home page only)
// =============================================
(function () {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloader-fill');
    const counter = document.getElementById('preloader-counter');
    if (!preloader || !fill || !counter) return;

    function finish() {
        preloader.classList.add('done');
        document.body.classList.remove('preloader-active');
        window._preloaderDone = true;
        document.dispatchEvent(new CustomEvent('preloader:done'));
        setTimeout(() => preloader.remove(), 700);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        preloader.remove();
        window._preloaderDone = true;
        return;
    }

    // Full brand moment on first arrival, quick pass when navigating back.
    let returning = false;
    try {
        returning = !!sessionStorage.getItem('kg-visited');
        sessionStorage.setItem('kg-visited', '1');
    } catch (e) { /* storage unavailable */ }

    document.body.classList.add('preloader-active');

    const duration = returning ? 600 : 2200;
    const start = performance.now();

    (function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const value = Math.round((1 - Math.pow(1 - t, 4)) * 100);
        counter.textContent = value;
        fill.style.width = value + '%';
        if (t < 1) requestAnimationFrame(tick);
        else setTimeout(finish, returning ? 150 : 380);
    })(performance.now());
})();

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // Hero title — entrance choreographed with the preloader exit
    // =============================================
    const heroTitle = document.querySelector('.kg-hero-title');
    if (heroTitle && typeof gsap !== 'undefined' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // .kg-hero clips, so the wider opening letter-spacing cannot spill.
        gsap.set(heroTitle, { autoAlpha: 0, y: 60, letterSpacing: '0.22em' });
        const play = () => gsap.to(heroTitle, {
            autoAlpha: 1, y: 0, letterSpacing: '0.06em',
            duration: 1.7, ease: 'power4.out'
        });
        if (window._preloaderDone || !document.getElementById('preloader')) play();
        else document.addEventListener('preloader:done', play, { once: true });
    }

    // =============================================
    // Hero drift — four full-bleed stills animating scale forever is real GPU
    // work on every frame, and it kept running long after the hero had been
    // scrolled past. Park it while it is off screen; the animation is on a
    // -delay cycle, so resuming picks up wherever it would have been anyway.
    // =============================================
    (function heroDrift() {
        const wall = document.querySelector('.kg-hero-wall');
        if (!wall || !('IntersectionObserver' in window)) return;
        new IntersectionObserver(([entry]) => {
            wall.classList.toggle('is-idle', !entry.isIntersecting);
        }, { rootMargin: '100px' }).observe(wall);
    })();

    // =============================================
    // Background video
    // Injected rather than inlined so the markup ships without a third-party
    // player: the hero mounts straight away, the CTA waits until it is near,
    // and reduced-motion visitors keep the still frames instead.
    // =============================================
    (function backgroundVideo() {
        const holders = Array.from(document.querySelectorAll('[data-video]'));
        if (!holders.length) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // The player is driven through YouTube's IFrame API rather than a bare
        // embed, because only the API tells us whether playback actually
        // started. Autoplay refusals (iOS), blocked embeds and unavailable
        // videos all end with the stills still showing instead of YouTube's
        // error panel.
        let ready = false;
        const pending = [];
        const prevHook = window.onYouTubeIframeAPIReady;

        window.onYouTubeIframeAPIReady = function () {
            if (typeof prevHook === 'function') prevHook();
            ready = true;
            pending.splice(0).forEach(fn => fn());
        };

        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            tag.async = true;
            document.head.appendChild(tag);
        }

        const whenReady = fn => (ready ? fn() : pending.push(fn));

        function mount(el) {
            if (el.dataset.mounted) return;
            el.dataset.mounted = '1';
            whenReady(() => {
                const id = el.dataset.video;
                const slot = document.createElement('div');
                el.appendChild(slot);
                new YT.Player(slot, {
                    videoId: id,
                    // No loop/playlist params: `loop` only works alongside
                    // `playlist`, which puts the player in playlist mode and
                    // makes it draw prev/pause/next buttons over the video.
                    // The ENDED handler below rewinds instead.
                    playerVars: {
                        autoplay: 1, mute: 1, controls: 0,
                        playsinline: 1, modestbranding: 1, rel: 0,
                        iv_load_policy: 3, fs: 0, disablekb: 1
                    },
                    events: {
                        onReady: e => {
                            el._player = e.target;
                            e.target.mute();
                            e.target.playVideo();
                        },
                        onStateChange: e => {
                            if (e.data === YT.PlayerState.PLAYING) el.classList.add('is-playing');
                            // Looping is done here rather than with loop=1.
                            if (e.data === YT.PlayerState.ENDED) { e.target.seekTo(0); e.target.playVideo(); }
                        },
                        onError: () => el.remove()
                    }
                });
            });
        }

        holders.forEach(el => {
            if (!('IntersectionObserver' in window)) { mount(el); return; }

            // One observer per holder handles both jobs: mount the player when
            // it is nearly on screen, then keep only the visible one running.
            // Two simultaneous players compete for Chrome's autoplay budget, so
            // the off-screen one has to yield or the second never starts.
            const io = new IntersectionObserver(entries => {
                const near = entries.some(e => e.isIntersecting);
                if (near) mount(el);
                const player = el._player;
                if (!player) return;
                try { near ? player.playVideo() : player.pauseVideo(); } catch (err) { /* player torn down */ }
            }, { rootMargin: '200px' });
            io.observe(el);

            // The hero is on screen at load; start it without waiting for the
            // observer's first callback.
            if ('videoEager' in el.dataset) mount(el);
        });
    })();

    // =============================================
    // Pinned service showcase
    // The template shipped this hard-coded to three steps; this drives any
    // number from whatever markup is present.
    // =============================================
    (function initShowcase() {
        const section = document.querySelector('.projects-showcase');
        if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        // Below 768px the CSS swaps in stacked cards instead.
        if (window.innerWidth <= 768 ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const texts = gsap.utils.toArray('.showcase-text', section);
        const reveals = gsap.utils.toArray('.showcase-img-reveal', section);
        const dots = gsap.utils.toArray('.step-dot', section);
        const fill = section.querySelector('.step-progress-fill');
        const n = Math.min(texts.length, reveals.length);
        if (n < 2) return;

        const imgOf = r => r.querySelector('.showcase-img');

        // Each step gets an identical slot on the timeline: HOLD units settled,
        // then TRANS units handing over to the next. Uniform slots are what let
        // the dots, the progress rail and the scroll position stay in step —
        // with relative positioning they drift apart as steps accumulate.
        const HOLD = 1, TRANS = 1.4, SLOT = HOLD + TRANS;
        const TOTAL = (n - 1) * SLOT + HOLD;

        // Turn a timeline position into a fractional step, so the rail can be
        // painted continuously: it rests on a dot while that step is settled,
        // then glides to the next across the transition. This is what makes the
        // indicator feel attached to the wheel instead of snapping between
        // states.
        function paintRail(t) {
            const k = Math.min(n - 1, Math.max(0, Math.floor(t / SLOT)));
            const local = t - k * SLOT;
            const frac = local <= HOLD ? k : k + Math.min(1, (local - HOLD) / TRANS);

            // Dots sit at i/(n-1) of the rail, so the fill maps the same way.
            // Painted with scaleY rather than a percentage height: this runs on
            // every scrubbed frame, and a height write forces a layout pass each
            // time, where a transform is handed straight to the compositor. The
            // fill is a plain solid bar, so the two are pixel-identical.
            if (fill) fill.style.transform = 'scaleY(' + (frac / (n - 1)) + ')';

            const current = Math.round(frac);
            dots.forEach((d, i) => {
                d.classList.toggle('active', i <= frac + 0.001);
                d.classList.toggle('is-current', i === current);
            });
        }

        // Resting state: first step shown, the rest parked below and clipped.
        texts.slice(1).forEach(t => {
            gsap.set(t, { autoAlpha: 0, y: 50 });
            gsap.set(t.querySelector('.showcase-divider'), { scaleX: 0, transformOrigin: 'left center' });
            gsap.set(t.querySelector('.showcase-cta'), { autoAlpha: 0, y: 15 });
        });
        gsap.set(reveals[0], { clipPath: 'inset(0% 0 0 0)' });
        gsap.set(imgOf(reveals[0]), { y: '0%' });
        reveals.slice(1).forEach(r => {
            gsap.set(r, { clipPath: 'inset(100% 0 0 0)' });
            gsap.set(imgOf(r), { y: '10%', scale: 1.06, transformOrigin: 'center center' });
        });
        paintRail(0);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                // ~90vh of scroll per transition keeps six steps from
                // turning into an endless pin.
                end: '+=' + ((n - 1) * 90) + '%',
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                // Short enough to read as direct response to the wheel; the
                // rail below is painted from the raw scroll position, with no
                // smoothing at all, so it tracks exactly.
                scrub: 0.45,
                onUpdate: self => paintRail(self.progress * TOTAL)
            }
        });

        for (let i = 1; i < n; i++) {
            const at = (i - 1) * SLOT + HOLD;
            tl.to(texts[i - 1], { autoAlpha: 0, y: -50, duration: TRANS * 0.7, ease: 'power2.in' }, at)
              .to(reveals[i], { clipPath: 'inset(0% 0 0 0)', duration: TRANS, ease: 'power2.inOut' }, at)
              .to(imgOf(reveals[i]), { y: '-5%', scale: 1, duration: TRANS, ease: 'power2.inOut' }, at)
              .to(imgOf(reveals[i - 1]), { y: '-10%', duration: TRANS, ease: 'power2.inOut' }, at)
              .to(texts[i], { autoAlpha: 1, y: 0, duration: TRANS * 0.7, ease: 'power2.out' }, at + TRANS * 0.35)
              .to(texts[i].querySelector('.showcase-divider'), { scaleX: 1, duration: 0.6 }, at + TRANS * 0.5)
              .to(texts[i].querySelector('.showcase-cta'), { autoAlpha: 1, y: 0, duration: 0.5 }, at + TRANS * 0.6);
        }
        // Hold the final step before the pin releases.
        tl.to({}, { duration: HOLD }, (n - 1) * SLOT);

        // First step's rule and link draw in when the section arrives.
        gsap.from(texts[0].querySelector('.showcase-divider'), {
            scaleX: 0, transformOrigin: 'left center', duration: 0.8, delay: 0.3, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' }
        });
        gsap.from(texts[0].querySelector('.showcase-cta'), {
            autoAlpha: 0, y: 15, duration: 0.6, delay: 0.5, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' }
        });
    })();

    // =============================================
    // Lightbox
    // =============================================
    const lightbox = document.getElementById('kg-lightbox');

    if (lightbox) {
        const lbImage = lightbox.querySelector('.kg-lb-stage img');
        const lbCount = lightbox.querySelector('.kg-lb-count');
        const lbStrip = lightbox.querySelector('.kg-lb-strip');
        let group = [];
        let index = 0;

        function visibleFiguresIn(grid) {
            return Array.from(grid.querySelectorAll('figure'))
                .filter(fig => !fig.classList.contains('is-hidden'));
        }

        // The filmstrip mirrors whatever set the lightbox was opened on, so a
        // filtered portfolio shows only the frames the filter left visible.
        function buildStrip() {
            if (!lbStrip) return;
            lbStrip.textContent = '';
            group.forEach((fig, i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'kg-lb-thumb';
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-label', `Photograph ${i + 1} of ${group.length}`);
                const thumb = document.createElement('img');
                // Reuse the grid's 900px file — it is already in cache.
                thumb.src = fig.querySelector('img').src;
                thumb.alt = '';
                thumb.decoding = 'async';
                btn.appendChild(thumb);
                btn.addEventListener('click', () => show(i));
                lbStrip.appendChild(btn);
            });
        }

        function syncStrip() {
            if (!lbStrip || !lbStrip.children.length) return;
            Array.from(lbStrip.children).forEach((el, k) => {
                el.classList.toggle('active', k === index);
                el.setAttribute('aria-selected', k === index ? 'true' : 'false');
            });
            const active = lbStrip.children[index];
            // Centre by hand rather than scrollIntoView, which would also scroll
            // the page behind the overlay.
            lbStrip.scrollTo({
                left: active.offsetLeft - (lbStrip.clientWidth - active.offsetWidth) / 2,
                behavior: 'smooth'
            });
        }

        function show(i) {
            if (!group.length) return;
            index = (i + group.length) % group.length;
            const fig = group[index];
            const img = fig.querySelector('img');
            // Grids load the 900px file; the lightbox upgrades to the 1200px one.
            lbImage.src = fig.dataset.full || img.currentSrc || img.src;
            lbImage.alt = img.alt || '';
            if (lbCount) lbCount.textContent = `${index + 1} / ${group.length}`;
            syncStrip();
        }

        function open(grid, fig) {
            group = visibleFiguresIn(grid);
            buildStrip();
            show(group.indexOf(fig));
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (window._lenis) window._lenis.stop();
        }

        function close() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            if (window._lenis) window._lenis.start();
            // Free the decoded bitmap; without this a long browse holds every
            // full-size frame in memory at once.
            setTimeout(() => { if (!lightbox.classList.contains('active')) lbImage.removeAttribute('src'); }, 400);
        }

        document.querySelectorAll('.kg-grid').forEach(grid => {
            grid.addEventListener('click', (e) => {
                const fig = e.target.closest('figure');
                if (fig) open(grid, fig);
            });
        });

        lightbox.querySelector('.kg-lb-close').addEventListener('click', close);
        lightbox.querySelector('.kg-lb-prev').addEventListener('click', () => show(index - 1));
        lightbox.querySelector('.kg-lb-next').addEventListener('click', () => show(index + 1));
        // Click the dark surround to dismiss — but not the photo, the arrows
        // or a filmstrip thumbnail.
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox ||
                e.target.classList.contains('kg-lb-stage') ||
                e.target.classList.contains('kg-lb-foot') ||
                e.target.classList.contains('kg-lb-strip')) close();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') show(index - 1);
            else if (e.key === 'ArrowRight') show(index + 1);
        });

        // Swipe on touch devices
        let touchX = null;
        lightbox.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 55) show(dx > 0 ? index - 1 : index + 1);
            touchX = null;
        }, { passive: true });
    }

    // =============================================
    // Portfolio filters
    // =============================================
    const filterBar = document.querySelector('.kg-filters');

    if (filterBar) {
        const grid = document.querySelector(filterBar.dataset.target || '.kg-grid');
        filterBar.addEventListener('click', (e) => {
            const btn = e.target.closest('.kg-filter');
            if (!btn || !grid) return;
            filterBar.querySelectorAll('.kg-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const want = btn.dataset.filter;
            grid.querySelectorAll('figure').forEach(fig => {
                fig.classList.toggle('is-hidden', want !== 'all' && fig.dataset.cat !== want);
            });
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        });
    }

    // =============================================
    // Process timeline — the rail draws in with the scroll and each marker
    // lights as the line reaches it.
    // =============================================
    (function processRail() {
        const wrap = document.querySelector('.kg-process');
        if (!wrap) return;
        const fill = wrap.querySelector('.kg-process-fill');
        const steps = gsap.utils ? gsap.utils.toArray('.kg-process-step', wrap)
                                 : Array.from(wrap.querySelectorAll('.kg-process-step'));
        if (!steps.length) return;

        // Markers sit at the left edge of each column, so step i is reached at
        // i/(n-1) of the rail. Without GSAP, or with motion reduced, show the
        // finished state rather than an empty rail.
        const settle = () => {
            if (fill) fill.style.transform = 'scaleX(1)';
            steps.forEach(s => s.classList.add('is-on'));
        };

        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            settle();
            return;
        }

        const n = steps.length;
        ScrollTrigger.create({
            trigger: wrap,
            start: 'top 78%',
            end: 'bottom 70%',
            scrub: 0.5,
            onUpdate: self => {
                const p = self.progress;
                // scaleX, not a percentage width: this fires on every scrubbed
                // frame and a width write would force a layout pass each time.
                if (fill) fill.style.transform = 'scaleX(' + p + ')';
                steps.forEach((s, i) => s.classList.toggle('is-on', p >= i / (n - 1) - 0.001));
            }
        });
    })();

    // =============================================
    // Contact form (front-end only; no backend wired up yet)
    // =============================================
    const kgForm = document.getElementById('kg-contact-form');
    if (kgForm) {
        kgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = kgForm.querySelector('button[type="submit"]');
            const status = kgForm.querySelector('.kg-form-status');
            const label = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Enquiry sent ✓';
                if (status) {
                    status.textContent = 'Thank you — we read every enquiry ourselves and will reply within two days.';
                    status.classList.add('show');
                }
                setTimeout(() => {
                    kgForm.reset();
                    btn.textContent = label;
                    btn.disabled = false;
                    if (status) status.classList.remove('show');
                }, 5000);
            }, 1100);
        });
    }
});
