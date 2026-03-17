import React from "react";
import { BarChart3 } from "lucide-react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const stats = [
    {
      title: "TOTAL ALUMNI",
      value: 30,
      colors: ["bg-blue-500", "bg-yellow-500", "bg-red-500"],
    },
    {
      title: "EMPLOYED ALUMNI",
      value: 23,
      colors: ["bg-red-500", "bg-green-500", "bg-purple-500"],
    },
    {
      title: "TOTAL NO. OF DONATIONS",
      value: 15,
      colors: ["bg-red-500", "bg-cyan-500", "bg-purple-400"],
    },
    {
      title: "NO. OF EVENTS",
      value: 9,
      colors: ["bg-pink-500", "bg-green-400", "bg-blue-500"],
    },
  ];

  const jobRoles = [
    { role: "Software Engineer", color: "bg-green-500", percent: 80 },
    { role: "Data Scientist", color: "bg-cyan-500", percent: 70 },
    { role: "Finance", color: "bg-pink-500", percent: 60 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 relative">
      <Navbar />
      {/* Header */}
      <header className="pt-28 mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full"></div>
          <h1 className="text-3xl font-bold tracking-tight">
            ANALYTICS <span className="font-light text-gray-400">DASHBOARD</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm pl-14 tracking-wide uppercase font-medium">
          Comprehensive overview of your network
        </p>
      </header>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((card, index) => (
          <div
            key={index}
            className="bg-[#111] border border-gray-800 rounded-2xl p-7 flex flex-col justify-between items-center hover:border-[#C5B239]/40 transition-all duration-300 group shadow-lg"
          >
            <div className="flex gap-2.5 mb-5 bg-black/40 p-2 rounded-xl border border-gray-800/50">
              {card.colors.map((c, i) => (
                <div key={i} className={`w-4 h-10 rounded-full ${c} shadow-sm group-hover:scale-y-110 transition-transform`}></div>
              ))}
            </div>
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              {card.title}
            </h3>
            <p className="text-4xl font-bold tracking-tighter group-hover:text-[#C5B239] transition-colors">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Job Roles */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-xl max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-2 w-2 rounded-full bg-[#C5B239] shadow-[0_0_8px_rgba(197,178,57,0.5)]"></div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Top Professional Domains</h2>
        </div>
        <div className="space-y-8">
          {jobRoles.map((job, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full ${job.color} mr-3 shadow-sm`}></span>
                  <span className="text-gray-300 font-bold text-sm group-hover:text-white transition-colors">{job.role}</span>
                </div>
                <span className="text-gray-500 font-bold text-xs">{job.percent}%</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 border border-gray-800 overflow-hidden">
                <div
                  className={`${job.color} h-full rounded-full transition-all duration-1000 group-hover:brightness-110`}
                  style={{ width: `${job.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
