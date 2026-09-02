'use client';

import { useState } from 'react';
import { TransitionLink } from '@/components/site/navigation';
import { FILMS, filmEmbed, filmPoster } from '@/data/films';
import { SITE } from '@/data/site';
import { PlayIcon } from '@/components/site/icons';

/**
 * The films.
 *
 * Three frames staggered down the page rather than lined up, so the section
 * reads like the featured weddings above it instead of repeating the tile wall
 * it follows. `lib/animations/films.ts` opens each frame as it arrives.
 *
 * Nothing loads from YouTube until someone asks for it: each frame is the
 * film's own poster with a play control over it, and the player replaces it on
 * click. Three embeds mounted up front would cost more than the rest of the
 * page put together.
 */
export function Films() {
    const [playing, setPlaying] = useState<string | null>(null);

    return (
        <section className="kg-section kg-films-section" data-films>
            <div className="kg-section-head">
                <div>
                    <div className="kg-eyebrow">In motion</div>
                    <h2 className="kg-heading">
                        The films.
                    </h2>
                </div>
                <a
                    href={SITE.youtube}
                    className="kg-btn kg-btn-dark"
                    target="_blank"
                    rel="noopener"
                >
                    Watch the channel
                </a>
            </div>

            <div className="kg-films">
                {FILMS.map((film, i) => (
                    <article className="kg-film" key={film.id} data-film>
                        <div className="kg-film-frame" data-film-frame>
                            {playing === film.id ? (
                                <iframe
                                    className="kg-film-player"
                                    src={filmEmbed(film.id)}
                                    title={`${film.couple} — ${film.kind}`}
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <button
                                    type="button"
                                    className="kg-film-play"
                                    onClick={() => setPlaying(film.id)}
                                    aria-label={`Play ${film.couple} — ${film.kind}`}
                                >
                                    <img
                                        src={filmPoster(film.id)}
                                        alt=""
                                        width={1280}
                                        height={720}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span className="kg-film-play-mark" aria-hidden="true">
                                        <PlayIcon />
                                    </span>
                                </button>
                            )}
                        </div>

                        <div className="kg-film-meta" data-film-meta>
                            <span className="kg-film-index">{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="kg-film-couple">{film.couple}</h3>
                            <span className="kg-film-kind">{film.kind}</span>
                            <TransitionLink href={`/weddings/${film.slug}`} className="kg-film-link">
                                See the photographs
                            </TransitionLink>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
