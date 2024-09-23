import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleNavigation = (e) => {
    e.preventDefault(); 
    navigate('/login'); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register({ email, password });
      setSuccess("Account created successfully! Please login.");
    } catch (err) {
      setError("Error registering account.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
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
        <button type="submit">Register</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

      </form>
      <button className="auth-p" onClick={handleNavigation} style={{ background: "none", border: "none", cursor: "pointer" }}>
        Already a user? Login here
      </button>
    </div>
  );
};

export default Register;
