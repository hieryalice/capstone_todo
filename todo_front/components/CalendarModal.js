// Pages/CalendarModal.js
import React, { useState } from "react";
import "../Styles/CalendarModal.css";

function getMonthDates(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates = [];

  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    dates.push(null);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push(new Date(year, month, i));
  }

  return dates;
}

function CalendarModal({ onSelect, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDates(year, month);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="calendar-modal">
      <h3>Select a Date</h3>

      <div className="calendar-nav">
        <button onClick={() => changeMonth(-1)}>Previous</button>
        <span>{currentDate.toLocaleString("default", { month: "long" })} {year}</span>
        <button onClick={() => changeMonth(1)}>Next</button>
      </div>

      <div className="calendar-header">
        {weekdays.map((weekday) => (
          <div key={weekday} className="calendar-weekday">
            {weekday}
          </div>
        ))}
      </div>

      <div className="calendar-body">
        {days.map((date, index) => (
          <div
            key={index}
            className={`calendar-date ${date ? "active" : ""}`}
            onClick={() => {
              if (date) {
                onSelect(date);         // 🔥 Main으로 선택 날짜 전달
                setSelectedDate(date); // 캘린더 내부 상태 업데이트
              }
            }}
          >
            {date ? date.getDate() : ""}
          </div>
        ))}
      </div>

      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default CalendarModal;
