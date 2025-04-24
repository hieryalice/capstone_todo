import CalendarModal from "./CalendarModal";
import TodoColumn from "./TodoColumn";
import UserMenu from "./UserMenu";
import "../Styles/Main.css";
import React, { useState, useEffect } from "react";


function Main() {
  const [selectedDates, setSelectedDates] = useState([
    "2025-04-12",
    "2025-04-13",
    "2025-04-14",
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [todos, setTodos] = useState([]); 

  useEffect(() => {
    const userId = 1;
    
    
    if (!userId) return;

    fetch(`http://localhost:5000/todos?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        // 가공: 날짜별로 그룹화
        const groupedTodos = {};
        console.log("todos 상태:", data);
        data.forEach(({id, task, date, completed}) => {
          if (!date) return; // 날짜 없으면 스킵

          if (!groupedTodos[date]) groupedTodos[date] = [];

          groupedTodos[date].push({
            id,
            task,
            completed: completed === 1, // 숫자 1 → true
          });
        });

        console.log("가공된 투두:", groupedTodos);
        setTodos(groupedTodos);
      })
      .catch((err) => console.error("투두 불러오기 실패:", err));
  }, []);

  

const handleToggleTodo = (date, id) => {
  // 1. 먼저 프론트 상태를 로컬에서 업데이트
  const updatedList = todos[date].map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  setTodos((prevTodos) => ({
    ...prevTodos,
    [date]: updatedList,
  }));

  // 2. 백엔드로 PATCH 요청 보내기!
  fetch(`http://localhost:5000/todos/${id}/complete`, {
    method: 'PATCH',
  })
    .then((res) => {
      if (!res.ok) throw new Error('완료 업데이트 실패');
      return res.json();
    })
    .then((data) => {
      console.log('완료 상태 업데이트됨:', data);
    })
    .catch((err) => {
      console.error('할 일 완료 요청 실패:', err);
    });
};


  const handleAddTodo = async (date, text) => {
    console.log("📌 handleAddTodo 실행됨");
    try {
      const res = await fetch("http://127.0.0.1:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          task: text,
          date: date,
        }),
      });
  
      if (!res.ok) {
        throw new Error("추가 실패");
      }
  
      const newTodo = await res.json(); // 응답은 새로 생성된 todo 객체라고 가정
      setTodos((prevTodos) => {
        const currentList = prevTodos[date] || [];
        return {
          ...prevTodos,
          [date]: [...currentList, newTodo],
        };
      });
    } catch (err) {
      console.error("할 일 추가 중 오류:", err);
      alert("할 일을 추가하는 중 문제가 발생했습니다.");
    }
  };
  

  const handleDeleteTodo = (date, id) => {
    const updatedList = todos[date].filter((todo) => todo.id !== id);
    setTodos((prevTodos) => ({
      ...prevTodos,
      [date]: updatedList,
    }));
  };

  const handleEditTodo = (date, id, newText) => {
    const updatedList = todos[date].map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos((prevTodos) => ({
      ...prevTodos,
      [date]: updatedList,
    }));
  };

  const handleNavigateDates = (direction) => {
    const baseDate = new Date(selectedDates[0]);
    baseDate.setDate(baseDate.getDate() + (direction === "next" ? 1 : -1));
    const newDates = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });
    setSelectedDates(newDates);
  };

  return (
    <div className="main-container">
      {/* 상단 유저메뉴 */}
      <div className="top-bar">
        <UserMenu />
      </div>

      <div className="main-content">
        {/* 메모 영역 */}
        <div className="memo-column">
          <h2>MEMO</h2>
          <textarea
            className="memo-box"
          />
        </div>

        {/* 투두 섹션 */}
        <div className="todo-section">
          <div className="todo-header">
            <button onClick={() => handleNavigateDates("prev")}>⟵</button>
            <h1>April 2025</h1>
            <div className="calendar-wrapper">
              <button onClick={() => setShowCalendar(true)}>📅</button>
              <button onClick={() => handleNavigateDates("next")}>⟶</button>

              {showCalendar && (
                <div className="calendar-dropdown">
                  <CalendarModal
                    onClose={() => setShowCalendar(false)}
                    onSelect={(date) => {
                      const first = new Date(date);
                      const second = new Date(first);
                      second.setDate(first.getDate() + 1);
                      const third = new Date(second);
                      third.setDate(second.getDate() + 1);

                      const format = (d) =>
                        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`                      
                      setSelectedDates([
                        format(first),
                        format(second),
                        format(third),
                      ]);
                      setShowCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 날짜별 투두 컬럼 */}
          <div className="todo-columns">
            {selectedDates.map((date) => (
              <div key={date} className="todo-complete-wrapper">
                <TodoColumn
                  date={date}
                  todos={todos[date] || []}
                  onAdd={(text) => handleAddTodo(date, text)}
                  onEdit={(id, newText) => handleEditTodo(date, id, newText)}
                  onDelete={(id) => handleDeleteTodo(date, id)}
                  
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