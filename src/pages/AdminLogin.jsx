import React, { useState } from "react";
import { assets } from "../assets/assets";
import "./LoginLanding.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { adminAPI } from "../services/api";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call the admin login API
      const response = await adminAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Store token and admin data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.admin));

        // Set user context
        setUser(response.data.admin);

        // Navigate to admin dashboard
        navigate("/directory");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center relative"
      style={{ backgroundImage: `url(${assets.landingBG})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Logo + Title + Tagline */}
      <div className="relative z-10 flex flex-col items-center mb-10 animate-slide-up">
        <div className="flex flex-row items-center">
          <div className="text-white">
            <h1 className="font-bold text-8xl md:text-8xl leading-none drop-shadow-lg">
              SETU
            </h1>
            <p className="text-sm md:text-sm drop-shadow-md pl-10">
              Administrative Access
            </p>
          </div>
          <img
            src={assets.logo}
            alt="Setu Logo"
            className="w-30 md:w-34 drop-shadow-xl"
          />
        </div>
      </div>

      {/* Admin Login Form */}
      <div className="relative z-10 bg-amber-400 bg-opacity-10 backdrop-blur-md rounded-3xl shadow-xl p-8 w-full max-w-md animate-slide-up">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-md">
          Admin Login
        </h2>
        
        {error && (
          <div className="bg-red-500/80 text-white px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Admin Email"
            className="border border-white/50 text-gray-900 px-4 py-3 rounded-xl bg-white/60 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/70 transition"
            required
            disabled={loading}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border border-white/50 text-gray-900 px-4 py-3 rounded-xl bg-white/60 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/70 transition"
            required
            disabled={loading}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-white/30 text-white py-3 rounded-xl font-semibold hover:bg-white/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
