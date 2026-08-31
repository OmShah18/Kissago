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
 *  preloader runs again — the same as a reload did before. Reset the signal so
 *  the hero waits for it rather than firing immediately. */
export function resetPreloader() {
    done = false;
    waiting.clear();
}
