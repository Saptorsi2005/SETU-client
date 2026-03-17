import React, { useState } from "react";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";

const rewards = [
  {
    title: "10% DISCOUNT",
    points: 40,
    image: "/assets/discount.jpg",
  },
  {
    title: "50% DISCOUNT",
    points: 120,
    image: "/assets/discount.jpg",
  },
  {
    title: "WELL DISCOUNT",
    points: 200,
    image: "/assets/discount.jpg",
  },
  {
    title: "PRIZE",
    points: 400,
    image: "/assets/discount.jpg",
  },
];

export default function RedeemPage() {
  const [selectedReward, setSelectedReward] = useState(null);
  const [code, setCode] = useState("");

  // Function to generate a random 10-letter code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setCode(generateCode());
  };

  const closePopup = () => {
    setSelectedReward(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans relative">
      {/* Navbar */}
      <Navbar />

      {/* Title */}
      <div className="pt-24 pb-2 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full"></div>
          <h1 className="text-3xl font-bold tracking-wider">REDEEM</h1>
          <div className="h-1 w-10 bg-gradient-to-l from-[#C5B239] to-purple-500 rounded-full"></div>
        </div>
        <p className="text-gray-500 text-sm">Exchange your points for exclusive rewards</p>
      </div>

      {/* Grid of rewards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-10 place-items-center max-w-6xl mx-auto">
        {rewards.map((reward, idx) => (
          <div
            key={idx}
            className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-72 flex flex-col items-center shadow-lg hover:border-[#C5B239]/40 hover:shadow-[#C5B239]/10 transition-all duration-300 group"
          >
            <div className="w-40 h-40 mb-4 rounded-xl overflow-hidden bg-gray-900/50 border border-gray-800 flex items-center justify-center group-hover:border-[#C5B239]/20 transition-colors">
              <img
                src={assets.discount}
                alt={reward.title}
                className="w-36 h-36 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="text-lg font-bold mb-2 text-center group-hover:text-[#C5B239] transition-colors">{reward.title}</h2>
            <div className="flex items-center space-x-2 mb-5">
              <span className="bg-gray-900/50 border border-[#C5B239]/20 text-[#C5B239] px-4 py-1.5 rounded-full text-sm font-bold">
                {reward.points} pts
              </span>
            </div>
            <button
              onClick={() => handleRedeem(reward)}
              className="px-8 py-2.5 rounded-xl text-black font-bold bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg"
            >
              REDEEM
            </button>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#111] rounded-2xl w-80 p-7 relative text-center shadow-2xl border border-gray-800">
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-4 text-gray-500 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-5">REDEEM CARD</h2>

            <div className="w-36 h-36 mx-auto mb-5 rounded-xl overflow-hidden bg-gray-900/50 border border-gray-800 flex items-center justify-center">
              <img
                src={assets.discount}
                alt="Reward"
                className="w-32 h-32 object-contain"
              />
            </div>

            <div
              className="bg-gradient-to-r from-[#C5B239] to-[#a89628] text-black font-bold py-2.5 px-4 rounded-xl text-lg tracking-wider mb-3 shadow-lg"
            >
              {code}
            </div>
            <p className="text-gray-500 text-sm">Use card during checkout</p>
          </div>
        </div>
      )}
    </div>
  );
}
