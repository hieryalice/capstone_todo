// src/components/TodoItem.js
import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}  // ✅ 통일된 필드명
        onChange={onToggle}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={onDelete}>삭제</button>
    </div>
  );
};


export default TodoItem;
