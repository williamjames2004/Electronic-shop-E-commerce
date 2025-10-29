import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/backend/login",
        { userId, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.message === "Login successful!") {
        localStorage.setItem("userId", response.data.user);
        navigate("/home");
      } else {
        setError(response.data.message || "Invalid credentials!");
      }
    } catch (err) {
      setError("Server error! Please try again later.");
      console.error(err);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <h3 className="login-title">Login to Enter the Tech Universe</h3>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <label htmlFor="userId">User ID</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" className="btn-login">Login</button>
          <a><p className="text-center mt-3">No account created? <span onClick={() => navigateToRegister()} className="text-primary">Register</span></p></a>
        </form>
      </div>
    </div>
  );
};

export default Login;