import { TransitionLink } from '@/components/site/navigation';
import { SERVICES } from '@/data/services';

/**
 * The "what we shoot" showcase.
 *
 * Two columns for the length of the section: the services scroll up the left
 * half one screen at a time, while a single photograph holds the right half of
 * the viewport and changes to match whichever service is passing.
 *
 * The right column is `position: sticky` rather than a GSAP pin, so the left
 * column scrolls normally against it — the whole layout is the browser's, and
 * `lib/animations/showcase.ts` only decides which photograph is showing.
 *
 * Below 768px the CSS hides this and the stacked cards at the bottom take
 * over, so both arrangements ship and the stylesheet decides which is visible.
 */
export function Showcase() {
    return (
        <section className="projects-showcase showcase-collections" id="what-we-shoot">
            <div className="showcase-stack">
                {/* Decorative: every photograph illustrates the service named
                    beside it, so announcing them again adds nothing. */}
                <div className="showcase-figures" aria-hidden="true">
                    {SERVICES.map((service) => (
                        <div className="showcase-figure" key={service.image}>
                            <img src={`/assets/offer/${service.image}.jpg`} alt="" loading="lazy" decoding="async" />
                        </div>
                    ))}
                </div>

                <div className="showcase-steps">
                    {SERVICES.map((service, i) => (
                        <article className="showcase-step" key={service.title} data-showcase-step={i}>
                            <h2>{service.title}</h2>
                            <p>{service.blurb}</p>
                            <EnquireLink />
                        </article>
                    ))}
                </div>
            </div>

            {/* Stacked cards take over below 768px, where the two columns are off */}
            <div className="showcase-mobile-cards">
                {SERVICES.map((service) => (
                    <div key={service.image} className="showcase-mobile-card">
                        <img src={`/assets/offer/${service.image}.jpg`} alt={service.title} loading="lazy" decoding="async" />
                        <div className="showcase-mobile-card-overlay">
                            <div className="subtitle">WHAT WE SHOOT</div>
                            <h3>{service.title}</h3>
                            <p>{service.blurb}</p>
                            <EnquireLink />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/** `data-text` carries the duplicate the CSS slides in on hover. */
function EnquireLink() {
    return (
        <TransitionLink href="/contact" className="showcase-cta" data-text="ENQUIRE →">
            <span>ENQUIRE &rarr;</span>
        </TransitionLink>
    );
}
