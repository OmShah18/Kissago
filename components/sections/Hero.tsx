import { TransitionLink } from '@/components/site/navigation';
import { VideoHolder } from './VideoHolder';
import { SHOWREEL_ID, SITE } from '@/data/site';
import { WEDDINGS } from '@/data/weddings';

const HERO_STILLS = ['h01', 'h02', 'h03', 'h04'];

/** Split so each letter can be masked on its own. Rendered as one accessible
 *  label with the pieces hidden from the reader, so the wordmark is announced
 *  as a word rather than spelled out. */
const WORDMARK = 'Kissago';

/**
 * The home hero: two and a bit viewports of footage stuck to the top of the
 * screen, with the wordmark, the introduction and the featured story travelling
 * up over it.
 *
 * The opening — the frame expanding out of the preloader and the letters
 * rising into it — is choreographed in `lib/animations/hero.ts`, which waits
 * for the preloader rather than for mount.
 */
export function Hero() {
    const featured = WEDDINGS[0];

    return (
        <section className="kg-hero kg-hero-tall">
            <div className="kg-hero-media">
                {/* A wall of portrait frames rather than one upscaled photo,
                    because every source file is only 1200px on the long edge.
                    It doubles as the poster for the showreel above it. */}
                <div className="kg-hero-wall">
                    {HERO_STILLS.map((still) => (
                        <div className="kg-hero-pane" key={still}>
                            <img src={`/assets/hero/${still}.jpg`} alt="" fetchPriority="high" decoding="async" />
                        </div>
                    ))}
                </div>
                <VideoHolder id={SHOWREEL_ID} eager />
                <div className="kg-hero-scrim" />
            </div>

            <div className="kg-hero-stage">
                <div className="kg-hero-headline">
                    <h1 className="kg-hero-title" aria-label={SITE.name}>
                        {WORDMARK.split('').map((letter, i) => (
                            <span className="kg-hero-letter" key={i} aria-hidden="true">
                                <span>{letter}</span>
                            </span>
                        ))}
                    </h1>
                </div>

                <div className="kg-hero-intro">
                    <figure className="kg-hero-intro-fig" data-hero-fade>
                        <img src="/assets/home/e04.jpg" alt="" loading="lazy" decoding="async" />
                    </figure>
                    <div className="kg-hero-intro-text" data-hero-fade>
                        <p>
                            Wedding photography that stays out of the way &mdash; warm, unhurried, and made for one
                            family at a time.
                        </p>
                        <TransitionLink href="/contact" className="kg-hero-pill">
                            Check your date
                        </TransitionLink>
                    </div>
                </div>

                <TransitionLink href={`/weddings/${featured.slug}`} className="kg-hero-feature" data-hero-fade>
                    <p>{featured.name}</p>
                    <span>See the story</span>
                </TransitionLink>
            </div>
        </section>
    );
}
