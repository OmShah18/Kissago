import type { ReactNode } from 'react';
import { TransitionLink } from '@/components/site/navigation';
import { VideoHolder } from './VideoHolder';

/** The closing panel each page ends on: a still (or the showreel) behind a
 *  single invitation. */
export function CtaSection({
    image,
    videoId,
    eyebrow,
    heading,
    children,
    href,
    label,
}: {
    image: string;
    videoId?: string;
    eyebrow: string;
    heading: ReactNode;
    children: ReactNode;
    href: string;
    label: string;
}) {
    return (
        <section className="kg-cta">
            <div className="kg-cta-bg">
                <img src={image} alt="" loading="lazy" decoding="async" />
                {videoId && <VideoHolder id={videoId} />}
            </div>
            <div className="kg-cta-inner" data-reveal="up">
                <div className="kg-eyebrow">{eyebrow}</div>
                <h2 className="kg-heading">{heading}</h2>
                {children}
                <TransitionLink href={href} className="kg-btn kg-btn-light">
                    {label}
                </TransitionLink>
            </div>
        </section>
    );
}
