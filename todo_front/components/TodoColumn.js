import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";

function TodoColumn({
  date,
  todos,
  memo,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onSaveMemo,
}) {
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [memoText, setMemoText] = useState(memo);

  // 부모로부터 memo prop이 바뀌면 동기화
  useEffect(() => {
    setMemoText(memo);
  }, [memo]);

  const handleAdd = () => {
    if (newTodo.trim()) {
      onAdd(newTodo.trim());
      setNewTodo("");
    }
  };

  const handleSaveEdit = (id) => {
    if (editingText.trim()) {
      onEdit(id, editingText.trim());
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleMemoChange = (e) => {
    setMemoText(e.target.value);
  };

  const handleMemoSaveClick = () => {
    onSaveMemo(memoText.trim());
  };

  const todoList = todos.filter((t) => !t.completed);
  const completeList = todos.filter((t) => t.completed);

  return (
    <div className="todo-column">
      <div className="todo-column-title">{date}</div>

      <div className="add-todo">
        <input
          type="text"
          placeholder="Add new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="add-more-btn" onClick={handleAdd}>
          +ADD MORE
        </button>
      </div>

      <div className="todo-scroll">
        {todoList.map((todo) => (
          <div key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <TodoItem
                todo={todo}
                onToggle={() => onToggle(todo.id)}
                onDelete={() => onDelete(todo.id)}
                onEdit={() => {
                  setEditingId(todo.id);
                  setEditingText(todo.task);
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="complete-scroll">
        <h4>Complete</h4>
        {completeList.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEdit={(txt) => onEdit(todo.id, txt)}
            onDelete={() => onDelete(todo.id)}
            onToggle={() => onToggle(todo.id)}
          />
        ))}
      </div>

      <div className="memo-section">
        <textarea
          value={memoText}
          onChange={handleMemoChange}
          placeholder=" "
          rows={6}
        />
        <button className="memo-save-button" onClick={handleMemoSaveClick}>
          Save Memo
        </button>
      </div>
    </div>
  );
}

export default TodoColumn;
