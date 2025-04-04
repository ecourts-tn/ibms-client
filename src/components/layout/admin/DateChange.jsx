import React, { useState, useEffect } from 'react';
import './Header.css';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";

const DateChange = () => {
    // Get stored date or use the current date as default
    const getCurrentDate = () => {
        let storedDate = sessionStorage.getItem("today");
    
        if (!storedDate) {
            const today = new Date();
            storedDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
            sessionStorage.setItem("today", storedDate);
        }
    
        return new Date(storedDate);
    };

    const [today, setToday] = useState(getCurrentDate());
    const [date, setDate] = useState(getCurrentDate());
    const [buttonClicked, setButtonClicked] = useState(false);

    // Format date for display (DD-MM-YYYY)
    const change_date_display = (date) => {
        if (!date) return "";
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Format date for backend (YYYY-MM-DD)
    const change_date_backend = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    // Handler to save the selected date to sessionStorage
    const handleDateChange = () => {
        sessionStorage.setItem("today", change_date_backend(today));
        setDate(today); // Update displayed date
        setButtonClicked(true); // Add button effect
    };

    // Initialize flatpickr on mount and cleanup on unmount
    useEffect(() => {
        const datepicker = flatpickr(".change_date-date-picker", {
            dateFormat: "d-m-Y",
            defaultDate: today, // Set default date correctly
            onChange: (selectedDates) => {
                if (selectedDates.length > 0) {
                    setToday(selectedDates[0]);
                }
            },
        });

        return () => {
            if (datepicker && typeof datepicker.destroy === "function") {
                datepicker.destroy();
            }
        };
    }, [today]);

    return (
        <ul className="navbar-nav">
            <div className="input-group">
                <input 
                    type="text"
                    className="form-control change_date-date-picker"
                    value={change_date_display(today)}
                    placeholder="DD-MM-YYYY"
                    readOnly
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #ccc',
                        padding: '8px',
                        width: '150px',
                        cursor: 'pointer',
                    }}
                />
                <div className="input-group-append">
                    <button 
                        className={`btn btn-primary ${buttonClicked ? "btn-enlarged" : ""}`} 
                        type="button" 
                        onClick={handleDateChange}
                    >
                        Change
                    </button>
                </div>
            </div>
        </ul>
    );
};

export default DateChange;
