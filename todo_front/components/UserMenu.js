// src/Components/UserMenu.js
import React, { useState, useRef, useEffect } from "react";
import "../Styles/UserMenu.css";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <button className="user-icon" onClick={() => setOpen((prev) => !prev)}>
        👤
      </button>
      {open && (
        <div className="dropdown-menu">
          <button onClick={() => alert("로그아웃 되었습니다!")}>로그아웃</button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
