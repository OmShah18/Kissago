/** The featured weddings. Each one drives both its card on /weddings and its
 *  own gallery page at /weddings/[slug]; the two share this single source so a
 *  frame count can never drift between the listing and the story. */

export interface Wedding {
    slug: string;
    /** Displayed with a real ampersand, so it carries the `&` unescaped. */
    name: string;
    /** Shown as the hero eyebrow, the story index suffix and the first meta chip. */
    category: string;
    meta: [string, string, string];
    story: string;
    /** Number of frames in `/assets/weddings/<slug>/`, numbered 01…n. */
    photos: number;
}

export const WEDDINGS: Wedding[] = [
    {
        slug: 'yashoda-jinand',
        name: 'Yashoda & Jinand',
        category: 'Pre-Wedding',
        meta: ['Pre-Wedding', 'Countryside Stables', 'Golden Hour'],
        story:
            'A morning at the riding grounds, where the horses were as much a part of the story as the two of them. Dust in the light, warm brass sun through the trees, and a quiet ease between two people who had clearly been laughing all week.',
        photos: 14,
    },
    {
        slug: 'soham-sakshi',
        name: 'Soham & Sakshi',
        category: 'Wedding',
        meta: ['Wedding', 'Maharashtrian Ceremony', 'Marigold Mandap'],
        story:
            'Rituals in full colour — the antarpat lowered, turmeric on skin, a wall of marigolds behind every vow. Sakshi in nauvari and green chuda, Soham grinning through every ceremony he was told to sit still for.',
        photos: 18,
    },
    {
        slug: 'harshita-himij',
        name: 'Harshita & Himij',
        category: 'Wedding',
        meta: ['Wedding', 'Evening Mandap', 'Grand Celebration'],
        story:
            'A wedding built around a single, enormous evening — florals lit from beneath, a red lehenga catching every lamp in the room, and family pressing in from all sides for the parts that mattered most.',
        photos: 15,
    },
    {
        slug: 'mruga-kunal',
        name: 'Mruga & Kunal',
        category: 'Couple Portraits',
        meta: ['Couple Portraits', 'Soft Daylight', 'Quiet Frames'],
        story:
            'No ceremony, no schedule — just an afternoon of standing close in flat, generous light. The kind of session where the best frame is always the one taken half a second after someone stops posing.',
        photos: 7,
    },
    {
        slug: 'manisha-francesco',
        name: 'Manisha & Francesco',
        category: 'Engagement',
        meta: ['Engagement', 'At Home', 'Two Cultures'],
        story:
            'An engagement held at home, surrounded by the people who matter most — heartfelt blessings, happy tears, and the beginning of a chapter rooted in two worlds coming together as one.',
        photos: 5,
    },
];

/** The three weddings carried on the home page, in that order. */
export const HOME_WEDDING_SLUGS = ['yashoda-jinand', 'soham-sakshi', 'harshita-himij'];

export function weddingBySlug(slug: string): Wedding | undefined {
    return WEDDINGS.find((w) => w.slug === slug);
}

/** The story that closes each gallery page — the next wedding in the list,
 *  wrapping back to the first at the end. */
export function nextWedding(slug: string): Wedding {
    const i = WEDDINGS.findIndex((w) => w.slug === slug);
    return WEDDINGS[(i + 1) % WEDDINGS.length];
}

/** `01.jpg` … `n.jpg`, zero-padded the way the files on disk are. */
export function galleryFrames(wedding: Wedding): string[] {
    return Array.from({ length: wedding.photos }, (_, i) => String(i + 1).padStart(2, '0'));
}
