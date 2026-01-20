import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import "./LoginLanding.css";
import { authAPI } from "../services/api";

const AlumniSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    designation: "",
    graduationYear: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [document, setDocument] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const sendOtp = async () => {
    if (!formData.email) {
      setError("Enter your email first.");
      return;
    }

    try {
      setLoading(true);
      await authAPI.sendOtp({ email: formData.email });
      setOtpSent(true);
    } catch {
      setError("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      await authAPI.verifyOtp({ email: formData.email, otp });
      setEmailVerified(true);
    } catch {
      setError("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      setError("Please verify your email.");
      return;
    }

    if (!document) {
      setError("Verification document is required.");
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) =>
      payload.append(key, formData[key])
    );
    payload.append("document", document);

    try {
      setLoading(true);
      await authAPI.alumniSignup(payload);
      navigate("/alumni-login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-y-auto bg-cover bg-center flex flex-col items-center justify-center relative"
      style={{ backgroundImage: `url(${assets.landingBG})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center mb-6 animate-slide-up">
        <div className="flex flex-row items-center">
          <div className="text-white">
            <h1 className="font-bold text-8xl leading-none drop-shadow-lg">
              SETU
            </h1>
            <p className="text-sm drop-shadow-md">
              Sharing Experience To Undergrads
            </p>
          </div>
          <img
            src={assets.logo}
            alt="Setu Logo"
            className="w-30 drop-shadow-xl"
          />
        </div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 bg-amber-400 bg-opacity-10 backdrop-blur-md rounded-3xl shadow-xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto animate-slide-up">
        <h2 className="text-3xl font-bold mb-4 text-center text-white drop-shadow-md">
          Alumni Signup
        </h2>

        {error && (
          <div className="bg-red-500/80 text-white px-4 py-3 rounded-xl mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="border border-white/50 px-4 py-2 rounded-xl bg-white/60"
            required
          />

          {/* Email + OTP */}
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="flex-1 border border-white/50 px-4 py-2 rounded-xl bg-white/60"
              required
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="bg-white/30 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/50 transition"
            >
              OTP
            </button>
          </div>

          {otpSent && !emailVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 border border-white/50 px-4 py-2 rounded-xl bg-white/60"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="bg-white/30 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/50"
              >
                Verify
              </button>
            </div>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="border border-white/50 px-4 py-2 rounded-xl bg-white/60"
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Current Company"
            onChange={handleChange}
            className="border border-white/50 px-4 py-2 rounded-xl bg-white/60"
            required
          />

          <input
            type="text"
            name="designation"
            placeholder="Designation"
            onChange={handleChange}
            className="border border-white/50 px-4 py-2 rounded-xl bg-white/60"
            required
          />

          <input
            type="number"
            name="graduationYear"
            placeholder="Graduation Year"
            onChange={handleChange}
            className="border border-white/50 px-4 py-2 rounded-xl bg-white/60"
            required
          />

          {/* Document Upload */}
          <label className="cursor-pointer bg-white/30 text-white py-2 px-4 rounded-xl text-center hover:bg-white/50 transition">
            {document
              ? "Document Selected"
              : "Upload Verification Document"}
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => setDocument(e.target.files[0])}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-white/30 text-white py-2 rounded-xl font-semibold hover:bg-white/50 transition"
          >
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="text-center text-white mt-2">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/alumniLogin")}
            className="underline font-semibold hover:text-gray-300"
            type="button"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AlumniSignup;
