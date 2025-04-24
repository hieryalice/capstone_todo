import React, { useState } from "react";
import TodoItem from "./TodoItem";
import "../Styles/TodoColumn.css";

function TodoColumn({ date, todos, onAdd, onEdit, onDelete, onToggle }) {
  const [task, setNewTodo] = useState("");

  const handleAdd = () => {
    if (!task.trim()) return;
    onAdd(task); // Main.js에서 서버 요청 + 상태 업데이트 처리
    setNewTodo("");
  };

  const handleDelete = async (todoId) => {
    if (!todoId) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/todos/${todoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDelete(todoId);
      } else {
        alert("삭제 실패!");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleToggle = async (todoId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/todos/${todoId}/complete`, {
        method: "PATCH",
      });

      if (res.ok) {
        onToggle(todoId); // ✅ todoId만 넘김
      } else {
        alert("완료 체크 실패!");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const todoList = todos.filter((todo) => !todo.completed);
  const completeList = todos.filter((todo) => todo.completed);

  return (
    <div className="todo-column">
      <div className="todo-column-title">{date}</div>

      <div className="todo-list">
        {todoList.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEdit={(text) => onEdit(date, todo.id, text)}
            onDelete={() => handleDelete(todo.id)}
            onToggle={() => handleToggle(todo.id)} // ✅ 수정된 부분
          />
        ))}
      </div>

      <div className="add-todo">
        <input
          type="text"
          placeholder="Add new task"
          value={task}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="button" className="add-more-btn" onClick={handleAdd}>
          +ADD MORE
        </button>
      </div>

      <div className="complete-section">
        <h4>Complete</h4>
        {completeList.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEdit={(text) => onEdit(date, todo.id, text)}
            onDelete={() => handleDelete(todo.id)}
            onToggle={() => handleToggle(todo.id)} // ✅ 수정된 부분
          />
        ))}
      </div>
    </div>
  );
}

export default TodoColumn;