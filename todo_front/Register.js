import React, { useState } from 'react';

function Register({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('회원가입 성공!');
        setUsername('');
        setEmail('');
        setPassword('');
        if (onSuccess) onSuccess(); // 회원가입 성공 시 콜백 실행 (App.js에서 todo로 전환)
      } else {
        setMessage(`오류: ${data.message}`);
      }
    } catch (error) {
      setMessage(`네트워크 오류: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="사용자 이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">회원가입</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
