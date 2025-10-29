import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userId: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { fullName, email, userId, age, password, confirmPassword } = formData;

    // Validation
    if (!fullName || !email || !userId || !age || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (!/^[A-Z\s]{8,}$/.test(fullName)) {
      setError("Full Name must be uppercase letters, min 8 characters");
      return;
    }

    if (!/^[A-Za-z][A-Za-z0-9]{4,}$/.test(userId)) {
      setError("User ID must start with a letter, alphanumeric, min 5 chars");
      return;
    }

    if (!/^\d+$/.test(age)) {
      setError("Age must be numbers only");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setError("Password must be min 8 chars, include letters and numbers, no special chars");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // ✅ Mock success
    console.log("Register Info:", formData);
    setError("");
    alert("Registered successfully (frontend only)");
    navigate("/login");
  };

  const navigateToLogin = () => {
    navigate("/login");
  }

  return (
    <div className="register-bg">
      <div className="register-card">
        <h3 className="register-title">Register for the First Time</h3>
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleRegister} className="register-form">
          {[
            { name: "fullName", label: "Full Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "userId", label: "User ID", type: "text" },
            { name: "age", label: "Age", type: "text" },
            { name: "password", label: "Create Password", type: "password" },
            { name: "confirmPassword", label: "Confirm Password", type: "password" },
          ].map((field) => (
            <div className="input-group" key={field.name}>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
              <label htmlFor={field.name}>{field.label}</label>
            </div>
          ))}

          <button type="submit" className="btn-register">Register</button>
          <a><p className="text-center mt-3">Already have an account? <span onClick={() => navigateToLogin()} className="text-primary">Login</span></p></a>
        </form>
      </div>
    </div>
  );
};

export default Register;