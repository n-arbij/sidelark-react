import { useState } from 'react';
import { Clock, ArrowUpRight, Copy, Check, Video, MapPin, Bell, Repeat } from 'lucide-react';
import './EventCard.css';

const timeFmt  = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', hour12: false });
const dateFmt  = new Intl.DateTimeFormat([], { day: 'numeric', month: 'short' });
const stampFmt = new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' });

const STATUS = { CONFIRMED: 'Confirmed', TENTATIVE: 'Tentative', CANCELLED: 'Cancelled' };
const FREQ = { DAILY: 'Daily', WEEKLY: 'Weekly', MONTHLY: 'Monthly', YEARLY: 'Yearly' };
const DAYS = { MO: 'Mon', TU: 'Tue', WE: 'Wed', TH: 'Thu', FR: 'Fri', SA: 'Sat', SU: 'Sun' };

const isUrl = (s) => /^https?:\/\//i.test(s ?? '');

const isDark = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b < 150;
};

function describeRule(rule) {
    const p = Object.fromEntries(
        rule.replace(/^RRULE:/, '').split(';').map((s) => s.split('='))
    );
    const base = FREQ[p.FREQ] ?? 'Repeats';
    const days = p.BYDAY?.split(',').map((d) => DAYS[d] ?? d).join(', ');
    return days ? `${base} on ${days}` : base;
}

function formatMinutes(m) {
    if (m >= 1440 && m % 1440 === 0) { const d = m / 1440; return `${d} day${d > 1 ? 's' : ''}`; }
    if (m >= 60 && m % 60 === 0) return `${m / 60} hr`;
    return `${m} min`;
}

function formatWhen({ startTime, endTime, allDay }) {
    if (allDay) return 'All day';
    const s = new Date(startTime);
    const e = new Date(endTime);
    if (s.toDateString() === e.toDateString()) {
        return `${timeFmt.format(s)} - ${timeFmt.format(e)}`;
    }
    return `${dateFmt.format(s)} ${timeFmt.format(s)} - ${dateFmt.format(e)} ${timeFmt.format(e)}`;
}

export function EventCard({ event, onOpen }) {
    const [copied, setCopied] = useState(false);
    const { id, title, description, location, color, eventStatus,
            recurrenceRule, updatedAt, remindMinutes } = event;

    const bg = color || '#a78bfa';
    const link = isUrl(location);

    const copy = async () => {
        await navigator.clipboard.writeText(location);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <article
            className={`event-card event-card--${isDark(bg) ? 'light' : 'dark'}`}
            style={{ '--card-bg': bg }}
            data-event-id={id}
        >
            <header className="event-card__top">
                <div>
                    <div className="event-card__meta">
                        <div className='event-card__clock'>
                            <Clock size={12} />
                            <span>{formatWhen(event)}</span>
                        </div>
                        <span className="event-card__status">{STATUS[eventStatus] ?? eventStatus}</span>
                    </div>
                    <h3 className={`event-card__title`}>
                        {title}
                    </h3>
                    {recurrenceRule && (
                        <div className="event-card__meta recurring-rule">
                            <Repeat size={14} /> <span>{describeRule(recurrenceRule)}</span>
                        </div>
                    )}
                </div>
                <button className="event-card__open" onClick={() => onOpen(id)} aria-label="Open event">
                    <ArrowUpRight size={20} />
                </button>
            </header>

            {description && <p className="event-card__desc">{description}</p>}

            {location && (
                <div className="event-card__bar">
                    {link ? <Video size={16} /> : <MapPin size={14} />}
                    <span className="event-card__loc">{location}</span>
                    {link && (
                        <button onClick={copy} aria-label="Copy link">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    )}
                </div>
            )}

            <footer className="event-card__foot">
                <div className="event-card__chips">
                    <Bell size={14} />
                    {remindMinutes.length
                        ? remindMinutes.map((m) => (
                            <span key={m} className="event-card__chip">{formatMinutes(m)}</span>
                        ))
                        : <span className="event-card__meta">No reminders</span>}
                </div>
            </footer>

            <small className="event-card__stamp">Updated {stampFmt.format(new Date(updatedAt))}</small>
        </article>
    );
}