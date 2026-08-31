/** Tiny signal shared between the preloader and the hero title, which has to
 *  begin its entrance exactly as the preloader clears rather than on mount. */

let done = false;
const waiting = new Set<() => void>();

export function isPreloaderDone() {
    return done;
}

export function markPreloaderDone() {
    done = true;
    waiting.forEach((fn) => fn());
    waiting.clear();
}

/** Runs `fn` now if the preloader has already cleared, otherwise when it does.
 *  Returns an unsubscribe so a component unmounting mid-preload leaves nothing
 *  behind. */
export function onPreloaderDone(fn: () => void): () => void {
    if (done) {
        fn();
        return () => {};
    }
    waiting.add(fn);
    return () => waiting.delete(fn);
}

/** The home route remounts on every client-side navigation back to it, and the
 *  preloader mounts with it. Reset the signal so the hero waits for it rather
 *  than firing on a stale one. */
export function resetPreloader() {
    done = false;
    waiting.clear();
}

/* --------------------------------------------------------------------------
   Whether this tab has already been to the site.

   The preloader is the door into the site, so it plays once per session and
   never again: arriving anywhere on the site claims the visit, and every load
   afterwards — a reload of the home page, or reaching it from another route —
   goes straight to the hero.

   Session, not local, storage: a new tab is a new arrival. A browser with
   storage blocked simply plays it every time, which is the old behaviour.
   -------------------------------------------------------------------------- */

const VISIT_KEY = 'kg-visited';

/** Set at paint time by the inline script in `app/layout.tsx`, before React
 *  runs, so a returning visitor never sees a frame of the preloader. */
export const RETURNING_CLASS = 'kg-returning';

/**
 * True only the first time this is called in a tab's session — and it claims
 * the visit as it answers, so exactly one caller can be told yes.
 *
 * Only the preloader may call this. Routes that never show it use
 * `markSiteVisited` instead, which keeps the two off each other's toes: no
 * route both reads and writes, so nothing here depends on the order React
 * happens to run effects in.
 */
export function claimFirstVisit(): boolean {
    try {
        const seen = !!sessionStorage.getItem(VISIT_KEY);
        sessionStorage.setItem(VISIT_KEY, '1');
        return !seen;
    } catch {
        // Storage blocked: treat every load as a first arrival.
        return true;
    }
}

/** Records the visit without claiming it, for the routes with no preloader —
 *  so landing on one of them and then reaching the home page does not play it
 *  as though the site had just been opened. */
export function markSiteVisited() {
    try {
        sessionStorage.setItem(VISIT_KEY, '1');
    } catch {
        /* storage unavailable */
    }
}
