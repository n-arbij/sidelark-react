import { useMemo, useState } from 'react';
import { EventCard } from '../../components/event-card/EventCard'
import '../../App.css';
import './Calendar.css';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const SAMPLE_EVENTS = [
    { id: 1, title: 'Cleaning', description: 'Weekly flat cleaning.', startTime: '2026-09-03T09:00:00Z', endTime: '2026-09-03T10:00:00Z', allDay: false, location: 'Home', color: '#f66b56', eventStatus: 'CONFIRMED', recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH', createdAt: '2026-08-28T08:15:00Z', updatedAt: '2026-08-28T08:15:00Z', remindMinutes: [15] },
    { id: 2, title: 'Team Standup', description: 'Daily sync with the project group.', startTime: '2026-09-07T06:00:00Z', endTime: '2026-09-07T06:30:00Z', allDay: false, location: 'https://meet.google.com/mzh-abcd-xyz', color: '#6ECFCF', eventStatus: 'CONFIRMED', recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO', createdAt: '2026-08-30T10:00:00Z', updatedAt: '2026-09-01T07:40:00Z', remindMinutes: [10, 60] },
    { id: 3, title: 'Study Group', description: 'Spring Boot security chapter.', startTime: '2026-09-10T14:00:00Z', endTime: '2026-09-10T15:30:00Z', allDay: false, location: 'https://meet.google.com/qwe-rtyu-iop', color: '#f5a623', eventStatus: 'CANCELLED', recurrenceRule: null, createdAt: '2026-09-02T12:00:00Z', updatedAt: '2026-09-09T18:20:00Z', remindMinutes: [30] },
    { id: 4, title: 'Lunch w/ Alex', description: null, startTime: '2026-09-14T10:00:00Z', endTime: '2026-09-14T11:30:00Z', allDay: false, location: 'Java House, Westlands', color: '#388d7f', eventStatus: 'TENTATIVE', recurrenceRule: null, createdAt: '2026-09-08T09:00:00Z', updatedAt: '2026-09-08T09:00:00Z', remindMinutes: [30, 120] },
    { id: 5, title: 'Dentist', description: 'Six-month checkup.', startTime: '2026-09-17T12:30:00Z', endTime: '2026-09-17T13:30:00Z', allDay: false, location: 'Mlolongo Dental Clinic', color: '#6ECFCF', eventStatus: 'CONFIRMED', recurrenceRule: null, createdAt: '2026-08-20T11:00:00Z', updatedAt: '2026-08-20T11:00:00Z', remindMinutes: [60, 1440] },
    { id: 6, title: 'Gym', description: 'Legs day.', startTime: '2026-09-21T04:00:00Z', endTime: '2026-09-21T05:00:00Z', allDay: false, location: null, color: '#388d7f', eventStatus: 'CONFIRMED', recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR', createdAt: '2026-08-15T06:00:00Z', updatedAt: '2026-08-15T06:00:00Z', remindMinutes: [] },
    { id: 7, title: 'Assignment Deadline', description: 'Submit the API project on the portal.', startTime: '2026-09-24T00:00:00Z', endTime: '2026-09-25T00:00:00Z', allDay: true, location: null, color: '#f5a623', eventStatus: 'CONFIRMED', recurrenceRule: null, createdAt: '2026-09-01T09:30:00Z', updatedAt: '2026-09-12T16:05:00Z', remindMinutes: [1440, 4320] },
    { id: 8, title: 'Database Lab', description: 'Normalization practical.', startTime: '2026-09-29T11:00:00Z', endTime: '2026-09-29T13:00:00Z', allDay: false, location: 'Lab 3', color: '#a78bfa', eventStatus: 'CONFIRMED', recurrenceRule: null, createdAt: '2026-09-20T13:00:00Z', updatedAt: '2026-09-20T13:00:00Z', remindMinutes: [30] },
];

const timeFmt = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', hour12: false });

const localKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const utcKey = (d) => `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;

function daysCovered(ev) {
    const start = new Date(ev.startTime);
    const end = new Date(ev.endTime);
    const keys = [];

    if (ev.allDay) {
        const cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
        while (cur < end) {
            keys.push(utcKey(cur));
            cur.setUTCDate(cur.getUTCDate() + 1);
        }
        return keys.length ? keys : [utcKey(start)];
    }

    const last = new Date(Math.max(end - 1, start));
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (cur <= last) {
        keys.push(localKey(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return keys;
}

function groupByDay(events) {
    const byDay = {};
    const sorted = [...events].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    for (const ev of sorted) {
        for (const key of daysCovered(ev)) {
            (byDay[key] ||= []).push(ev);
        }
    }
    return byDay;
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7;
}

function Calendar() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);

    const eventsByDay = useMemo(() => groupByDay(SAMPLE_EVENTS), []);

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
        setSelectedDate(null);
    };

    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
        setSelectedDate(null);
    };

    const getEvents = (d, m, y) => eventsByDay[`${y}-${m + 1}-${d}`] || [];

    const isToday = (cell) =>
        cell.day === today.getDate() &&
        cell.month === today.getMonth() &&
        cell.year === today.getFullYear();

    const handleOpen = (id) => {
        // Replace with your edit modal or navigation later.
        console.log('open event', id);
    };

    const cells = [];

    for (let i = 0; i < firstDay; i++) {
        const d = prevMonthDays - firstDay + 1 + i;
        const prevM = month === 0 ? 11 : month - 1;
        const prevY = month === 0 ? year - 1 : year;
        cells.push({ day: d, month: prevM, year: prevY, overflow: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, month, year, overflow: false });
    }

    const remaining = 42 - cells.length;
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
        cells.push({ day: d, month: nextM, year: nextY, overflow: true });
    }

    const selectedEvents = selectedDate
        ? getEvents(selectedDate.day, selectedDate.month, selectedDate.year)
        : [];

    return (
        <div className="cal-page">
            <div className="cal-wrapper">
                <div className="cal-month-label">
                    {MONTH_NAMES[month].toUpperCase()}
                </div>

                <div className="cal-main">
                    <div className="cal-header">
                        <div className="cal-header__title">
                            <h1>CALENDAR</h1>
                        </div>
                        <div className="cal-header__nav">
                            <button className="cal-nav-btn" onClick={prevMonth}>&#8249;</button>
                            <button className="cal-nav-btn" onClick={nextMonth}>&#8250;</button>
                        </div>
                    </div>

                    <div className="cal-dow-row">
                        {DAYS_OF_WEEK.map(d => (
                            <div key={d} className="cal-dow">{d}</div>
                        ))}
                    </div>

                    <div className="cal-grid">
                        {cells.map((cell, i) => {
                            const events = getEvents(cell.day, cell.month, cell.year);
                            const hasEvent = events.length > 0;
                            const isSelected =
                                selectedDate &&
                                selectedDate.day === cell.day &&
                                selectedDate.month === cell.month &&
                                selectedDate.year === cell.year;

                            return (
                                <div
                                    key={i}
                                    className={[
                                        'cal-cell',
                                        cell.overflow ? 'cal-cell--overflow' : '',
                                        isToday(cell) && !cell.overflow ? 'cal-cell--today' : '',
                                        hasEvent && !cell.overflow ? 'cal-cell--has-event' : '',
                                        isSelected ? 'cal-cell--selected' : '',
                                    ].join(' ')}
                                    onClick={() => !cell.overflow && setSelectedDate(cell)}
                                >
                                    <span className="cal-cell__num">{String(cell.day).padStart(2, '0')}</span>
                                    {hasEvent && !cell.overflow && (
                                        <div className="cal-cell__events" aria-label={`${events.length} event${events.length > 1 ? 's' : ''}`}>
                                            {events.map(ev => (
                                                <span
                                                    key={ev.id}
                                                    className="cal-cell__event-dot"
                                                    style={{ backgroundColor: ev.color }}
                                                    title={ev.allDay
                                                        ? `${ev.title} (all day)`
                                                        : `${ev.title} at ${timeFmt.format(new Date(ev.startTime))}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className={`cal-detail ${selectedDate ? 'cal-detail--active' : ''}`}>
                {selectedDate ? (
                    <>
                        <div className="cal-detail__date">
                            <span className="cal-detail__day-num">{String(selectedDate.day).padStart(2, '0')}</span>
                            <div>
                                <p className="cal-detail__month-name">{MONTH_NAMES[selectedDate.month]}</p>
                                <p className="cal-detail__year">{selectedDate.year}</p>
                            </div>
                        </div>

                        <div className="cal-detail__divider" />

                        <h3 className="cal-detail__section-title">
                            {selectedEvents.length > 0 ? 'Events' : 'No events'}
                        </h3>

                        <div className="cal-detail__events-list">
                            {selectedEvents.length > 0 ? (
                                selectedEvents.map(ev => (
                                    <EventCard key={ev.id} event={ev} onOpen={handleOpen} />
                                ))
                            ) : (
                                <p className="cal-detail__empty">Nothing scheduled for this day.</p>
                            )}
                        </div>

                        <button className="btn">+ Add Event</button>
                    </>
                ) : (
                    <div className="cal-detail__placeholder">
                        <p>Select a day to see details</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Calendar;
