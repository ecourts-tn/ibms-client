import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // For the day grid view
import { useTranslation } from 'react-i18next';

const Calendar = () => {
    const { t } = useTranslation();

    const events = [
        { title: 'Event 1', date: '2024-12-01' },
        { title: 'Event 2', date: '2024-12-05' },
    ];

    return (
        <div className="card">
            <div className="card-header border-0 bg-primary">
                <h3 className="card-title">
                    <i className="far fa-calendar-alt mr-2" />
                    {t('calendar')}
                </h3>
                {/* <div className="card-tools">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm dropdown-toggle"
                            data-toggle="dropdown"
                            data-offset={-52}
                        >
                            <i className="fas fa-bars" />
                        </button>
                        <div className="dropdown-menu" role="menu">
                            <a href="#/" className="dropdown-item">
                                Add new event
                            </a>
                            <a href="#/" className="dropdown-item">
                                Clear events
                            </a>
                            <div className="dropdown-divider" />
                            <a href="#/" className="dropdown-item">
                                View calendar
                            </a>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        data-card-widget="collapse"
                    >
                        <i className="fas fa-minus" />
                    </button>
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        data-card-widget="remove"
                    >
                        <i className="fas fa-times" />
                    </button>
                </div> */}
            </div>
            <div className="card-body pt-0">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                />
            </div>
        </div>
    );
};

export default Calendar;
