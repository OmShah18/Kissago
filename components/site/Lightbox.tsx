'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { lockScroll, unlockScroll } from '@/lib/smooth-scroll';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

export interface Frame {
    /** The 900px file the grid shows. */
    src: string;
    /** The 1200px file the viewer upgrades to. */
    full: string;
    alt?: string;
}

interface LightboxValue {
    open: (frames: Frame[], index: number) => void;
}

const LightboxContext = createContext<LightboxValue | null>(null);

export function useLightbox() {
    const ctx = useContext(LightboxContext);
    if (!ctx) throw new Error('useLightbox must be used inside <LightboxProvider>');
    return ctx;
}

/**
 * The full-screen photograph viewer.
 *
 * A gallery hands it the exact set it was opened on, so a filtered portfolio
 * pages through only the frames the filter left visible — the filmstrip mirrors
 * that same set.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
    const [group, setGroup] = useState<Frame[]>([]);
    const [index, setIndex] = useState(0);
    const [active, setActive] = useState(false);
    const stripRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const open = useCallback((frames: Frame[], at: number) => {
        if (!frames.length) return;
        setGroup(frames);
        setIndex(Math.max(0, at));
        setActive(true);
        lockScroll();
    }, []);

    const close = useCallback(() => {
        setActive(false);
        unlockScroll();
    }, []);

    const step = useCallback((delta: number) => {
        setIndex((i) => (i + delta + group.length) % group.length);
    }, [group.length]);

    useEffect(() => {
        if (!active) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') step(-1);
            else if (e.key === 'ArrowRight') step(1);
        }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [active, close, step]);

    // Centre the active thumbnail by hand rather than with scrollIntoView,
    // which would also scroll the page behind the overlay.
    useEffect(() => {
        const strip = stripRef.current;
        const thumb = strip?.children[index] as HTMLElement | undefined;
        if (!strip || !thumb) return;
        strip.scrollTo({
            left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
            behavior: 'smooth',
        });
    }, [index, active]);

    // Free the decoded bitmap on close; without this a long browse holds every
    // full-size frame in memory at once.
    useEffect(() => {
        if (active) return;
        const timer = setTimeout(() => imgRef.current?.removeAttribute('src'), 400);
        return () => clearTimeout(timer);
    }, [active]);

    // Anything left locked when the viewer unmounts would freeze the page.
    useEffect(() => () => unlockScroll(), []);

    const touchX = useRef<number | null>(null);

    const current = group[index];
    const value = useMemo(() => ({ open }), [open]);

    return (
        <LightboxContext.Provider value={value}>
            {children}

            <div
                className={'kg-lightbox' + (active ? ' active' : '')}
                id="kg-lightbox"
                role="dialog"
                aria-modal="true"
                aria-label="Photograph viewer"
                // Click the dark surround to dismiss — but not the photo, the
                // arrows or a filmstrip thumbnail.
                onClick={(e) => {
                    const t = e.target as HTMLElement;
                    if (
                        t === e.currentTarget ||
                        t.classList.contains('kg-lb-stage') ||
                        t.classList.contains('kg-lb-foot') ||
                        t.classList.contains('kg-lb-strip')
                    ) {
                        close();
                    }
                }}
                onTouchStart={(e) => {
                    touchX.current = e.changedTouches[0].clientX;
                }}
                onTouchEnd={(e) => {
                    if (touchX.current === null) return;
                    const dx = e.changedTouches[0].clientX - touchX.current;
                    if (Math.abs(dx) > 55) step(dx > 0 ? -1 : 1);
                    touchX.current = null;
                }}
            >
                <button className="kg-lb-btn kg-lb-close" aria-label="Close" onClick={close}>
                    <CloseIcon />
                </button>

                <div className="kg-lb-stage">
                    <button className="kg-lb-btn kg-lb-prev" aria-label="Previous" onClick={() => step(-1)}>
                        <ChevronLeftIcon />
                    </button>
                    <img ref={imgRef} src={current?.full} alt={current?.alt || ''} />
                    <button className="kg-lb-btn kg-lb-next" aria-label="Next" onClick={() => step(1)}>
                        <ChevronRightIcon />
                    </button>
                </div>

                <div className="kg-lb-foot">
                    <div className="kg-lb-count">{group.length ? `${index + 1} / ${group.length}` : ''}</div>
                    <div className="kg-lb-strip" ref={stripRef} role="tablist" aria-label="Photographs in this gallery">
                        {group.map((frame, i) => (
                            <button
                                key={frame.full}
                                type="button"
                                className={'kg-lb-thumb' + (i === index ? ' active' : '')}
                                role="tab"
                                aria-selected={i === index}
                                aria-label={`Photograph ${i + 1} of ${group.length}`}
                                onClick={() => setIndex(i)}
                            >
                                {/* Reuse the grid's 900px file — it is already in cache. */}
                                <img src={frame.src} alt="" decoding="async" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </LightboxContext.Provider>
    );
}
