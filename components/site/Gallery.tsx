'use client';

import { useLightbox, type Frame } from './Lightbox';

export interface GalleryFigure extends Frame {
    /** `kg-wide` / `kg-wide kg-wide-r` for the frames that break the grid. */
    className?: string;
    /** Set by the portfolio filter; the frame stays mounted but is hidden, so
     *  toggling a filter never re-decodes an image that comes back. */
    hidden?: boolean;
}

/**
 * A photograph grid. Clicking any frame opens the viewer on the set of frames
 * that are actually visible, which is what keeps a filtered portfolio paging
 * through its filtered selection rather than all 54.
 */
export function Gallery({
    figures,
    className = 'kg-grid',
}: {
    figures: GalleryFigure[];
    className?: string;
}) {
    const { open } = useLightbox();
    const visible = figures.filter((f) => !f.hidden);

    return (
        <div className={className}>
            {figures.map((fig) => (
                <figure
                    key={fig.full}
                    className={[fig.className, fig.hidden ? 'is-hidden' : ''].filter(Boolean).join(' ') || undefined}
                    // The viewer is handed the frame directly; this is here so
                    // the full-size file a frame belongs to stays readable in
                    // the markup.
                    data-full={fig.full}
                    onClick={() => open(visible, visible.indexOf(fig))}
                >
                    <img
                        src={fig.src}
                        width={720}
                        height={900}
                        alt={fig.alt || ''}
                        loading="lazy"
                        decoding="async"
                    />
                </figure>
            ))}
        </div>
    );
}
