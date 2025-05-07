import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../Styles/UserMenu.css";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('user_id');  // 저장된 로그인 정보 삭제
    alert('로그아웃 되었습니다!');
    navigate('/login');  // 로그인 화면으로 이동
  };

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <button className="user-icon" onClick={() => setOpen((prev) => !prev)}>
        👤
      </button>
      {open && (
        <div className="dropdown-menu">
          <button onClick={handleLogout}>로그아웃</button> {/* 수정 */}
        </div>
      )}
    </div>
  );
}

export default UserMenu;
