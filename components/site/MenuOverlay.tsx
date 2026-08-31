'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation, TransitionLink } from './navigation';
import { Logo } from './Header';
import { InstagramIcon, MailIcon, WhatsAppIcon } from './icons';
import { MENU_IMAGES, MENU_LINKS, SITE } from '@/data/site';

export function MenuOverlay() {
    const { menuOpen, closeMenu } = useNavigation();
    const pathname = usePathname();

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeMenu();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [menuOpen, closeMenu]);

    return (
        <div className={'menu-overlay' + (menuOpen ? ' active' : '')} id="menu-overlay">
            <div className="menu-header">
                <Logo className="kg-logo kg-logo-sm" variant="green" />
                <div className="menu-header-right">
                    <TransitionLink href="/contact" className="get-in-touch-btn">
                        <span>
                            GET IN TOUCH <span className="arrow">&rarr;</span>
                        </span>
                    </TransitionLink>
                    <div
                        className="close-btn"
                        id="close-btn"
                        aria-label="Close"
                        role="button"
                        tabIndex={0}
                        onClick={closeMenu}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                closeMenu();
                            }
                        }}
                    >
                        <span className="line line-1" />
                        <span className="line line-2" />
                    </div>
                </div>
            </div>

            <div className="menu-body">
                {/* Every link's stills are in the DOM at once; the CSS reveals
                    the `.{target}-img` trio belonging to whichever is hovered. */}
                <div className="menu-images">
                    {MENU_IMAGES.map((set) =>
                        set.srcs.map((src, i) => (
                            <img
                                key={src}
                                className={`hover-img img-${i + 1} ${set.target}-img`}
                                src={src}
                                alt=""
                                loading="lazy"
                                decoding="async"
                            />
                        )),
                    )}
                </div>

                <nav className="menu-nav">
                    {MENU_LINKS.map((link) => {
                        const isCurrent = link.href === pathname;
                        // The link for the page you are already on closes the
                        // menu instead of navigating.
                        return isCurrent ? (
                            <a
                                key={link.href}
                                href={link.href}
                                className="menu-link"
                                data-target={link.target}
                                data-text={link.label}
                                aria-label={link.ariaLabel}
                                aria-current="page"
                                onClick={(e) => {
                                    e.preventDefault();
                                    closeMenu();
                                }}
                            >
                                <span>{link.label}</span>
                            </a>
                        ) : (
                            <TransitionLink
                                key={link.href}
                                href={link.href}
                                className="menu-link"
                                data-target={link.target}
                                data-text={link.label}
                                aria-label={link.ariaLabel}
                            >
                                <span>{link.label}</span>
                            </TransitionLink>
                        );
                    })}
                </nav>
            </div>

            <div className="menu-footer">
                <div className="social-links">
                    <a
                        href={SITE.instagram}
                        className="social-icon"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noopener"
                    >
                        <InstagramIcon />
                    </a>
                    <a href={`mailto:${SITE.email}`} className="social-icon" aria-label="Email">
                        <MailIcon />
                    </a>
                    <a href={SITE.whatsapp} className="social-icon" aria-label="WhatsApp" target="_blank" rel="noopener">
                        <WhatsAppIcon />
                    </a>
                </div>
            </div>
        </div>
    );
}
