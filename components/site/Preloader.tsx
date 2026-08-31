'use client';

import { useEffect, useRef, useState } from 'react';
import { markPreloaderDone, resetPreloader } from '@/lib/preloader-state';
import { SITE } from '@/data/site';

/**
 * The count does not run through every number — it steps through eight of
 * them, each digit column rolling to its next face. Landing on a handful of
 * uneven values reads like something genuinely being measured, where a smooth
 * 0–99 sweep reads like a progress bar pretending to be one.
 *
 * Paired left-to-right these are 01, 18, 29, 42, 54, 66, 85, 99.
 */
const TENS = [0, 1, 2, 4, 5, 6, 8, 9];
const UNITS = [1, 8, 9, 2, 4, 6, 5, 9];
const STEPS = TENS.length;

/**
 * The brand moment on the home page: the wordmark drawing itself in between
 * the count and its unit, on the studio's cream ground.
 *
 * Full length on first arrival, a quick pass when navigating back — the visit
 * is remembered for the tab, so a reload during the same session does not sit
 * through the whole thing again.
 */
export function Preloader() {
    const [step, setStep] = useState(0);
    const [fill, setFill] = useState(0);
    const [done, setDone] = useState(false);
    const [gone, setGone] = useState(false);
    const frame = useRef<number>(0);

    useEffect(() => {
        resetPreloader();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setGone(true);
            markPreloaderDone();
            return;
        }

        let returning = false;
        try {
            returning = !!sessionStorage.getItem('kg-visited');
            sessionStorage.setItem('kg-visited', '1');
        } catch {
            /* storage unavailable */
        }

        document.body.classList.add('preloader-active');

        const duration = returning ? 600 : 2200;
        const start = performance.now();
        let finishTimer: ReturnType<typeof setTimeout>;
        let removeTimer: ReturnType<typeof setTimeout>;

        function tick(now: number) {
            const t = Math.min((now - start) / duration, 1);
            // Only a light ease. The quartic the old progress bar used reached
            // full a third of the way in and then sat there, which reads as a
            // stall; this keeps the count moving until it actually lands.
            const eased = 1 - Math.pow(1 - t, 1.6);
            // The wordmark fills continuously while the count steps, so the two
            // stay legibly in sync without the digits flickering every frame.
            setFill(eased * 100);
            setStep(Math.min(STEPS - 1, Math.floor(eased * STEPS)));

            if (t < 1) {
                frame.current = requestAnimationFrame(tick);
                return;
            }
            finishTimer = setTimeout(
                () => {
                    setDone(true);
                    document.body.classList.remove('preloader-active');
                    markPreloaderDone();
                    // Matches the 0.6s fade in the stylesheet, plus a beat.
                    removeTimer = setTimeout(() => setGone(true), 700);
                },
                returning ? 150 : 380,
            );
        }
        frame.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame.current);
            clearTimeout(finishTimer);
            clearTimeout(removeTimer);
            document.body.classList.remove('preloader-active');
            // Leaving the route mid-count must not strand the hero waiting for
            // a signal that will never come.
            markPreloaderDone();
        };
    }, []);

    if (gone) return null;

    return (
        <div className={'preloader kg-pre' + (done ? ' done' : '')} id="preloader">
            <div className="kg-pre-inner">
                <div className="kg-pre-count" aria-hidden="true">
                    <Digit faces={TENS} step={step} />
                    <Digit faces={UNITS} step={step} />
                </div>
                <div className="kg-pre-pct" aria-hidden="true">
                    %
                </div>
            </div>

            <div className="kg-pre-mark">
                <div className="kg-pre-mark-ghost">
                    <img src="/assets/logo/kissago-green.png" alt="" />
                </div>
                <div
                    className="kg-pre-mark-fill"
                    style={{ '--fill': fill + '%' } as React.CSSProperties}
                >
                    <img src="/assets/logo/kissago-green.png" alt={SITE.name} />
                </div>
            </div>
        </div>
    );
}

/** One rolling column. Every face it will ever show is stacked inside a
 *  one-line window; moving the stack is what picks the visible one. */
function Digit({ faces, step }: { faces: number[]; step: number }) {
    return (
        <div className="kg-pre-digit">
            <ul style={{ '--step': step } as React.CSSProperties}>
                {faces.map((n, i) => (
                    <li key={i}>{n}</li>
                ))}
            </ul>
        </div>
    );
}
