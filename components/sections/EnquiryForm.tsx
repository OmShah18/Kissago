'use client';

import { useEffect, useRef, useState } from 'react';
import { ENQUIRY_TYPES } from '@/data/services';

type Phase = 'idle' | 'sending' | 'sent';

const CONFIRMATION = 'Thank you — we read every enquiry ourselves and will reply within two days.';

/**
 * The enquiry form.
 *
 * Front-end only: there is no backend wired up yet, so submitting acknowledges
 * the enquiry and clears the form without sending anything. Point `onSubmit` at
 * a route handler when one exists.
 */
export function EnquiryForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [phase, setPhase] = useState<Phase>('idle');
    const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (phase !== 'idle') return;
        setPhase('sending');

        timers.current.push(
            setTimeout(() => {
                setPhase('sent');
                timers.current.push(
                    setTimeout(() => {
                        formRef.current?.reset();
                        setPhase('idle');
                    }, 5000),
                );
            }, 1100),
        );
    }

    return (
        <form className="kg-form" id="kg-contact-form" noValidate ref={formRef} onSubmit={handleSubmit}>
            <div className="kg-field">
                <label htmlFor="f-name">Your names</label>
                <input type="text" id="f-name" name="names" autoComplete="name" required />
            </div>
            <div className="kg-field">
                <label htmlFor="f-email">Email</label>
                <input type="email" id="f-email" name="email" autoComplete="email" required />
            </div>
            <div className="kg-field">
                <label htmlFor="f-phone">Phone</label>
                <input type="tel" id="f-phone" name="phone" autoComplete="tel" />
            </div>
            <div className="kg-field">
                <label htmlFor="f-date">Wedding date</label>
                <input type="date" id="f-date" name="date" />
            </div>
            <div className="kg-field">
                <label htmlFor="f-city">City / venue</label>
                <input type="text" id="f-city" name="city" />
            </div>
            <div className="kg-field">
                <label htmlFor="f-type">What you need</label>
                <select id="f-type" name="type" defaultValue="">
                    <option value="">Select&hellip;</option>
                    {ENQUIRY_TYPES.map((type) => (
                        <option key={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div className="kg-field kg-field-full">
                <label htmlFor="f-message">Tell us about the two of you</label>
                <textarea id="f-message" name="message" rows={4} />
            </div>
            <div className="kg-field-full">
                <button type="submit" className="kg-btn kg-btn-solid" disabled={phase !== 'idle'}>
                    {phase === 'idle' && 'Send enquiry'}
                    {phase === 'sending' && 'Sending…'}
                    {phase === 'sent' && 'Enquiry sent ✓'}
                </button>
            </div>
            <p className={'kg-form-status' + (phase === 'sent' ? ' show' : '')}>
                {phase === 'sent' ? CONFIRMATION : ''}
            </p>
        </form>
    );
}
