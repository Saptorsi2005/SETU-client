import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import {
  createCheckoutSession,
  getRecentDonations,
  getDonationAnalytics,
} from "../services/donationService";

const Donations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [recentDonations, setRecentDonations] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalDonations: 0,
    alumniDonations: 0,
  });

  const [loadingData, setLoadingData] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // ✅ Fetch donation data
  const fetchData = async (currentUser) => {
    if (!currentUser || !currentUser.id) return;

    try {
      setLoadingData(true);

      const isAlumni = currentUser.role === "alumni";

      const [donationsRes, analyticsRes] = await Promise.all([
        getRecentDonations(5),
        isAlumni
          ? getDonationAnalytics(currentUser.id)
          : getDonationAnalytics(),
      ]);

      setRecentDonations(donationsRes?.donations || []);
      setAnalytics(analyticsRes?.analytics || {});
    } catch (error) {
      console.error("Error fetching donation data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch data when user is loaded
  useEffect(() => {
    if (user) {
      fetchData(user);
    }
  }, [user]);

  // ✅ Stripe success/cancel handling
  useEffect(() => {
    if (!user) return;

    if (searchParams.get("session_id")) {
      setShowSuccess(true);

      setTimeout(() => {
        fetchData(user);
      }, 2000);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/donations", { replace: true });
      }, 5000);
    }

    if (searchParams.get("cancelled")) {
      setShowCancel(true);

      setTimeout(() => {
        setShowCancel(false);
        navigate("/donations", { replace: true });
      }, 5000);
    }
  }, [searchParams, navigate, user]);

  // ✅ Donate handler
  const handleDonate = async () => {
    const donationAmount = parseFloat(amount);

    if (!donationAmount || donationAmount < 50) {
      alert("Please enter a valid donation amount (minimum ₹50)");
      return;
    }

    if (!user) {
      alert("Please login to donate");
      navigate("/alumniLogin");
      return;
    }

    try {
      setLoading(true);

      const { url } = await createCheckoutSession(donationAmount, {
        alumniId: user.id,
        alumniName: user.name || "Anonymous",
        alumniEmail: user.email,
      });

      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(error.message || "Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    {
      name: "Net Amount Donated",
      value: analytics.totalDonations || 0,
      color: "#d1d5db",
    },
    {
      name: "Donated by You",
      value: analytics.alumniDonations || 0,
      color: "#c084fc",
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50 animate-pulse ring-1 ring-green-400/30">
          <FaCheckCircle className="text-2xl" />
          <span className="font-semibold">
            Thank you for your donation! Payment successful.
          </span>
        </div>
      )}

      {showCancel && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-amber-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50 ring-1 ring-yellow-400/30">
          <FaTimesCircle className="text-2xl" />
          <span className="font-semibold">
            Donation cancelled. You can try again anytime.
          </span>
        </div>
      )}

      {/* Hero Section */}
      <div className="pt-28 pb-12 px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-[#C5B239] rounded-full"></div>
          <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase">Make a Difference</p>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Donations
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Illustration Card */}
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#111] rounded-3xl p-8 border border-gray-800 overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex justify-center relative z-10">
                <img
                  src={assets.donation}
                  alt="donation illustration"
                  className="w-60 h-60 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-[#111] rounded-3xl p-6 border border-gray-800 shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <h2 className="text-lg font-bold tracking-wide uppercase text-gray-200">Over the Years</h2>
              </div>

              {loadingData ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <ResponsiveContainer width="50%" height={150}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={3}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="text-sm space-y-3 flex-1">
                    <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                      <div className="w-3 h-3 bg-gray-400 rounded-full shadow-sm"></div>
                      <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Net amount donated</p>
                        <p className="text-white font-bold text-base">{formatCurrency(analytics.totalDonations)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                      <div className="w-3 h-3 bg-purple-400 rounded-full shadow-sm"></div>
                      <div>
                        <p className="text-purple-300 text-xs font-medium uppercase tracking-wide">Donated by you</p>
                        <p className="text-white font-bold text-base">{formatCurrency(analytics.alumniDonations)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Donate Card */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#111] rounded-3xl p-8 border border-gray-800 shadow-xl relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#C5B239]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                  Your Support,
                </h2>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#C5B239] mb-6">
                  Their Future
                </h2>
                <p className="text-gray-400 text-sm mb-8 max-w-sm leading-relaxed">
                  Every contribution makes a real difference in the lives of students. Help shape the next generation of leaders.
                </p>

                <div className="w-full mb-5">
                  <label className="block text-sm font-semibold mb-2 text-gray-300 tracking-wide">
                    Enter Donation Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100"
                    min="50"
                    className="w-full bg-black/50 text-white border border-gray-700 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all text-lg placeholder-gray-600"
                  />
                </div>

                <button
                  onClick={handleDonate}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#C5B239] to-[#a89628] text-black px-10 py-3.5 rounded-xl font-bold text-base hover:from-[#d4c048] hover:to-[#C5B239] transition-all shadow-lg hover:shadow-[#C5B239]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Processing..." : "DONATE NOW →"}
                </button>
              </div>
            </div>

            {/* Recent Donations Card */}
            <div className="bg-[#111] rounded-3xl p-6 border border-gray-800 shadow-xl flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 bg-[#C5B239] rounded-full"></div>
                <h3 className="text-lg font-bold tracking-wide uppercase text-gray-200">Recent Donations</h3>
              </div>

              {loadingData ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400"></div>
                </div>
              ) : recentDonations.length > 0 ? (
                <div className="space-y-3">
                  {recentDonations.map((donation, idx) => (
                    <div
                      key={donation.donation_id}
                      className="bg-gray-900/60 rounded-xl px-5 py-4 flex justify-between items-center border border-gray-800 hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/30 to-[#C5B239]/30 flex items-center justify-center text-sm font-bold text-white border border-gray-700">
                          {(donation.alumni_name || "A").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                          {donation.alumni_name || "Anonymous"}
                        </span>
                      </div>

                      <span className="text-purple-400 font-bold text-base">
                        {formatCurrency(donation.amount)}
                      </span>

                      <span className="text-gray-500 text-xs font-medium hidden sm:block">
                        {formatDate(donation.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900/40 rounded-2xl h-32 flex flex-col justify-center items-center text-gray-400 border border-gray-800 border-dashed">
                  <span className="text-3xl mb-2">💝</span>
                  <p className="text-sm font-medium">No donations yet. Be the first to donate!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-12"></div>
    </div>
  );
};

export default Donations;
