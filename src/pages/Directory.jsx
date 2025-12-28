import React, { useState } from "react";
import {
  Search,
  Filter,
  Upload,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";

const Directory = () => {
  const alumniData = [
    {
      name: "Riya Sen",
      email: "riya.sen@aot.edu.in",
      degree: "B.Tech",
      department: "Information Technology",
      year: "2023",
      skills: ["React", "Tailwind CSS", "Node.js"],
      projects: ["Portfolio Website", "Library Management App"],
      education: "Academy of Technology, B.Tech (IT) - 2023",
      experience: "Frontend Developer Intern at Infosys (2022)",
    },
    {
      name: "Amit Dey",
      email: "amit.dey@aot.edu.in",
      degree: "B.Tech",
      department: "Electrical Engineering",
      year: "2022",
      skills: ["MATLAB", "Embedded Systems", "IoT"],
      projects: ["Smart Energy Meter", "IoT-based Switchboard"],
      education: "Academy of Technology, B.Tech (EE) - 2022",
      experience: "Graduate Engineer Trainee at Siemens (2023)",
    },
    {
      name: "Sneha Das",
      email: "sneha.das@aot.edu.in",
      degree: "B.Tech",
      department: "Computer Science and Engineering",
      year: "2024",
      skills: ["Python", "Machine Learning", "Django"],
      projects: ["AI Chatbot", "E-commerce Platform"],
      education: "Academy of Technology, B.Tech (CSE) - 2024",
      experience: "ML Intern at TCS (2023)",
    },
    {
      name: "Rahul Ghosh",
      email: "rahul.ghosh@aot.edu.in",
      degree: "B.Tech",
      department: "Mechanical Engineering",
      year: "2021",
      skills: ["AutoCAD", "SolidWorks", "3D Printing"],
      projects: ["Drone Frame Design", "Robotic Arm Prototype"],
      education: "Academy of Technology, B.Tech (ME) - 2021",
      experience: "Mechanical Engineer at L&T (2022–present)",
    },
    {
      name: "Priya Roy",
      email: "priya.roy@aot.edu.in",
      degree: "B.Tech",
      department: "Electronics and Communication",
      year: "2023",
      skills: ["VHDL", "Signal Processing", "Arduino"],
      projects: ["Smart Traffic Light System", "Voice-controlled Robot"],
      education: "Academy of Technology, B.Tech (ECE) - 2023",
      experience: "Embedded Engineer Intern at Samsung (2022)",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const departments = [
    "All",
    "Computer Science and Engineering",
    "Information Technology",
    "Electrical Engineering",
    "Electronics and Communication",
    "Mechanical Engineering",
  ];

  // Filter + Search Logic
  const filteredData = alumniData.filter((alumnus) => {
    const matchesSearch =
      alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      filterDept === "All" || alumnus.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative">
      <Navbar/>
      {/* Header */}
      <header className="pt-20 mb-8">
        <h1 className="text-3xl font-bold">
          ANALYTICS <span className="block font-light">DIRECTORY</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          manage and track your alumni here
        </p>
      </header>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-xl border border-gray-700 transition">
          <FileSpreadsheet size={18} /> Export Excel
        </button>
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-xl border border-gray-700 transition">
          <FileText size={18} /> Export PDF
        </button>
        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-xl border border-gray-700 transition">
          <Upload size={18} /> Upload CSV
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search name or email"
            className="bg-gray-800 text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="flex items-center bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
          <Filter size={18} className="mr-2 text-gray-400" />
          <select
            className="bg-gray-800 text-white focus:outline-none"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {departments.map((dept, i) => (
              <option key={i} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Degree</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Year of Passing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredData.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-gray-800 transition duration-150 cursor-pointer"
                onClick={() => setSelectedProfile(row)}
              >
                <td className="px-6 py-3">{row.name}</td>
                <td className="px-6 py-3">{row.email}</td>
                <td className="px-6 py-3">{row.degree}</td>
                <td className="px-6 py-3">{row.department}</td>
                <td className="px-6 py-3">{row.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setSelectedProfile(null)}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-semibold mb-2">
              {selectedProfile.name}
            </h2>
            <p className="text-gray-400 mb-4">{selectedProfile.email}</p>

            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-indigo-400">Skills:</h3>
                <p>{selectedProfile.skills.join(", ")}</p>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-400">Projects:</h3>
                <ul className="list-disc ml-5">
                  {selectedProfile.projects.map((proj, i) => (
                    <li key={i}>{proj}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-400">Education:</h3>
                <p>{selectedProfile.education}</p>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-400">Experience:</h3>
                <p>{selectedProfile.experience}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;
