// src/components/Login.jsx
import React, { useState } from 'react';
import { apiRequest } from '../api';
import './Login.css';

const Login = ({ onLogin, setShowRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest.login({ email, password });
      onLogin(response.data);
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-container">
        <div className="login-left">
          <div className="brand">
            <span className="brand-icon">✈️</span>
            <h1>SmartTrip</h1>
          </div>
          <h2 className="tagline">Your Journey Starts Here</h2>
          <p className="subtitle">
            Plan smarter, travel better. AI-powered itineraries tailored just for you.
          </p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🗺️</span>
              <span>Personalized trip planning</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💡</span>
              <span>Smart recommendations</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📍</span>
              <span>Local hidden gems</span>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h3>Welcome Back</h3>
            <p className="login-subtitle">Sign in to continue your journey</p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-login">
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            <div className="signup-link">
              <span>{"Don't have an account? "}</span>
              <button onClick={() => setShowRegister(true)} className="link-button">
                Create one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
