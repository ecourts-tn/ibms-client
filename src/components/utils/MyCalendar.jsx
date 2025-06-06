// Calendar.js
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import './calendar.css'

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});


const MyCalendar = ({upcoming, endpoint}) => {
  const navigate = useNavigate();

  const events = upcoming?.map(({ date, case_count }) => ({
    title: `${case_count}`,
    start: new Date(date),
    end: new Date(date),
    allDay: true,
    resource: { date },
  })) || [];

  const handleSelectEvent = (event) => {
    const date = event.resource.date;
    navigate(endpoint, { state: {next_date: date}}); // Navigate to /cases/2025-04-10
  };

  return (
    <div className="card">
        <div className="card-header bg-primary">
            <h3 className="card-title">
                <strong>Calendar</strong>
            </h3>
        </div>
        <div className="card-body">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                style={{ height: 350 }}
                components={{ toolbar: CustomToolbar }}
            />
        </div>
    </div>
  );
};

export default MyCalendar;



const CustomToolbar = ({ label, onNavigate, onView }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button className="btn btn-outline-primary me-2" onClick={() => onNavigate('PREV')}>
          ‹ Previous
        </button>
        <button className="btn btn-outline-primary me-2" onClick={() => onNavigate('TODAY')}>
          Today
        </button>
        <button className="btn btn-outline-primary" onClick={() => onNavigate('NEXT')}>
          › Next
        </button>
      </div>
      <div>
        <h5 className="mb-0">{label}</h5>
      </div>
      {/* <div>
        <button className="btn btn-light me-2" onClick={() => onView('month')}>
          Month
        </button>
        <button className="btn btn-light me-2" onClick={() => onView('week')}>
          Week
        </button>
        <button className="btn btn-light" onClick={() => onView('day')}>
          Day
        </button>
      </div> */}
    </div>
  );
};



