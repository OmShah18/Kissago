import { TransitionLink } from '@/components/site/navigation';
import { Gallery } from '@/components/site/Gallery';
import { Hero } from '@/components/sections/Hero';
import { FeaturedWeddings } from '@/components/sections/FeaturedWeddings';
import { Showcase } from '@/components/sections/Showcase';
import { CtaSection } from '@/components/sections/CtaSection';
import { portfolioRange } from '@/lib/frames';
import { SHOWREEL_ID } from '@/data/site';

export default function HomePage() {
    return (
        <>
            <Hero />

            <section className="kg-section" style={{ paddingBottom: '4rem' }}>
                <div className="kg-intro">
                    <div data-reveal="up">
                        <div className="kg-eyebrow">Who we are</div>
                        <h2 className="kg-heading">
                            Not posed.
                            <br />
                            <em>Remembered.</em>
                        </h2>
                        <p className="kg-body" style={{ marginTop: '1.8rem' }}>
                            Kissago Art Co. is a small wedding photography studio. We shoot the way a wedding actually
                            feels &mdash; warm, loud, a little chaotic, and over far too quickly. Our job is to stay out
                            of the way, read the room, and be standing in the right place when something real happens.
                        </p>
                        <p className="kg-body" style={{ marginTop: '1.2rem' }}>
                            Every set you see here was made for one family. No stock, no borrowed frames.
                        </p>
                        <div className="kg-signature">&mdash; kissago art co.</div>
                        <TransitionLink href="/about" className="kg-btn kg-btn-dark" style={{ marginTop: '2.4rem' }}>
                            More about us
                        </TransitionLink>
                    </div>
                    <div className="kg-intro-figs" data-reveal="up" data-delay="0.15">
                        <img src="/assets/home/e01.jpg" alt="" loading="lazy" decoding="async" />
                        <img src="/assets/home/e02.jpg" alt="" loading="lazy" decoding="async" />
                    </div>
                </div>
            </section>

            <FeaturedWeddings />

            <section className="kg-section kg-section-dark">
                <div className="kg-section-head">
                    <div>
                        <div className="kg-eyebrow">Selected frames</div>
                        <h2 className="kg-heading">The portfolio.</h2>
                    </div>
                    <TransitionLink href="/portfolio" className="kg-btn kg-btn-light">
                        Open the full gallery
                    </TransitionLink>
                </div>
                <Gallery className="kg-grid kg-tilegrid" figures={portfolioRange(1, 12)} />
            </section>

            <section className="kg-section" style={{ paddingBottom: '4rem' }}>
                <div className="kg-section-head" style={{ border: 'none', paddingBottom: 0, marginBottom: 0 }}>
                    <div>
                        <div className="kg-eyebrow">What we shoot</div>
                        <h2 className="kg-heading">
                            Six ways
                            <br />
                            <em>to be photographed.</em>
                        </h2>
                    </div>
                </div>
            </section>

            <Showcase />

            <CtaSection
                image="/assets/about/c01.jpg"
                videoId={SHOWREEL_ID}
                eyebrow="Dates go quickly"
                heading={
                    <>
                        Tell us about
                        <br />
                        <em>your wedding.</em>
                    </>
                }
                href="/contact"
                label="Check your date"
            >
                <p>
                    Send us the dates, the city, and anything about the two of you that a schedule would never capture.
                    We only take on a limited number of weddings each season.
                </p>
            </CtaSection>
        </>
    );
}
