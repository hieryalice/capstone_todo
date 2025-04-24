import React, { useState } from "react";
import "../Styles/TodoItem.css";

function TodoItem({ todo, onEdit, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.task);  // 수정됨

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    } else {
      alert("Please enter a valid text");
    }
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}               // ✅ 수정됨
        onChange={() => onToggle(todo.id)}
      />

      {isEditing ? (
        <input
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEditSubmit();
          }}
          autoFocus
        />
      ) : (
        <span
          className={`todo-text ${todo.completed ? "done" : ""}`}  // ✅ 수정됨
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.task}
        </span>
      )}

      <button className="delete-btn" onClick={() => onDelete(todo.id)}>🗑</button>
    </div>
  );
}

export default TodoItem;