import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import "./UserLogin.css";

const UserLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("adminToken");
      navigate("/user/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="user-auth-container">
      <div className="user-auth-card">
        <h2>User Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          Don’t have an account? <Link to="/user/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;