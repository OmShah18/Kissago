import { TransitionLink } from '@/components/site/navigation';
import type { Wedding } from '@/data/weddings';

/**
 * One wedding on a listing: two frames that trade places on hover, beside the
 * couple's name and the opening of their story.
 *
 * `index` numbers the card (01, 02, …) within whichever list it appears in, so
 * the home page's three and the full five on /weddings each count from one.
 */
export function StoryCard({
    wedding,
    index,
    cta,
}: {
    wedding: Wedding;
    index: number;
    cta: string;
}) {
    const href = `/weddings/${wedding.slug}`;
    const dir = `/assets/weddings/${wedding.slug}`;

    return (
        <article className="kg-story" data-reveal="up">
            <div className="kg-story-media">
                <TransitionLink className="kg-story-main" href={href}>
                    <img src={`${dir}/01.jpg`} alt={wedding.name} loading="lazy" decoding="async" />
                </TransitionLink>
                <TransitionLink className="kg-story-alt" href={href}>
                    <img src={`${dir}/02.jpg`} alt="" loading="lazy" decoding="async" />
                </TransitionLink>
            </div>
            <div className="kg-story-body">
                <div className="kg-story-index">
                    {String(index).padStart(2, '0')} &mdash; {wedding.category.toUpperCase()}
                </div>
                <h3 className="kg-story-name">{wedding.name}</h3>
                <div className="kg-story-meta">
                    {wedding.meta.map((m) => (
                        <span key={m}>{m}</span>
                    ))}
                </div>
                <p className="kg-story-text">{wedding.story}</p>
                <TransitionLink href={href} className="kg-btn kg-btn-dark">
                    {cta}
                </TransitionLink>
            </div>
        </article>
    );
}
