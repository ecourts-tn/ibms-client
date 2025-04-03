import React, { useState, useEffect } from 'react';
import './Header.css';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";

const DateChange = () => {
    const [today, setToday] = useState(sessionStorage.getItem("today") || '');
    const [date, setDate] = useState(sessionStorage.getItem("today") || '');
    const [buttonClicked, setButtonClicked] = useState(false);
 
    // Handler to save the selected date to sessionStorage
    const handleDateChange = () => {
        sessionStorage.setItem("today", today);
        setDate(today); // Update the displayed date
        setButtonClicked(true); // Enlarge the button when clicked
    };

    // Format the date for display (DD/MM/YYYY)
    const change_date_display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Format the date for backend (YYYY-MM-DD)
    const change_date_backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    // Initializing flatpickr on component mount and clean up on unmount
    useEffect(() => {
        const change_date = flatpickr(".change_date-date-picker", {
            dateFormat: "d-m-Y", // Date format for display
            defaultDate: today ? change_date_display(new Date(today)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? change_date_backend(selectedDates[0]) : '';
                setToday(formattedDate);
            },
        });

        return () => {
            if (change_date && typeof change_date.destroy === "function") {
                change_date.destroy();
            }
        };
    }, [today]); // Reinitialize when `today` state changes

    return (
        <ul className="navbar-nav">
            <div className="input-group">
                <input 
                    type="text"
                    className="form-control change_date-date-picker"
                    value={today ? change_date_display(new Date(today)) : ''}
                    placeholder="DD-MM-YYYY"
                    onChange={(e) => setToday(e.target.value)} 
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #ccc',
                        padding: '8px',
                    }}
                />
                <div className="input-group-append">
                    <button 
                        className={`btn btn-primary ${buttonClicked}`} 
                        type="button" 
                        onClick={handleDateChange}
                    >
                        Change
                    </button>
                </div>
            </div>
            {date && (
                <h5 className="ml-5 pt-2 single-line-text">
                    <strong>Today: <span className="text-navy blinking ml-1">{change_date_display(new Date(date))}</span></strong>
                </h5>
            )}
        </ul>
    );
};

export default DateChange;
