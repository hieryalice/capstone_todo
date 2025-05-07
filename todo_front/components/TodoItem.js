import React, { useState } from "react";
import "../Styles/TodoItem.css";

function TodoItem({ todo, onEdit, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.task);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlurOrEnter = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      if (editText.trim() !== "") {
        onEdit(editText.trim());
      }
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
      />

      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlurOrEnter}
          onKeyDown={handleBlurOrEnter}
          autoFocus
        />
      ) : (
        <span className="todo-text" onDoubleClick={handleDoubleClick}>
          {todo.task}
        </span>
      )}

      <button className="delete-btn" onClick={onDelete}>🗑️</button>
    </div>
  );
}

export default TodoItem;
