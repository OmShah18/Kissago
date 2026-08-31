import type { NextConfig } from 'next';
import { WEDDINGS } from './data/weddings';

const nextConfig: NextConfig = {
    // The gallery ships pre-optimised JPEGs (a 900px grid file and a 1200px
    // lightbox file per frame), so the built-in optimiser has nothing to add —
    // plain <img> tags are used throughout and no remote patterns are needed.
    reactStrictMode: true,

    /** The site was a set of .html files before this. Anything already linked
     *  or indexed under the old paths lands on the route that replaced it. */
    async redirects() {
        const pages = [
            ['/index.html', '/'],
            ['/about.html', '/about'],
            ['/contact.html', '/contact'],
            ['/portfolio.html', '/portfolio'],
            ['/weddings.html', '/weddings'],
            ...WEDDINGS.map((w) => [`/weddings/${w.slug}.html`, `/weddings/${w.slug}`]),
        ];
        return pages.map(([source, destination]) => ({ source, destination, permanent: true }));
    },
};

export default nextConfig;
