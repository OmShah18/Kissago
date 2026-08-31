import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/site/Gallery';
import { InnerHero } from '@/components/sections/InnerHero';
import { CtaSection } from '@/components/sections/CtaSection';
import { weddingFrame, wideClass, WIDE_MIN_FRAMES } from '@/lib/frames';
import { WEDDINGS, galleryFrames, nextWedding, weddingBySlug } from '@/data/weddings';

/** Five stories, all known at build time — every one is prerendered. */
export function generateStaticParams() {
    return WEDDINGS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const wedding = weddingBySlug((await params).slug);
    if (!wedding) return {};
    return {
        title: wedding.name,
        description: `${wedding.category} photographed by Kissago Art Co.`,
    };
}

export default async function WeddingStoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const wedding = weddingBySlug((await params).slug);
    if (!wedding) notFound();

    const next = nextWedding(wedding.slug);
    const useWide = wedding.photos >= WIDE_MIN_FRAMES;
    const figures = galleryFrames(wedding).map((frame, i) =>
        weddingFrame(wedding.slug, frame, { className: wideClass(i, useWide) }),
    );

    return (
        <>
            <InnerHero
                image={`/assets/weddings/${wedding.slug}/01.jpg`}
                eyebrow={wedding.category}
                title={wedding.name}
                meta={wedding.meta}
            />

            <section className="kg-section kg-section-tight">
                <div className="kg-intro" style={{ alignItems: 'start' }}>
                    <div data-reveal="up">
                        <div className="kg-eyebrow">The story</div>
                        <h2 className="kg-heading">{wedding.name}</h2>
                    </div>
                    <div data-reveal="up" data-delay="0.15">
                        <p className="kg-body" style={{ maxWidth: '52ch' }}>
                            {wedding.story}
                        </p>
                        <div className="kg-story-meta" style={{ marginTop: '2rem' }}>
                            {wedding.meta.map((m) => (
                                <span key={m}>{m}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="kg-section" style={{ paddingTop: 0 }}>
                <Gallery figures={figures} />
            </section>

            <CtaSection
                image={`/assets/weddings/${next.slug}/01.jpg`}
                eyebrow="Next story"
                heading={next.name}
                href={`/weddings/${next.slug}`}
                label="View the story"
            >
                <p style={{ marginTop: '1.6rem' }}>{next.category}</p>
            </CtaSection>
        </>
    );
}
