import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // replace with your logo path
import './Header.css';

const Header = ({ userId }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="user-section">
        <button 
          className="user-btn" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {userId} ▼
        </button>

        {dropdownOpen && (
          <div className="dropdown">
            <button onClick={() => alert("Profile clicked")}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;