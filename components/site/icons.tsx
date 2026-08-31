/** The site's line icons, drawn at 24×24 on a 1.4–1.5 stroke so they sit at the
 *  same weight as the type around them. */

const stroke = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

export function InstagramIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} {...stroke} strokeWidth={1.5}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}

export function MailIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} {...stroke} strokeWidth={1.5}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 6L2 7" />
        </svg>
    );
}

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} {...stroke} strokeWidth={1.5}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}

export function PinterestIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} {...stroke} strokeWidth={1.5}>
            <line x1="12" y1="12" x2="12" y2="22" />
            <path d="M12 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 2.24-1.76 4-4 4-1.7 0-3 1.3-3 3" />
        </svg>
    );
}

export function ArrowUpIcon({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} {...stroke} strokeWidth={1.5}>
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
        </svg>
    );
}

export function CloseIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export function ChevronLeftIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} {...stroke} strokeWidth={1.4}>
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

export function ChevronRightIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} {...stroke} strokeWidth={1.4}>
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}
