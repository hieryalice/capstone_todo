import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
      });
      console.log(response.data);

      // 회원가입 성공하면 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error.response?.data || error.message);
      alert('회원가입 실패: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <span className="active-tab">회원가입</span>
      </div>
      <div className="register-box">
        <div className="input-row">
          <span className="icon">👤</span>
          <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-row">
          <span className="icon">📧</span>
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-row">
          <span className="icon">🔍</span>
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="register-button" onClick={handleRegister}>회원가입하기</button>
        <div className="helper-links">
          <Link to="/login">로그인하기</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
