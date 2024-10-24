import React, {useEffect, useState} from 'react'
import './Header.css'

const DateChange = () => {

    const [today, setToday] = useState(sessionStorage.getItem("today") || null)
    const [date, setDate] = useState()

    const handleDateChange = () => {
      sessionStorage.setItem("today", today || new Date())
      setDate(sessionStorage.getItem("today"))
    }

    return (
      <ul className="navbar-nav">
        <div className="input-group">
          <input type="date" className="form-control datepicker" value={today} onChange={(e) => setToday(e.target.value)} />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button" onClick={handleDateChange}>Change</button>
          </div>
          { date && (
            <h5 className="ml-5 pt-2"><strong>Today: <span className="text-navy blinking ml-1">{date}</span></strong></h5>
          )}
        </div>
    </ul>
    )
}

export default DateChange
