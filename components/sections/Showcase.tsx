import { TransitionLink } from '@/components/site/navigation';
import { SERVICES } from '@/data/services';

/**
 * The "what we shoot" showcase.
 *
 * Two columns for the length of the section: the services scroll up the left
 * half one screen at a time, while a single photograph holds the right half of
 * the viewport and changes to match whichever service is passing.
 *
 * The photograph column is `position: sticky` rather than a GSAP pin, so the
 * services scroll normally against it — the whole layout is the browser's, and
 * `lib/animations/showcase.ts` only decides which photograph is showing.
 *
 * Narrow screens get the same arrangement turned through ninety degrees: the
 * photograph holds the top of the screen and the services pass underneath it.
 * One set of markup either way; only the stylesheet changes.
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
