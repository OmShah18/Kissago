'use client';

import { useEffect, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { Gallery } from '@/components/site/Gallery';
import { portfolioFrame, wideClass } from '@/lib/frames';
import { PORTFOLIO, PORTFOLIO_FILTERS } from '@/data/portfolio';

/**
 * The full 54-frame portfolio with its category filter.
 *
 * Filtered-out frames are hidden rather than unmounted, so switching filters
 * never asks the browser to fetch and decode an image it already had.
 */
export function PortfolioGrid() {
    const [filter, setFilter] = useState<string>('all');

    // Hiding frames changes the page height, which every trigger below was
    // measured against.
    useEffect(() => {
        ScrollTrigger.refresh();
    }, [filter]);

    const figures = PORTFOLIO.map((frame, i) =>
        portfolioFrame(frame.id, {
            className: wideClass(i),
            hidden: filter !== 'all' && frame.cat !== filter,
        }),
    );

    return (
        <>
            <div className="kg-filters" data-target=".kg-grid">
                {PORTFOLIO_FILTERS.map((f) => (
                    <button
                        key={f.filter}
                        className={'kg-filter' + (filter === f.filter ? ' active' : '')}
                        data-filter={f.filter}
                        onClick={() => setFilter(f.filter)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            <Gallery figures={figures} />
        </>
    );
}
