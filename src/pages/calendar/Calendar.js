import { useState } from 'react';
import '../../App.css';
import './Calendar.css';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SAMPLE_EVENTS = {
    '2026-9-3':  [{ id: 1, title: 'Cleaning', time: '12:00', color: '#f66b56' }],
    '2026-9-10': [{ id: 2, title: 'Cleaning', time: '12:00', color: '#f5a623' }],
    '2026-9-17': [{ id: 3, title: 'Cleaning', time: '12:00', color: '#f66b56' }, { id: 4, title: 'Dentist', time: '15:30', color: '#6ECFCF' }],
    '2026-9-24': [{ id: 5, title: 'Cleaning', time: '12:00', color: '#f5a623' }],
    '2026-9-7':  [{ id: 6, title: 'Team Standup', time: '09:00', color: '#6ECFCF' }],
    '2026-9-14': [{ id: 7, title: 'Lunch w/ Alex', time: '13:00', color: '#388d7f' }],
    '2026-9-21': [{ id: 8, title: 'Gym', time: '07:00', color: '#388d7f' }],
};

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return (day + 6) % 7;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function Calendar() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);

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

    const getEvents = (d, m, y) => SAMPLE_EVENTS[`${y}-${m + 1}-${d}`] || [];

    const isToday = (d) =>
        d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

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

    const selectedKey = selectedDate
        ? `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}`
        : null;
    const selectedEvents = selectedDate ? getEvents(selectedDate.day, selectedDate.month, selectedDate.year) : [];

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
                                        isToday(cell.day) && !cell.overflow ? 'cal-cell--today' : '',
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
                                                    title={`${ev.title} at ${ev.time}`}
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
                                    <div key={ev.id} className="cal-detail__event" style={{ borderLeftColor: ev.color }}>
                                        <p className="cal-detail__event-title">{ev.title}</p>
                                        <p className="cal-detail__event-time">{ev.time}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="cal-detail__empty">Nothing scheduled for this day.</p>
                            )}
                        </div>

                        <button className="cal-detail__add-btn">+ Add Event</button>
                    </>
                ) : (
                    <div className="cal-detail__placeholder">
                        {/* <span className="cal-detail__placeholder-icon">📅</span> */}
                        <p>Select a day to see details</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Calendar;