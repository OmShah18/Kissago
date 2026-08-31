import { TransitionLink } from '@/components/site/navigation';
import { weddingBySlug, HOME_WEDDING_SLUGS } from '@/data/weddings';
import {
    BLOCK_GAP,
    FEATURED_FRAME_FILES,
    FRAME_RATIO,
    layoutFor,
    splitName,
} from '@/data/featured';

/**
 * The featured weddings.
 *
 * Three frames per couple, scattered rather than lined up, each drifting at its
 * own speed as it passes. The couple's name is held at the vertical centre of
 * the screen — first name against the left edge, the ampersand in the middle,
 * second name against the right — and swaps a letter at a time as you arrive at
 * the next one. `lib/animations/featured.ts` drives both.
 *
 * Every name is rendered; only the active one is on screen. Keeping them all in
 * the DOM is what lets one swap into another letter by letter, rather than
 * cutting.
 */
export function FeaturedWeddings() {
    const weddings = HOME_WEDDING_SLUGS.map((slug) => weddingBySlug(slug)!);

    return (
        <section className="kg-featured" data-featured>
            <div className="kg-featured-names" aria-hidden="true">
                {weddings.map((wedding, i) => {
                    const [first, last] = splitName(wedding.name);
                    return (
                        <div className="kg-featured-name" key={wedding.slug} data-featured-name={i}>
                            <span>{letters(first)}</span>
                            <span>{letters('&')}</span>
                            <span>{letters(last)}</span>
                        </div>
                    );
                })}
            </div>

            <div className="kg-featured-blocks">
                {weddings.map((wedding, i) => {
                    const layout = layoutFor(i);
                    return (
                        <article
                            className="kg-featured-block"
                            key={wedding.slug}
                            data-featured-block={i}
                            style={{ height: `${layout.height}vw`, marginBottom: `${BLOCK_GAP}vw` }}
                        >
                            <h3 className="kg-featured-block-name">{wedding.name}</h3>
                            {layout.frames.map((frame, k) => (
                                <TransitionLink
                                    key={k}
                                    href={`/weddings/${wedding.slug}`}
                                    className="kg-featured-frame"
                                    data-speed={frame.speed}
                                    style={{
                                        left: `${frame.x}vw`,
                                        top: `${frame.y}vw`,
                                        width: `${frame.w}vw`,
                                    }}
                                >
                                    <img
                                        src={`/assets/weddings/${wedding.slug}/${FEATURED_FRAME_FILES[k]}.jpg`}
                                        alt=""
                                        width={720}
                                        height={Math.round(720 / FRAME_RATIO)}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span className="kg-featured-frame-label">
                                        {wedding.name} &mdash; {wedding.category}
                                    </span>
                                </TransitionLink>
                            ))}
                        </article>
                    );
                })}
            </div>

            <div className="kg-featured-bar">
                <TransitionLink href="/weddings" className="kg-featured-pill">
                    <span>
                        Featured Weddings<sup>{weddings.length}</sup>
                    </span>
                    <span className="kg-featured-pill-arrow" aria-hidden="true">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 15 12 9 18 15" />
                        </svg>
                    </span>
                </TransitionLink>
            </div>
        </section>
    );
}

/** One masked box per character, so the name can be swapped a letter at a time.
 *  A space still has to hold its width inside a mask, hence the marker class. */
function letters(text: string) {
    return text.split('').map((ch, i) => (
        <span className={'kg-featured-letter' + (ch === ' ' ? ' is-space' : '')} key={i}>
            <span>{ch === ' ' ? ' ' : ch}</span>
        </span>
    ));
}
