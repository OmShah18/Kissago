import type { Metadata, Viewport } from 'next';
import { SiteShell } from '@/components/site/SiteShell';
import { SITE } from '@/data/site';

import './styles/style.css';
import './styles/inner-style.css';
import './styles/kissago.css';
// New work, kept out of the three sheets above so they stay as ported.
import './styles/hero.css';
import './styles/featured.css';
import './styles/frames.css';
import './styles/collections.css';
import 'lenis/dist/lenis.css';

/** Every family and weight the stylesheets name. */
const FONTS_ALL =
    'https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';

/** The two text families again, on their own. This looks redundant against the
 *  request above — it asks for the same faces — but the single request did not
 *  always deliver them, and losing these families drops the site to fallback
 *  serifs that render far heavier than Cormorant Garamond. It used to be an
 *  `@import` at the top of style.css; Turbopack strips remote `@import` rules
 *  out of bundled CSS, so it lives here now. */
const FONTS_TEXT =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';

export const metadata: Metadata = {
    title: {
        default: `${SITE.name} — Wedding Photography`,
        template: `%s — ${SITE.name}`,
    },
    description:
        'Kissago Art Co. is a wedding photography studio based in Pune, Maharashtra, photographing weddings, pre-weddings and engagements across India.',
    icons: { icon: '/assets/logo/favicon.png' },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                {/* The showreel's player is fetched from YouTube once the hero
                    is on screen; warming the connection saves a round trip at
                    the moment it is needed. */}
                <link rel="preconnect" href="https://www.youtube.com" />
                <link href={FONTS_ALL} rel="stylesheet" />
                <link href={FONTS_TEXT} rel="stylesheet" />
            </head>
            <body>
                <SiteShell>{children}</SiteShell>
            </body>
        </html>
    );
}
