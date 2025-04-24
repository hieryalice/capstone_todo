// src/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();  

    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      console.log("로그인 응답:", result);  // 응답 확인용

      if (res.ok) {
        localStorage.setItem('user_id', result['user_id']);
        alert("로그인 성공!");
        navigate('/main');
      } else {
        alert(result.message || "로그인 실패");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">LogIn</h1>
  
          <div className="input-row">
            <span className="icon">👤</span>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-row">
            <span className="icon">🔍</span>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" onClick={handleLogin}>로그인하기</button>
          <div className="helper-links">
            <Link to="/register">회원가입 하기</Link>
          </div>
        </div>
      </div>
  );
  }
  
  export default Login;


  