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
    <div className="min-h-screen bg-black text-white p-8">
        <Navbar/>
      {/* Header */}
      <header className="pt-20 mb-10">
        <h1 className="text-3xl font-bold">
          ANALYTICS <span className="block font-light text-gray-300">DASHBOARD</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          comprehensive overview of your network
        </p>
      </header>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((card, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-2xl p-6 flex flex-col justify-between items-center border border-gray-800 hover:border-indigo-500 transition"
          >
            <div className="flex gap-2 mb-4">
              {card.colors.map((c, i) => (
                <div key={i} className={`w-4 h-8 rounded-sm ${c}`}></div>
              ))}
            </div>
            <h3 className="text-gray-300 text-sm uppercase tracking-wider mb-2">
              {card.title}
            </h3>
            <p className="text-4xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Job Roles */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">JOB ROLES</h2>
        <div className="space-y-6">
          {jobRoles.map((job, i) => (
            <div key={i}>
              <div className="flex items-center mb-2">
                <span
                  className={`w-3 h-3 rounded-full ${job.color} mr-2`}
                ></span>
                <span className="text-gray-300">{job.role}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`${job.color} h-3 rounded-full`}
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
