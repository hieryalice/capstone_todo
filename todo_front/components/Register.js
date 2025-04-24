import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Register.css';

function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    // 실제 회원가입 로직 생략
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <span className="active-tab">회원가입</span>
      </div>
      <div className="register-box">
        <div className="input-row">
          <span className="icon">👤</span>
          <input type="text" placeholder="아이디" />
        </div>
        <div className="input-row">
          <span className="icon">📧</span>
          <input type="email" placeholder="이메일" /> 
        </div>
        <div className="input-row">
          <span className="icon">🔍</span>
          <input type="password" placeholder="비밀번호" />
        </div>
        <button className="register-button" onClick={handleRegister}>
          회원가입하기
        </button>
        <div className="helper-links">
          <Link to="/find">아이디/비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
