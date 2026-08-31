'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { getLenis } from '@/lib/smooth-scroll';
import { TransitionLink } from './navigation';
import { Logo } from './Header';
import { ArrowUpIcon, InstagramIcon, MailIcon, PinterestIcon } from './icons';
import { FOOTER_LINKS, SITE } from '@/data/site';

/**
 * The footer is fixed behind the page above 768px, so the page above it has to
 * carry a bottom margin exactly its height for the parallax reveal to land. On
 * phones the footer returns to normal flow and the margin goes away.
 */
export function useFooterParallax(wrapperRef: React.RefObject<HTMLDivElement | null>) {
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const footerInFlow = window.matchMedia('(max-width: 768px)');

        // ScrollTrigger.refresh() re-measures every trigger on the page, so it
        // is far too heavy to run once per resize event: dragging a window edge
        // fires these continuously and each one stalls the frame. Coalesce to
        // one refresh after the resize settles.
        let refreshTimer: ReturnType<typeof setTimeout>;
        function refreshTriggersSoon() {
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
        }

        function updateFooterMargin() {
            const wrapper = wrapperRef.current;
            const footer = footerRef.current;
            if (!wrapper || !footer) return;
            const margin = footerInFlow.matches ? 0 : footer.offsetHeight;
            const value = margin + 'px';
            if (wrapper.style.marginBottom !== value) {
                wrapper.style.marginBottom = value;
                // Content below shifted — ScrollTrigger must re-measure.
                refreshTriggersSoon();
            }
        }

        // The offsetHeight read is a forced layout, so keep it off the resize
        // event itself.
        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateFooterMargin, 120);
        };

        window.addEventListener('load', updateFooterMargin);
        window.addEventListener('resize', onResize);
        footerInFlow.addEventListener('change', updateFooterMargin);

        // Images and web fonts settle after mount and change the footer's own
        // height; re-read a couple of times as they land.
        updateFooterMargin();
        const settle = [setTimeout(updateFooterMargin, 500), setTimeout(updateFooterMargin, 2000)];

        return () => {
            window.removeEventListener('load', updateFooterMargin);
            window.removeEventListener('resize', onResize);
            footerInFlow.removeEventListener('change', updateFooterMargin);
            clearTimeout(refreshTimer);
            clearTimeout(resizeTimer);
            settle.forEach(clearTimeout);
        };
    }, [wrapperRef]);

    return footerRef;
}

export function Footer({ footerRef }: { footerRef: React.RefObject<HTMLElement | null> }) {
    function backToTop(e: React.MouseEvent) {
        e.preventDefault();
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { duration: 2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <footer className="site-footer" id="site-footer" ref={footerRef}>
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-col">
                        <h4>Studio</h4>
                        <p>
                            {SITE.name}
                            <br />
                            {SITE.city}
                            <br />
                            {SITE.country}
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Enquiries</h4>
                        <p>
                            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                            <br />
                            {SITE.phone}
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Follow</h4>
                        <div className="footer-social-links">
                            <a
                                href={SITE.instagram}
                                className="footer-social-icon"
                                aria-label="Instagram"
                                target="_blank"
                                rel="noopener"
                            >
                                <InstagramIcon />
                            </a>
                            <a
                                href={SITE.pinterest}
                                className="footer-social-icon"
                                aria-label="Pinterest"
                                target="_blank"
                                rel="noopener"
                            >
                                <PinterestIcon />
                            </a>
                            <a href={`mailto:${SITE.email}`} className="footer-social-icon" aria-label="Email">
                                <MailIcon />
                            </a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Navigate</h4>
                        <div className="footer-nav-links">
                            {FOOTER_LINKS.map((link) => (
                                <TransitionLink
                                    key={link.href}
                                    href={link.href}
                                    className="footer-link"
                                    data-text={link.label}
                                >
                                    <span>{link.label}</span>
                                </TransitionLink>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <a href="#" className="back-to-top" id="back-to-top" aria-label="Back to top" onClick={backToTop}>
                        <ArrowUpIcon />
                    </a>
                    <Logo className="kg-logo footer-brand-logo" />
                    <div className="footer-legal">
                        <p>&copy; 2026 {SITE.name} All rights reserved.</p>
                        <p>Every frame, a story.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
