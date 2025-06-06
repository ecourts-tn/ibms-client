import React from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

const DatePicker = ({ name, value, onChange, error }) => {
    
  const handleDateChange = (selectedDates) => {
    const date = selectedDates[0];
    if (!date) return;

    const formattedValue = date.toISOString().split("T")[0]; // yyyy-mm-dd
    onChange(name, formattedValue);
  };

  return (
    <Flatpickr
      options={{ dateFormat: "d-m-Y" }} // display format
      value={value ? new Date(value) : null}
      onChange={handleDateChange}
      placeholder="Select date"
      className={`form-control ${error ? 'is-invalid' : ''}`}
    />
  );
};

export default DatePicker;
