/** The six things the studio shoots, driving the pinned showcase on the home
 *  page. The pin timeline reads its step count from this list, so adding a
 *  seventh entry is enough — the dots, the rail and the scroll length follow. */

export interface Service {
    title: string;
    blurb: string;
    /** File in `/assets/offer/`. */
    image: string;
}

export const SERVICES: Service[] = [
    {
        title: 'Weddings',
        blurb: 'Full-day coverage from the first cup of chai to the last song — ceremony, ritual, and every face in the room.',
        image: 'o01',
    },
    {
        title: 'Pre-Wedding',
        blurb: 'A relaxed half-day somewhere that means something to you. No stiff poses, just the two of you and good light.',
        image: 'o02',
    },
    {
        title: 'Engagements',
        blurb: 'Intimate ceremonies at home or in a hall, photographed quietly so the moment stays the moment.',
        image: 'o03',
    },
    {
        title: 'Bridal Portraits',
        blurb: 'Unhurried time set aside for the bride — jewellery, drape, hands, and the look before she walks out.',
        image: 'o04',
    },
    {
        title: 'Haldi & Mehendi',
        blurb: 'The loudest, most colourful days of the week, covered with the energy they deserve.',
        image: 'o05',
    },
    {
        title: 'Films',
        blurb: 'A cinematic edit cut from the same day, so you can hear the vows as well as see them.',
        image: 'o06',
    },
];

/** The four stages of working with the studio, drawn in along the rail on /about. */
export const PROCESS = [
    {
        num: '01',
        title: 'Say hello',
        text: 'Send us your dates and your city. We reply personally, usually within two days, and tell you straight away whether we are free.',
    },
    {
        num: '02',
        title: 'Meet properly',
        text: 'A call or a coffee. We want to know how you met, who is flying in, and which parts of the week you are most nervous about.',
    },
    {
        num: '03',
        title: 'The week itself',
        text: 'We arrive early, learn the family, and shoot quietly. You should forget we are there by the second ritual.',
    },
    {
        num: '04',
        title: 'Your archive',
        text: 'A curated gallery within weeks, the full edit after, and albums printed on paper that will outlast all of us.',
    },
];

/** The enquiry form's "What you need" options. */
export const ENQUIRY_TYPES = [
    'Wedding',
    'Pre-wedding',
    'Engagement',
    'Bridal portraits',
    'Haldi & mehendi',
    'Film + photography',
];
