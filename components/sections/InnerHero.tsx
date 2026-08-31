import { VideoHolder } from './VideoHolder';

/** The full-bleed masthead every page but the home page opens with: a still
 *  held behind the title, optionally with the showreel playing over it. */
export function InnerHero({
    image,
    eyebrow,
    title,
    meta,
    videoId,
}: {
    image: string;
    eyebrow: string;
    title: string;
    meta: readonly [string, string, string];
    videoId?: string;
}) {
    return (
        <section className="inner-hero">
            <div className="inner-hero-bg" style={{ backgroundImage: `url('${image}')` }} />
            {videoId && <VideoHolder id={videoId} eager />}
            <div className="inner-hero-content">
                <div className="inner-hero-title-block">
                    <div className="inner-hero-eyebrow">{eyebrow}</div>
                    <h1 className="inner-hero-title">{title}</h1>
                </div>
                <div className="inner-hero-meta">
                    {meta.map((line) => (
                        <p key={line}>{line}</p>
                    ))}
                </div>
            </div>
        </section>
    );
}
