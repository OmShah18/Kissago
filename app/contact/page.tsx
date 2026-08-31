import type { Metadata } from 'next';
import { Gallery } from '@/components/site/Gallery';
import { EnquiryForm } from '@/components/sections/EnquiryForm';
import { portfolioRange } from '@/lib/frames';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Check your wedding date with Kissago Art Co. — Pune, Maharashtra, travelling across India.',
};

export default function ContactPage() {
    return (
        <>
            {/* No inner hero here: the page has no masthead image, so the first
                section carries the clearance the fixed header needs. */}
            <section className="kg-section" style={{ paddingTop: '11rem' }}>
                <div className="kg-contact">
                    <div data-reveal="up">
                        <div className="kg-eyebrow">Enquiries</div>
                        <h1 className="kg-heading">
                            Let&rsquo;s check
                            <br />
                            <em>your date.</em>
                        </h1>
                        <p className="kg-body" style={{ marginTop: '1.8rem' }}>
                            We take on a limited number of weddings each season. The sooner you write, the more likely
                            your date is still open &mdash; peak-season Saturdays tend to go about a year ahead.
                        </p>

                        <div style={{ marginTop: '3.5rem' }}>
                            <div className="kg-contact-detail">
                                <h4>Email</h4>
                                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                            </div>
                            <div className="kg-contact-detail">
                                <h4>Phone &amp; WhatsApp</h4>
                                <p>{SITE.phone}</p>
                            </div>
                            <div className="kg-contact-detail">
                                <h4>Instagram</h4>
                                <a href={SITE.instagram} target="_blank" rel="noopener">
                                    {SITE.instagramHandle}
                                </a>
                            </div>
                            <div className="kg-contact-detail">
                                <h4>Based in</h4>
                                <p>
                                    {SITE.city}
                                    <br />
                                    Travelling across India &amp; abroad
                                </p>
                            </div>
                        </div>

                        <p className="kg-map-note" style={{ marginTop: '2.5rem' }}>
                            We answer every enquiry ourselves. If you have not heard back within three days, please check
                            your spam folder and then write again &mdash; we would rather hear twice than miss you.
                        </p>
                    </div>

                    <div data-reveal="up" data-delay="0.15">
                        <img
                            src="/assets/about/c01.jpg"
                            alt=""
                            style={{
                                width: '100%',
                                display: 'block',
                                aspectRatio: '4/3',
                                objectFit: 'cover',
                                marginBottom: '3rem',
                            }}
                            loading="lazy"
                            decoding="async"
                        />
                        <EnquiryForm />
                    </div>
                </div>
            </section>

            <section className="kg-section kg-section-dark kg-section-tight">
                <Gallery className="kg-grid kg-grid-4" figures={portfolioRange(41, 52)} />
            </section>
        </>
    );
}
