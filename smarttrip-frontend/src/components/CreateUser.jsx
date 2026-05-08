// src/components/CreateUser.jsx
import React, { useState } from "react";
import { apiRequest } from "../api";

function CreateUser({ onRegisterComplete }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await apiRequest.register(formData);
      alert("🎉 Account created successfully! Please login.");
      onRegisterComplete();
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-8">Create Account</h2>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-2xl mb-6">{error}</div>}

        <div className="space-y-6">
          <input
            name="name"
            className="form-input"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            className="form-input"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            className="form-input"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
          />

          {/* ✅ FIX: Removed ADMIN from self-registration — admins should be created server-side only */}
          <select
            name="role"
            className="form-input"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="USER">Traveler</option>
            <option value="AGENCY">Travel Agency</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <button onClick={onRegisterComplete} className="text-violet-600 hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;