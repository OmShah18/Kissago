import type { GalleryFigure } from '@/components/site/Gallery';

/** Every photograph exists twice on disk: a 900px file for the grid and a
 *  1200px `-lg` file the viewer upgrades to. */
function pair(path: string, extras: Partial<GalleryFigure> = {}): GalleryFigure {
    return { src: `${path}.jpg`, full: `${path}-lg.jpg`, ...extras };
}

export function portfolioFrame(id: string, extras?: Partial<GalleryFigure>): GalleryFigure {
    return pair(`/assets/portfolio/${id}`, extras);
}

/** `p01` … `p12` and the like, for the sampler grids on the other pages. */
export function portfolioRange(from: number, to: number): GalleryFigure[] {
    const frames: GalleryFigure[] = [];
    for (let n = from; n <= to; n++) frames.push(portfolioFrame('p' + String(n).padStart(2, '0')));
    return frames;
}

export function weddingFrame(slug: string, frame: string, extras?: Partial<GalleryFigure>): GalleryFigure {
    return pair(`/assets/weddings/${slug}/${frame}`, extras);
}

/** Every sixth frame runs full width, alternating which side it is pulled to.
 *  Short sets stay on the plain grid — a wide frame in a five-image gallery
 *  leaves the row beneath it stranded. */
export function wideClass(index: number, enabled = true): string {
    if (!enabled || index % 6 !== 0) return '';
    return index % 12 === 0 ? 'kg-wide' : 'kg-wide kg-wide-r';
}

/** Below this many frames, a gallery skips the wide cadence entirely. */
export const WIDE_MIN_FRAMES = 8;
