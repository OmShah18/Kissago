import { prefersReducedMotion } from '@/lib/smooth-scroll';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        YT?: any;
        onYouTubeIframeAPIReady?: () => void;
    }
}

/** Holder elements grow a `_player` handle once their iframe exists. */
type Holder = HTMLElement & { _player?: any };

let apiReady = false;
const apiWaiters: Array<() => void> = [];

function loadApi() {
    if (typeof window === 'undefined') return;
    if (window.YT?.Player) {
        apiReady = true;
        return;
    }
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;

    const prevHook = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
        prevHook?.();
        apiReady = true;
        apiWaiters.splice(0).forEach((fn) => fn());
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
}

const whenApiReady = (fn: () => void) => (apiReady ? fn() : apiWaiters.push(fn));

/**
 * Mounts the showreel behind the hero and the closing CTA.
 *
 * The player is driven through YouTube's IFrame API rather than a bare embed,
 * because only the API tells us whether playback actually started. Autoplay
 * refusals (iOS), blocked embeds and unavailable videos all end with the still
 * frames still showing instead of YouTube's error panel.
 */
export function initBackgroundVideo(): () => void {
    const holders = Array.from(document.querySelectorAll<Holder>('[data-video]'));
    if (!holders.length || prefersReducedMotion()) return () => {};

    loadApi();

    const observers: IntersectionObserver[] = [];
    const mounted: Holder[] = [];

    function mount(el: Holder) {
        if (el.dataset.mounted) return;
        el.dataset.mounted = '1';
        mounted.push(el);
        whenApiReady(() => {
            // The route may have unmounted while the API was still loading.
            if (!el.isConnected) return;
            const slot = document.createElement('div');
            el.appendChild(slot);
            new window.YT.Player(slot, {
                videoId: el.dataset.video,
                // No loop/playlist params: `loop` only works alongside
                // `playlist`, which puts the player in playlist mode and makes
                // it draw prev/pause/next buttons over the video. The ENDED
                // handler below rewinds instead.
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    playsinline: 1,
                    modestbranding: 1,
                    rel: 0,
                    iv_load_policy: 3,
                    fs: 0,
                    disablekb: 1,
                },
                events: {
                    onReady: (e: any) => {
                        el._player = e.target;
                        e.target.mute();
                        e.target.playVideo();
                    },
                    onStateChange: (e: any) => {
                        if (e.data === window.YT.PlayerState.PLAYING) el.classList.add('is-playing');
                        // Looping is done here rather than with loop=1.
                        if (e.data === window.YT.PlayerState.ENDED) {
                            e.target.seekTo(0);
                            e.target.playVideo();
                        }
                    },
                    onError: () => el.remove(),
                },
            });
        });
    }

    holders.forEach((el) => {
        if (!('IntersectionObserver' in window)) {
            mount(el);
            return;
        }

        // One observer per holder handles both jobs: mount the player when it
        // is nearly on screen, then keep only the visible one running. Two
        // simultaneous players compete for Chrome's autoplay budget, so the
        // off-screen one has to yield or the second never starts.
        const io = new IntersectionObserver(
            (entries) => {
                const near = entries.some((e) => e.isIntersecting);
                if (near) mount(el);
                const player = el._player;
                if (!player) return;
                try {
                    if (near) player.playVideo();
                    else player.pauseVideo();
                } catch {
                    /* player torn down */
                }
            },
            { rootMargin: '200px' },
        );
        io.observe(el);
        observers.push(io);

        // The hero is on screen at load; start it without waiting for the
        // observer's first callback.
        if ('videoEager' in el.dataset) mount(el);
    });

    return () => {
        observers.forEach((io) => io.disconnect());
        // Leaving a muted iframe running in a detached tree keeps decoding
        // video for a page nobody is looking at.
        mounted.forEach((el) => {
            try {
                el._player?.destroy();
            } catch {
                /* already gone */
            }
            delete el._player;
        });
    };
}
