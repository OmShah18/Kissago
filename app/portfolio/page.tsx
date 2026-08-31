import type { Metadata } from 'next';
import { InnerHero } from '@/components/sections/InnerHero';
import { PortfolioGrid } from '@/components/sections/PortfolioGrid';
import { CtaSection } from '@/components/sections/CtaSection';
import { PORTFOLIO } from '@/data/portfolio';

export const metadata: Metadata = {
    title: 'Portfolio',
    description: 'Selected wedding, couple and portrait photography by Kissago Art Co.',
};

export default function PortfolioPage() {
    return (
        <>
            <InnerHero
                image="/assets/portfolio/p01.jpg"
                eyebrow="Selected work"
                title="Portfolio"
                meta={[`${PORTFOLIO.length} photographs`, 'Weddings & couples', 'Across India']}
            />

            <section className="kg-section">
                <div
                    className="kg-section-head"
                    style={{ justifyContent: 'center', textAlign: 'center', border: 'none', paddingBottom: 0 }}
                >
                    <div>
                        <div className="kg-eyebrow">Our favourites</div>
                        <h2 className="kg-heading">
                            The frames we
                            <br />
                            <em>keep coming back to.</em>
                        </h2>
                    </div>
                </div>
                <PortfolioGrid />
            </section>

            <CtaSection
                image="/assets/portfolio/p13.jpg"
                eyebrow="Want the full sets?"
                heading={
                    <>
                        See the weddings
                        <br />
                        <em>these came from.</em>
                    </>
                }
                href="/weddings"
                label="Featured weddings"
            >
                <p>
                    Single frames only tell you so much. The featured weddings show whole days, start to finish.
                </p>
            </CtaSection>
        </>
    );
}
