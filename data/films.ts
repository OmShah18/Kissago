/**
 * The films on the home page.
 *
 * All three are real uploads on the studio's channel, and all three belong to
 * weddings that already have a gallery here — so each one can open the set it
 * was cut from rather than being a video that leads nowhere.
 *
 * `id` is the YouTube id. The poster is derived from it rather than stored: a
 * still of the film's own first frame is always the right image for it, and
 * there is nothing to keep in step when a film is swapped.
 */

export interface Film {
    /** YouTube video id. */
    id: string;
    /** Whose wedding it is. */
    couple: string;
    /** What the film is — teaser, full film, engagement. */
    kind: string;
    /** The gallery it was cut from, in `data/weddings.ts`. */
    slug: string;
}

export const FILMS: Film[] = [
    { id: 'nMLsEuQAlas', couple: 'Mruga & Kunal', kind: 'Wedding Film', slug: 'mruga-kunal' },
    { id: 'kHfAgfChSsg', couple: 'Harshita & Himij', kind: 'Wedding Teaser', slug: 'harshita-himij' },
    { id: 'GRhXgkvwzzo', couple: 'Manisha & Francesco', kind: 'Engagement Film', slug: 'manisha-francesco' },
];

/** 1280x720, so it fills a 16:9 frame at any width the section uses. Every
 *  film on the channel has one; `hqdefault` would always exist but is 4:3 and
 *  arrives pillarboxed. */
export function filmPoster(id: string): string {
    return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

/** Autoplay because the visitor has just pressed play, and `rel=0` so the
 *  panel at the end stays on this channel. */
export function filmEmbed(id: string): string {
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}
