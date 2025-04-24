// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './pages/Login';
import Main from './components/Main'; // TodoForm + TodoList 포함된 페이지
import TodoItem from './components/TodoItem';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/item" element={<TodoItem />} />
      </Routes>
    </Router>
  );
}

export default App;
