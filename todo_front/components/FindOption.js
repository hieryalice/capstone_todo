import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Find.css';

function FindOption() {
  const navigate = useNavigate();

  return (
    <div className="find-wrapper">
      <div className="find-box">
        <button className="find-button" onClick={() => navigate('/find/id')}>
          아이디를 잊어버렸습니다.
        </button>
        <button className="find-button" onClick={() => navigate('/find/pw')}>
          비밀번호를 잊어버렸습니다.
        </button>
      </div>
    </div>
  );
}

export default FindOption;
