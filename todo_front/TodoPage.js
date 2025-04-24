import React, { useEffect, useState } from 'react';

function TodoPage() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('로그인이 필요합니다!');
      window.location.href = '/login'; // 로그인 페이지로 이동
      return;
    }

    // 할 일 목록 불러오기
    const fetchTodos = async () => {
      const res = await fetch(`http://127.0.0.1:5000/todos?user_id=${userId}`);
      const data = await res.json();
      setTodos(data);
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    const userId = parseInt(localStorage.getItem('user_id')); // 👈 이거 매우 중요!

    if (!task.trim()) return;

    try {
      const res = await fetch('http://127.0.0.1:5000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, task }),
      });

      const result = await res.json();
      if (res.ok) {
        // 새로 추가한 할 일을 리스트에 반영
        setTodos([...todos, { title: task, completed: 0 }]);
        setTask('');
      } else {
        alert(result.message || '할 일 추가 실패');
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  return (
    <div>
      <h1>나의 할 일 목록</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="과제하기"
      />
      <button onClick={addTodo}>추가</button>

      <ul>
        {todos.map((todo, idx) => (
          <li key={idx}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoPage;
