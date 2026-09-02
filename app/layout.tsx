import type { Metadata, Viewport } from 'next';
import { SiteShell } from '@/components/site/SiteShell';
import { SITE } from '@/data/site';

import './styles/style.css';
import './styles/inner-style.css';
import './styles/kissago.css';
// New work, kept out of the three sheets above so they stay as ported.
import './styles/scroll.css';
import './styles/hero.css';
import './styles/featured.css';
import './styles/frames.css';
import './styles/collections.css';
import './styles/films.css';
import './styles/footer.css';
import 'lenis/dist/lenis.css';

/** Every family and weight the stylesheets name, plus Courier Prime. */
const FONTS_ALL =
    'https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Courier+Prime:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';

/** Fontshare, one request per family: it only honours the first `f[]` in a
 *  URL, so asking for both in one request silently drops the second. */
const FONT_BOSKA = 'https://api.fontshare.com/v2/css?f[]=boska@1,2&display=swap';
const FONT_SATOSHI = 'https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap';

/** Runs before the first paint. Keep it to one statement that cannot throw —
 *  it blocks the parser. The key matches `VISIT_KEY` in lib/preloader-state.ts
 *  and the class matches `RETURNING_CLASS`. */
const RETURNING_SCRIPT =
    "try{if(sessionStorage.getItem('kg-visited'))document.documentElement.classList.add('kg-returning')}catch(e){}";

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
        // The script at the foot of <head> puts `kg-returning` on this element
        // before React ever runs, so on a return visit the document the client
        // hydrates against already carries a class the server never wrote. That
        // is the whole point of it — the class has to land before the first
        // paint or the preloader flashes — but React sees the two disagree and
        // warns. Suppression here is shallow: it covers this element's own
        // attributes and nothing below it.
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
                {/* The showreel's player is fetched from YouTube once the hero
                    is on screen; warming the connection saves a round trip at
                    the moment it is needed. */}
                <link rel="preconnect" href="https://www.youtube.com" />
                {/* The films' posters. */}
                <link rel="preconnect" href="https://i.ytimg.com" />
                <link href={FONTS_ALL} rel="stylesheet" />
                <link href={FONTS_TEXT} rel="stylesheet" />
                <link href={FONT_BOSKA} rel="stylesheet" />
                <link href={FONT_SATOSHI} rel="stylesheet" />
                {/* The preloader is in the prerendered HTML, so on a return
                    visit it would paint for the frame or two before React can
                    take it away. This marks the document before the first
                    paint instead, and the stylesheet keeps it hidden. Inline
                    and blocking on purpose: a deferred script would be too
                    late to be worth running. */}
                <script dangerouslySetInnerHTML={{ __html: RETURNING_SCRIPT }} />
            </head>
            <body>
                <SiteShell>{children}</SiteShell>
            </body>
        </html>
    );
}
