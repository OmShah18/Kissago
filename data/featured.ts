/**
 * Layouts for the featured weddings section.
 *
 * Each wedding gets three portrait frames scattered across the page rather than
 * a row of equal cards. The numbers are all in `vw`, so the composition holds
 * its proportions at any width — a frame's height follows from its width and
 * the shared portrait ratio, which is why only the width is given.
 *
 * `speed` is how much the frame drifts against the scroll. Three different
 * values are what separate the frames as you pass them; without it they read as
 * one flat collage.
 */

export interface FeaturedFrame {
    /** Distance from the left edge, in vw. */
    x: number;
    /** Width, in vw. Height is derived from FRAME_RATIO. */
    w: number;
    /** Offset from the top of its block, in vw. Negative lifts it above. */
    y: number;
    /** Negative lags behind the scroll, positive runs ahead of it. */
    speed: number;
}

export interface FeaturedLayout {
    /** Block height in vw, before the gap below it. */
    height: number;
    frames: [FeaturedFrame, FeaturedFrame, FeaturedFrame];
}

/** Every frame is this ratio — width ÷ height. */
export const FRAME_RATIO = 0.787;

/** The gap under each block, in vw. Wide enough that a block's trailing frame,
 *  which hangs below its own height, clears the next block's leading one. */
export const BLOCK_GAP = 16;

/** Applied in order and reused if there are more weddings than layouts. */
export const FEATURED_LAYOUTS: FeaturedLayout[] = [
    {
        height: 79.03,
        frames: [
            { x: 42.3, w: 39.53, y: 0, speed: -0.08 },
            { x: 18.17, w: 29.59, y: 41.41, speed: -0.03 },
            { x: 58.39, w: 15.39, y: 67.18, speed: 0.035 },
        ],
    },
    {
        height: 91.11,
        frames: [
            { x: 26.22, w: 47.57, y: 0, speed: -0.08 },
            { x: 58.39, w: 23.44, y: 57.13, speed: -0.03 },
            { x: 18.17, w: 15.39, y: 79.27, speed: 0.035 },
        ],
    },
    {
        height: 62.64,
        frames: [
            { x: 18.17, w: 39.53, y: 0, speed: -0.08 },
            { x: 58.39, w: 23.44, y: -13.34, speed: -0.03 },
            { x: 53.86, w: 18.05, y: 46.73, speed: 0.035 },
        ],
    },
    {
        height: 79.72,
        frames: [
            { x: 51.29, w: 31.48, y: 16.02, speed: -0.08 },
            { x: 26.22, w: 15.39, y: 0, speed: -0.03 },
            { x: 18.17, w: 30.54, y: 40.9, speed: 0.035 },
        ],
    },
    {
        height: 91.6,
        frames: [
            { x: 18.17, w: 39.53, y: 0, speed: -0.08 },
            { x: 52.55, w: 29.28, y: 43.33, speed: -0.03 },
            { x: 26.22, w: 15.39, y: 71.99, speed: 0.035 },
        ],
    },
];

export function layoutFor(index: number): FeaturedLayout {
    return FEATURED_LAYOUTS[index % FEATURED_LAYOUTS.length];
}

/** The three frames of a wedding's set — its first, second and third file. */
export const FEATURED_FRAME_FILES = ['01', '02', '03'];

/** Names read as "First & Second"; the ampersand is set on its own so it can
 *  hold the centre while the two names sit against the outer edges. */
export function splitName(name: string): [string, string] {
    const parts = name.split(/\s*&\s*/);
    return [parts[0] ?? name, parts[1] ?? ''];
}
