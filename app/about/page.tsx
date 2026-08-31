import type { Metadata } from 'next';
import { Gallery } from '@/components/site/Gallery';
import { InnerHero } from '@/components/sections/InnerHero';
import { CtaSection } from '@/components/sections/CtaSection';
import { portfolioRange } from '@/lib/frames';
import { PROCESS } from '@/data/services';

export const metadata: Metadata = {
    title: 'About',
    description: 'Kissago Art Co. is a wedding photography studio based in Pune, Maharashtra.',
};

export default function AboutPage() {
    return (
        <>
            <InnerHero
                image="/assets/about/a01.jpg"
                eyebrow="The studio"
                title="About"
                meta={['Kissago Art Co.', 'Pune, Maharashtra', 'Available worldwide']}
            />

            <section className="kg-section" style={{ paddingBottom: '4rem' }}>
                <div className="kg-intro">
                    <div data-reveal="up">
                        <div className="kg-eyebrow">Our approach</div>
                        <h2 className="kg-heading">
                            A wedding is not
                            <br />
                            <em>a photo shoot.</em>
                        </h2>
                        <p className="kg-body" style={{ marginTop: '1.8rem' }}>
                            It is a week of long days, difficult logistics and enormous feeling, and somewhere inside it
                            are about forty moments you will want back. We are there for those. Everything else we shoot
                            is scaffolding around them.
                        </p>
                        <p className="kg-body" style={{ marginTop: '1.2rem' }}>
                            In practice that means very little direction. We will place you in good light and then leave
                            you alone. The frames people cry over are almost never the ones anyone asked for.
                        </p>
                        <div className="kg-signature">&mdash; kissago art co.</div>
                    </div>
                    <div className="kg-intro-figs" data-reveal="up" data-delay="0.15">
                        <img src="/assets/about/a02.jpg" alt="" loading="lazy" decoding="async" />
                        <img src="/assets/about/a03.jpg" alt="" loading="lazy" decoding="async" />
                    </div>
                </div>
            </section>

            <section className="kg-section" style={{ paddingTop: '4rem' }}>
                <div className="kg-section-head">
                    <div>
                        <div className="kg-eyebrow">How it works</div>
                        <h2 className="kg-heading">
                            From first email
                            <br />
                            <em>to finished album.</em>
                        </h2>
                    </div>
                </div>
                {/* The rail draws in with the scroll; each marker lights as the
                    line reaches it. See `initProcessRail`. */}
                <div className="kg-process">
                    <div className="kg-process-rail">
                        <div className="kg-process-fill" />
                    </div>
                    <ol className="kg-process-list">
                        {PROCESS.map((step) => (
                            <li className="kg-process-step" key={step.num}>
                                <span className="kg-process-num">{step.num}</span>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="kg-section kg-section-dark" style={{ paddingTop: 0 }}>
                <Gallery className="kg-grid kg-grid-4" figures={portfolioRange(25, 36)} />
            </section>

            <CtaSection
                image="/assets/about/a04.jpg"
                eyebrow="Say hello"
                heading={
                    <>
                        We would love
                        <br />
                        <em>to hear about it.</em>
                    </>
                }
                href="/contact"
                label="Get in touch"
            >
                <p>
                    Tell us the dates, the city, and how the two of you met. That last part matters more to us than the
                    first two.
                </p>
            </CtaSection>
        </>
    );
}
