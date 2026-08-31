import { SITE } from '@/data/site';

/**
 * An empty slot the showreel is mounted into on the client.
 *
 * Nothing is inlined here on purpose: the markup ships without a third-party
 * player, and `initBackgroundVideo` fills the slot only when it is near the
 * viewport — never at all for visitors who have asked for reduced motion, who
 * keep the still frame underneath instead.
 *
 * `eager` marks the holder that is already on screen at load, so it starts
 * without waiting for its observer's first callback.
 */
export function VideoHolder({
    id,
    eager = false,
    title = `${SITE.name} showreel`,
}: {
    id: string;
    eager?: boolean;
    title?: string;
}) {
    return (
        <div
            className="kg-video-holder"
            data-video={id}
            data-video-title={title}
            {...(eager ? { 'data-video-eager': '' } : {})}
        />
    );
}
