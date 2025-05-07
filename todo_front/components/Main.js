import React, { useState, useEffect } from "react";
import CalendarInline from "./CalendarInline";
import TodoColumn from "./TodoColumn";
import UserMenu from "./UserMenu";
import "../Styles/Main.css";

function Main() {
  const formatDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const getTodayDates = () => {
    const today = new Date();
    return Array.from({ length: 3 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return formatDate(d);
    });
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedDates, setSelectedDates] = useState(getTodayDates());
  const [todos, setTodos] = useState({});
  const [memos, setMemos] = useState({});
  const userId = localStorage.getItem("user_id");

  // 투두 불러오기
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/todos?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};
        data.forEach(({ id, task, date, completed }) => {
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push({ id, task, completed });
        });
        setTodos(grouped);
      })
      .catch((err) => console.error("투두 불러오기 실패:", err));
  }, [userId]);

// 메모 불러오기
useEffect(() => {
  if (!userId) return;

  Promise.all(
    selectedDates.map((date) =>
      fetch(`http://localhost:5000/notes?user_id=${userId}&date=${date}`)
        .then((res) => res.json())
        .then((data) => ({ [date]: data.content || "" }))
    )
  )
    .then((memoData) => {
      const mergedMemos = memoData.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setMemos(mergedMemos);
    })
    .catch((err) => console.error("메모 불러오기 실패:", err));
}, [userId, selectedDates]);




  const handleToggleTodo = (date, id) => {
    const updatedList = todos[date].map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos((p) => ({ ...p, [date]: updatedList }));
    fetch(`http://localhost:5000/todos/${id}/complete`, { method: "PATCH" }).catch(
      console.error
    );
  };

  const handleAddTodo = async (date, text) => {
    try {
      const res = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, task: text, date }),
      });
      const newTodo = await res.json();
      setTodos((p) => ({ ...p, [date]: [...(p[date] || []), newTodo] }));
    } catch (err) {
      console.error("추가 실패:", err);
    }
  };

  const handleDeleteTodo = (date, id) => {
    setTodos((p) => ({
      ...p,
      [date]: p[date].filter((t) => t.id !== id),
    }));
    fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" }).catch(
      console.error
    );
  };

  const handleEditTodo = async (date, id, newText) => {
    try {
      await fetch(`http://localhost:5000/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newText }),
      });
      setTodos((p) => ({
        ...p,
        [date]: p[date].map((t) => (t.id === id ? { ...t, task: newText } : t)),
      }));
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveMemo = (date, content) => {
    if (isSaving) return;
  
    setIsSaving(true);
    setMemos((p) => ({ ...p, [date]: content }));
  
    const url = `http://localhost:5000/notes`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ user_id: userId, date, content });
  
    const fetchOptions = content.trim()
  ? { method: "POST", headers, body }  // 메모 저장
  : { method: "DELETE", headers, body: JSON.stringify({ user_id: userId, date }) };  // 메모 삭제

  
    fetch(url, fetchOptions)
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
      })
      .catch(console.error)
      .finally(() => setIsSaving(false));
  };
  
  

  const handleNavigateDates = (dir) => {
    const base = new Date(selectedDates[0]);
    base.setDate(base.getDate() + (dir === "next" ? 1 : -1));
    const newDates = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return formatDate(d);
    });
    setSelectedDates(newDates);
    setSelectedDate(newDates[0]);
  };

  const todoDates = Object.keys(todos).filter((date) =>
    todos[date].some((t) => !t.completed)
  );

  return (
    <div className="main-container">
      <div className="top-bar">
        <UserMenu />
      </div>
      <div className="main-content">
        <div className="left-panel">
          <div className="calendar-fixed-left">
            <CalendarInline
              selectedDate={selectedDate}
              todoDates={todoDates}
              today={new Date()}
              onSelect={(d) => {
                const formatted = formatDate(new Date(d));
                const nextDates = Array.from({ length: 3 }, (_, i) => {
                  const dd = new Date(d);
                  dd.setDate(dd.getDate() + i);
                  return formatDate(dd);
                });
                setSelectedDate(formatted);
                setSelectedDates(nextDates);
              }}
              onMonthChange={(newMonth) => {
                console.log("달이 바뀜:", newMonth);
              }}
            />
          </div>
        </div>
        <div className="todo-section">
          <div className="todo-header">
            <button onClick={() => handleNavigateDates("prev")}>⟵</button>
            <h1>
              {new Date(selectedDates[0]).toLocaleString("default", {
                year: "numeric",
                month: "long",
              })}
            </h1>
            <button onClick={() => handleNavigateDates("next")}>⟶</button>
          </div>
          <div className="todo-columns">
            {selectedDates.map((date) => (
              <div key={date} className="todo-complete-wrapper">
                <TodoColumn
                  date={date}
                  todos={todos[date] || []}
                  memo={memos[date] || ""}
                  onAdd={(txt) => handleAddTodo(date, txt)}
                  onEdit={(id, txt) => handleEditTodo(date, id, txt)}
                  onDelete={(id) => handleDeleteTodo(date, id)}
                  onToggle={(id) => handleToggleTodo(date, id)}
                  onSaveMemo={(cnt) => handleSaveMemo(date, cnt)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
