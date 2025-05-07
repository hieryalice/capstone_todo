// CalendarInline.js
import React, { useState } from "react";
import "../Styles/CalendarInline.css";

function getMonthDates(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  const start = firstDay.getDay();
  for (let i = 0; i < start; i++) days.push(null);

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  return days;
}

// CalendarInline.js
function CalendarInline({ selectedDate, todoDates, today, onSelect, onMonthChange }) {
  const [currentDate, setCurrentDate] = useState(today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDates(year, month);

  const format = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const isToday = (d) => format(d) === format(today);
  const hasTodo = (d) => todoDates.includes(format(d));
  const isSelected = (d) => format(d) === selectedDate;

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + offset);
    setCurrentDate(newDate);
    onMonthChange(newDate);
  };

  return (
    <div className="calendar-embedded">
      <div className="calendar-nav">
        <button onClick={() => changeMonth(-1)}>←</button>
        <span>{year}년 {month + 1}월</span>
        <button onClick={() => changeMonth(1)}>→</button>
      </div>

      <div className="calendar-header">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-body">
        {days.map((date, i) => {
          const isSel = date && isSelected(date);
          const isTod = date && isToday(date);
          const isTodo = date && hasTodo(date);

          return (
            <div
              key={i}
              className={`calendar-date ${isTod ? "today" : ""} ${isSel ? "selected" : ""}`}
              onClick={() => date && onSelect(date)}
            >
              {date ? date.getDate() : ""}
              {isTodo && <div className="todo-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarInline;