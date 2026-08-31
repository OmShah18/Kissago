'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { getLenis, startSmoothScroll } from '@/lib/smooth-scroll';
import { NavigationProvider, useNavigation } from './navigation';
import { LightboxProvider } from './Lightbox';
import { Header, Logo } from './Header';
import { MenuOverlay } from './MenuOverlay';
import { Footer, useFooterParallax } from './Footer';
import { PageEffects } from './PageEffects';
import { Preloader } from './Preloader';

/** The chrome every route sits inside: the transition curtain, the header and
 *  menu, the parallax footer and the photograph viewer. */
export function SiteShell({ children }: { children: ReactNode }) {
    return (
        <NavigationProvider>
            <LightboxProvider>
                <Shell>{children}</Shell>
            </LightboxProvider>
        </NavigationProvider>
    );
}

function Shell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { overlayRef, covering } = useNavigation();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const footerRef = useFooterParallax(wrapperRef);
    const isHome = pathname === '/';
    // Every route but the enquiry page opens on a full-bleed still that the
    // transparent header sits over.
    const solidHeader = pathname === '/contact';

    useEffect(() => startSmoothScroll(), []);

    // Lift the curtain once the new route has painted. It is already covering
    // the viewport at this point — `navigate()` slid it down before pushing —
    // so this is the second half of one continuous movement.
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay || !covering.current) return;

        const lenis = getLenis();
        // Land at the top of the new page behind the curtain, not part-way down
        // where the previous one was left.
        lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);

        gsap.to(overlay, {
            yPercent: -100,
            duration: 1.0,
            ease: 'power4.inOut',
            delay: 0.05,
            onComplete: () => {
                overlay.style.pointerEvents = 'none';
                covering.current = false;
                lenis?.start();
            },
        });
    }, [pathname, overlayRef, covering]);

    return (
        <>
            {isHome && <Preloader />}

            <div
                className="page-transition"
                id="page-transition"
                ref={overlayRef}
                style={{ transform: 'translateY(-100%)', pointerEvents: 'none' }}
            >
                <Logo />
            </div>

            {/* Above 768px the footer is fixed behind this block, which slides
                away to reveal it — hence the wrapper's own background and lift. */}
            <div
                className={isHome ? 'site-main-wrapper' : 'inner-page-wrapper site-main-wrapper'}
                id="site-main-wrapper"
                ref={wrapperRef}
            >
                <Header solid={solidHeader} />
                <MenuOverlay />
                {children}
            </div>

            <Footer footerRef={footerRef} />

            <PageEffects key={pathname} />
        </>
    );
}
