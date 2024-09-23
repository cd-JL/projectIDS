import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleNavigation = (e) => {
    e.preventDefault(); 
    navigate('/register'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("token", response.token); 
      navigate("/");
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <button className="auth-p" onClick={handleNavigation} style={{ background: "none", border: "none", cursor: "pointer" }}>
        Not a user? Register here
      </button>

    </div>
  );
};

export default Login;
