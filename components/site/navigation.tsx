'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import { getLenis } from '@/lib/smooth-scroll';

interface NavigationValue {
    /** Slides the brand overlay down over the page, then changes route. */
    navigate: (href: string) => void;
    menuOpen: boolean;
    openMenu: () => void;
    closeMenu: () => void;
    /** The overlay element, so the shell can reveal it when the route lands. */
    overlayRef: React.RefObject<HTMLDivElement | null>;
    /** Held true from the moment a transition starts until the overlay lifts. */
    covering: React.RefObject<boolean>;
}

const NavigationContext = createContext<NavigationValue | null>(null);

export function useNavigation() {
    const ctx = useContext(NavigationContext);
    if (!ctx) throw new Error('useNavigation must be used inside <NavigationProvider>');
    return ctx;
}

export function NavigationProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const overlayRef = useRef<HTMLDivElement>(null);
    const covering = useRef(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const openMenu = useCallback(() => {
        setMenuOpen(true);
        document.body.style.overflow = 'hidden';
        getLenis()?.stop();
    }, []);

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
        document.body.style.overflow = '';
        getLenis()?.start();
    }, []);

    const navigate = useCallback(
        (href: string) => {
            const overlay = overlayRef.current;
            if (!overlay || href === pathname) {
                if (href !== pathname) router.push(href);
                setMenuOpen(false);
                return;
            }

            getLenis()?.stop();
            setMenuOpen(false);
            document.body.style.overflow = '';
            covering.current = true;
            overlay.style.pointerEvents = 'auto';

            gsap.fromTo(
                overlay,
                { yPercent: 100 },
                {
                    yPercent: 0,
                    duration: 0.85,
                    ease: 'power4.inOut',
                    onComplete: () => router.push(href),
                },
            );
        },
        [pathname, router],
    );

    const value = useMemo(
        () => ({ navigate, menuOpen, openMenu, closeMenu, overlayRef, covering }),
        [navigate, menuOpen, openMenu, closeMenu],
    );

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

/**
 * An internal link that plays the brand transition before the route changes.
 *
 * Replaces the old global `[data-nav]` click handler: the same links, but the
 * intent now sits on the element instead of in a document-level listener, and
 * Next still prefetches the destination through `next/link` underneath.
 */
export function TransitionLink({
    href,
    children,
    onNavigate,
    ...rest
}: {
    href: string;
    children: ReactNode;
    onNavigate?: () => void;
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'onClick'>) {
    const { navigate } = useNavigation();

    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
        // Leave modified clicks to the browser — they open a new tab or window.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate?.();
        navigate(href);
    }

    return (
        <Link href={href} onClick={handleClick} {...rest}>
            {children}
        </Link>
    );
}
