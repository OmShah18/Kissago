import type { Metadata } from 'next';
import { InnerHero } from '@/components/sections/InnerHero';
import { StoryCard } from '@/components/sections/StoryCard';
import { CtaSection } from '@/components/sections/CtaSection';
import { WEDDINGS } from '@/data/weddings';
import { WEDDINGS_REEL_ID } from '@/data/site';

export const metadata: Metadata = {
    title: 'Featured Weddings',
    description: 'Full wedding stories photographed by Kissago Art Co. across India.',
};

export default function WeddingsPage() {
    return (
        <>
            <InnerHero
                image="/assets/weddings/harshita-himij/01.jpg"
                videoId={WEDDINGS_REEL_ID}
                eyebrow="Featured"
                title="Weddings"
                meta={['Five stories', 'Told by name', '2024 — 2026']}
            />

            <section className="kg-section">
                <div className="kg-section-head">
                    <div>
                        <div className="kg-eyebrow">The couples</div>
                        <h2 className="kg-heading">
                            Every wedding here
                            <br />
                            <em>belongs to someone.</em>
                        </h2>
                    </div>
                    <p className="kg-body">
                        These are full sets, not highlight reels &mdash; the ceremonies, the portraits and the in-between
                        frames, kept in the order the day happened.
                    </p>
                </div>
                <div className="kg-stories">
                    {WEDDINGS.map((wedding, i) => (
                        <StoryCard
                            key={wedding.slug}
                            wedding={wedding}
                            index={i + 1}
                            cta={`View ${wedding.photos} photographs`}
                        />
                    ))}
                </div>
            </section>

            <CtaSection
                image="/assets/portfolio/p07.jpg"
                videoId={WEDDINGS_REEL_ID}
                eyebrow="Your turn"
                heading={
                    <>
                        Add your names
                        <br />
                        <em>to this page.</em>
                    </>
                }
                href="/contact"
                label="Start a conversation"
            >
                <p>
                    We take a limited number of weddings each season so that no two dates ever compete for our attention.
                    Tell us yours.
                </p>
            </CtaSection>
        </>
    );
}
