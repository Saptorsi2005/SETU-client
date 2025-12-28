import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // icon for back arrow
import Navbar from "../components/Navbar";

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Sample job data (could be fetched later)
  const jobDetails = {
    1: {
      title: "Technical Support Officer",
      company: "Company XYZ",
      location: "Remote",
      description:
        "Assist customers with technical issues, troubleshoot systems, and maintain system logs.",
    },
    2: {
      title: "Frontend Developer",
      company: "InnovateTech Pvt Ltd",
      location: "Bangalore, India",
      description:
        "Develop and maintain UI components, collaborate with backend teams, and improve user experience.",
    },
  };

  const job = jobDetails[jobId] || {
    title: "Unknown Job",
    company: "Unknown Company",
    location: "N/A",
    description: "No description available.",
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    coverLetter: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application submitted successfully!");
    navigate("/post");
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 min-h-screen bg-[#0d0d0d] text-white flex justify-center px-4">
        <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-lg w-full max-w-2xl relative">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <h1 className="text-2xl font-semibold mb-4">{job.title}</h1>
          <p className="text-gray-400 mb-2">
            {job.company} • {job.location}
          </p>
          <p className="text-gray-300 mb-6">{job.description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#2a2a2a] p-3 rounded-md outline-none text-white"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#2a2a2a] p-3 rounded-md outline-none text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Upload Resume</label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                required
                className="w-full text-gray-400"
              />
              {formData.resume && (
                <p className="text-sm text-gray-400 mt-1">
                  Uploaded: {formData.resume.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows="5"
                className="w-full bg-[#2a2a2a] p-3 rounded-md outline-none text-white"
                placeholder="Write a short cover letter"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md text-white font-semibold transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
