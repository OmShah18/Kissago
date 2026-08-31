'use client';

import { useNavigation, TransitionLink } from './navigation';
import { SITE } from '@/data/site';

export function Logo({
    className = 'kg-logo',
    variant = 'cream',
}: {
    className?: string;
    variant?: 'cream' | 'green';
}) {
    return (
        <TransitionLink href="/" className={className} aria-label={`${SITE.name} — home`}>
            <img src={`/assets/logo/kissago-${variant}.png`} alt={SITE.name} />
        </TransitionLink>
    );
}

/**
 * `solid` gives the header its own cream bar and the small green wordmark.
 * Pages that open on a full-bleed still let the transparent header sit over the
 * image; a page without one — the enquiry page — would otherwise have a cream
 * logo on a cream ground.
 */
export function Header({ solid = false }: { solid?: boolean }) {
    const { openMenu } = useNavigation();

    return (
        <header className={solid ? 'header header-solid' : 'header'}>
            {solid ? <Logo className="kg-logo kg-logo-sm" variant="green" /> : <Logo />}
            <div
                className="menu-btn"
                id="menu-open-btn"
                aria-label="Menu"
                role="button"
                tabIndex={0}
                onClick={openMenu}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openMenu();
                    }
                }}
            >
                <span className="line" />
                <span className="line" />
            </div>
        </header>
    );
}
