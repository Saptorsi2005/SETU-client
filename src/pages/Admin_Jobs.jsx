import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { jobsAPI } from "../services/api";
import { useUser } from "../context/UserContext";
import {
  FaTimes,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaUserTie,
  FaTrash,
} from "react-icons/fa";

const Admin_Jobs = () => {
  const { user } = useUser();

  // Tabs
  const [activeTab, setActiveTab] = useState("approve");

  // ================= APPROVE JOBS =================
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [reason, setReason] = useState("");

  // ================= ADD JOBS =================
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  const [jobFormData, setJobFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
  });

  // ================= FETCH REQUESTS =================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/pending/requests");
      setRequests(res.data.data || res.data.requests || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load job requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await jobsAPI.getAll();
      if (response.success) setJobs(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (activeTab === "add") fetchJobs();
  }, [activeTab]);

  // ================= APPROVE / REJECT =================
  const approveRequest = async (id) => {
    if (!window.confirm("Approve this job post request?")) return;
    await api.post(`/jobs/approve/${id}`);
    setRequests((prev) => prev.filter((r) => r.request_id !== id));
  };

  const rejectRequest = async () => {
    await api.post(`/jobs/reject/${rejectModal.id}`, {
      rejection_reason: reason,
    });
    setRequests((prev) =>
      prev.filter((r) => r.request_id !== rejectModal.id)
    );
    setRejectModal({ open: false, id: null });
    setReason("");
  };

  // ================= ADD JOB =================
  const handleAddJob = async (e) => {
    e.preventDefault();

    if (!jobFormData.title || !jobFormData.company || !jobFormData.description) {
      alert("Please fill in title, company, and description.");
      return;
    }

    let response;

    if (user?.role === "admin") {
      response = await jobsAPI.create(jobFormData);
    } else if (user?.role === "alumni") {
      response = await jobsAPI.requestJob({
        job_title: jobFormData.title,
        company: jobFormData.company,
        location: jobFormData.location,
        description: jobFormData.description,
        requirements: jobFormData.requirements,
      });
    } else {
      alert("You don't have permission to create jobs.");
      return;
    }

    if (response?.success) {
      alert(
        user.role === "admin"
          ? "Job created successfully!"
          : "Job request submitted for approval!"
      );
      setShowAddJobModal(false);
      setJobFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        requirements: "",
      });
      if (user.role === "admin") fetchJobs();
    }
  };

  // ================= DELETE JOB =================
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      const response = await jobsAPI.deleteJob(jobId);

      if (response.success) {
        // Remove job from local state
        setJobs((prev) => prev.filter((job) => job.job_id !== jobId));
        alert("Job deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to delete job";
      alert(errorMsg);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 md:px-10 pt-32 md:pt-20">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Page Header */}
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full"></div>
              <h1 className="text-3xl font-bold tracking-tight">
                JOB <span className="font-light text-gray-400">MANAGEMENT</span>
              </h1>
            </div>
            <p className="text-gray-500 text-sm pl-14 tracking-wide uppercase font-medium">
              Oversee board opportunities and pending requests
            </p>
          </header>

          {/* Tabs */}
          <div className="flex gap-1 bg-black/40 p-1 rounded-2xl border border-gray-800 w-fit">
            {["approve", "add"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm rounded-xl font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === tab
                  ? "bg-gradient-to-r from-[#C5B239] to-[#a89628] text-black shadow-lg shadow-[#C5B239]/10"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-900/50"
                  }`}
              >
                {tab === "approve" ? "Pending Requests" : "Live Board"}
              </button>
            ))}
          </div>

          {/* ================= APPROVE JOBS ================= */}
          {activeTab === "approve" && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">Awaiting Verification</h3>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center py-12 bg-gray-900/20 rounded-2xl border border-gray-800">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5B239]"></div>
                    <p className="mt-4 text-gray-500 font-bold text-xs uppercase tracking-widest">Loading requests...</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-16 bg-gray-900/10 rounded-2xl border border-gray-800/50">
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">Dashboard is clear • No pending jobs</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-[#111]">
                    <table className="w-full text-sm">
                      <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-[10px] tracking-widest font-bold">
                        <tr className="border-b border-gray-800">
                          <th className="px-6 py-5 text-left">Opportunity Title</th>
                          <th className="px-6 py-5 text-left">Organization</th>
                          <th className="px-6 py-5 text-left">Location</th>
                          <th className="px-6 py-5 text-left">Submitted By</th>
                          <th className="px-6 py-5 text-center">Process</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {requests.map((req) => (
                          <tr
                            key={req.request_id}
                            className="hover:bg-gray-900/40 transition-colors duration-200 group"
                          >
                            <td className="px-6 py-4 font-bold text-gray-300 group-hover:text-[#C5B239]">{req.job_title}</td>
                            <td className="px-6 py-4 text-gray-400">{req.company}</td>
                            <td className="px-6 py-4">
                              <span className="text-gray-500 font-medium">
                                {req.location || "Remote / Global"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-400 italic text-xs break-all">{req.alumni_email}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() =>
                                    approveRequest(req.request_id)
                                  }
                                  className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black px-4 py-1.5 rounded-lg border border-emerald-500/20 transition-all font-bold text-[10px] uppercase tracking-wider"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    setRejectModal({
                                      open: true,
                                      id: req.request_id,
                                    })
                                  }
                                  className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black px-4 py-1.5 rounded-lg border border-red-500/20 transition-all font-bold text-[10px] uppercase tracking-wider"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= ADD JOBS ================= */}
          {activeTab === "add" && (
            <>
              <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#C5B239]"></div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">Active Postings</h3>
                  </div>
                  <p className="text-gray-500 text-xs font-medium pl-5 tracking-wide">Visible to students and verified alumni</p>
                </div>

                {(user?.role === "admin" || user?.role === "alumni") && (
                  <button
                    onClick={() => setShowAddJobModal(true)}
                    className="bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center gap-2"
                  >
                    <FaBriefcase className="text-xs" />
                    {user.role === "admin" ? "New Opportunity" : "Request Posting"}
                  </button>
                )}
              </div>

              {loadingJobs ? (
                <div className="flex flex-col items-center py-20 bg-gray-900/10 rounded-2xl border border-gray-800/50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <p className="mt-4 text-gray-600 font-bold text-[10px] uppercase tracking-[0.2em]">Synchronizing board...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-[#111] rounded-2xl border border-gray-800 border-dashed">
                  <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">Opportunity board is currently empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <div
                      key={job.job_id}
                      className="bg-[#111] border border-gray-800 p-7 rounded-2xl shadow-xl hover:border-[#C5B239]/30 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-5">
                          <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800 group-hover:border-[#C5B239]/20 transition-colors">
                            <FaBriefcase className="text-[#C5B239] text-xl" />
                          </div>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleDeleteJob(job.job_id)}
                              className="text-gray-600 hover:text-red-400 bg-black/40 p-2 rounded-lg border border-transparent hover:border-red-500/20 transition-all"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          )}
                        </div>

                        <h3 className="font-bold text-xl text-white group-hover:text-[#C5B239] transition-colors mb-3 tracking-tight">
                          {job.title}
                        </h3>

                        <div className="space-y-2.5 mb-6">
                          <div className="flex items-center gap-2.5 text-gray-400">
                            <FaBuilding className="text-[#C5B239] text-xs opacity-70" />
                            <span className="text-sm font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-gray-400">
                            <FaMapMarkerAlt className="text-[#C5B239] text-xs opacity-70" />
                            <span className="text-sm font-medium">{job.location || "Remote"}</span>
                          </div>
                        </div>

                        <div className="bg-black/30 p-4 rounded-xl border border-gray-800/50 mb-6">
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                            {job.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-800 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest text-gray-600">
                          By: <span className="text-gray-400"> {job.posted_by_role === "admin" ? "App Admin" : "Verified Alumni"}</span>
                        </div>
                        <span className="bg-[#C5B239]/10 text-[#C5B239] px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-[#C5B239]/20">
                          Full Time
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= REJECT MODAL ================= */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 w-full max-w-[420px] shadow-2xl relative animate-slide-up">
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              Reject Request
            </h3>
            <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider font-bold text-[10px]">Provide logic for denial</p>

            <textarea
              className="w-full h-32 p-4 rounded-2xl bg-black border border-gray-800 text-gray-300 placeholder-gray-700 outline-none focus:border-red-500/50 transition-all resize-none font-medium text-sm"
              placeholder="Rejection context..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={rejectRequest}
                className="bg-red-500 hover:bg-red-600 text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() =>
                  setRejectModal({ open: false, id: null })
                }
                className="bg-gray-900/50 hover:bg-gray-800 text-gray-400 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD JOB MODAL ================= */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-gray-800 p-8 md:p-10 rounded-3xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-slide-up">
            <button
              onClick={() => setShowAddJobModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white bg-gray-900/50 p-2 rounded-full transition-colors"
            >
              <FaTimes />
            </button>

            <header className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                {user?.role === "admin"
                  ? "Broadcast Opportunity"
                  : "Request Job Listing"}
              </h2>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                Define the requirements and description
              </p>
            </header>

            <form onSubmit={handleAddJob} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Job Title*</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={jobFormData.title}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 text-white placeholder-gray-700 p-4 rounded-xl border border-gray-800 outline-none focus:border-[#C5B239]/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Organization*</label>
                  <input
                    type="text"
                    placeholder="e.g. Google Cloud"
                    value={jobFormData.company}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        company: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 text-white placeholder-gray-700 p-4 rounded-xl border border-gray-800 outline-none focus:border-[#C5B239]/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Physical Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, India (or Remote)"
                  value={jobFormData.location}
                  onChange={(e) =>
                    setJobFormData({
                      ...jobFormData,
                      location: e.target.value,
                    })
                  }
                  className="w-full bg-black/40 text-white placeholder-gray-700 p-4 rounded-xl border border-gray-800 outline-none focus:border-[#C5B239]/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Opportunity Scope*</label>
                <textarea
                  placeholder="Summarize the role and impact..."
                  value={jobFormData.description}
                  onChange={(e) =>
                    setJobFormData({
                      ...jobFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-black/40 text-white placeholder-gray-700 p-4 rounded-xl border border-gray-800 outline-none focus:border-[#C5B239]/50 transition-all font-medium h-32 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Technical Requirements</label>
                <textarea
                  placeholder="Skills, stack, years of experience..."
                  value={jobFormData.requirements}
                  onChange={(e) =>
                    setJobFormData({
                      ...jobFormData,
                      requirements: e.target.value,
                    })
                  }
                  className="w-full bg-black/40 text-white placeholder-gray-700 p-4 rounded-xl border border-gray-800 outline-none focus:border-[#C5B239]/50 transition-all font-medium h-24 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] py-4 rounded-2xl text-black font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {user?.role === "admin"
                  ? "Publish opportunity"
                  : "Submit for approval"}
              </button>

              {user?.role === "alumni" && (
                <p className="text-gray-500 text-[10px] text-center uppercase font-bold tracking-[0.15em]">
                  Listing will undergo moderator review before appearing live
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Jobs;
