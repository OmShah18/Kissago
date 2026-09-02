/** Studio-wide strings and the primary navigation, shared by the header,
 *  the menu overlay and the footer. */

export const SITE = {
    name: 'Kissago Art Co.',
    tagline: 'Wedding Photography',
    email: 'hello@kissago.art',
    phone: '+91 98XXX XXXXX',
    instagram: 'https://instagram.com/',
    instagramHandle: '@kissago.artco',
    pinterest: 'https://pinterest.com/',
    youtube: 'https://www.youtube.com/@kissagoweddings',
    whatsapp: 'https://wa.me/',
    city: 'Pune, Maharashtra',
    country: 'India',
} as const;

/** `target` doubles as the key for the menu's hover imagery — the overlay
 *  shows the three `.{target}-img` stills while its link is hovered. */
export const MENU_LINKS = [
    { href: '/', label: 'HOME', target: 'home', ariaLabel: 'Home' },
    { href: '/weddings', label: 'WEDDINGS', target: 'weddings', ariaLabel: 'Featured Weddings' },
    { href: '/portfolio', label: 'PORTFOLIO', target: 'portfolio', ariaLabel: 'Portfolio' },
    { href: '/about', label: 'ABOUT', target: 'about', ariaLabel: 'About' },
] as const;

export const FOOTER_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/weddings', label: 'Featured Weddings' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
] as const;

/** The three stills revealed behind each menu link on hover. */
export const MENU_IMAGES = [
    { target: 'home', srcs: ['/assets/home/e01.jpg', '/assets/home/e03.jpg', '/assets/home/e05.jpg'] },
    {
        target: 'weddings',
        srcs: [
            '/assets/weddings/soham-sakshi/01.jpg',
            '/assets/weddings/yashoda-jinand/01.jpg',
            '/assets/weddings/harshita-himij/01.jpg',
        ],
    },
    { target: 'portfolio', srcs: ['/assets/portfolio/p03.jpg', '/assets/portfolio/p09.jpg', '/assets/portfolio/p16.jpg'] },
    { target: 'about', srcs: ['/assets/about/a01.jpg', '/assets/about/a02.jpg', '/assets/about/a03.jpg'] },
] as const;

export const SHOWREEL_ID = 'QZ2c1hm1HWY';
export const WEDDINGS_REEL_ID = '87joC0z-sao';
