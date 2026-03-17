import React from "react";
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaUserTie, FaTrash } from "react-icons/fa";

const JobCard = ({ job, user, onDelete, onApply }) => {
    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-200 space-y-3 shadow-lg group">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-white group-hover:text-[#C5B239] transition-colors mb-2 flex items-center gap-2">
                        <FaBriefcase className="text-sm text-[#C5B239]" />
                        {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                            <FaBuilding className="text-xs" />
                            {job.company}
                        </span>
                        {job.location && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                <FaMapMarkerAlt className="text-xs" />
                                {job.location}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                            <FaUserTie className="text-xs" />
                            Posted by: {job.posted_by_role === "admin" ? "Admin" : "Alumni"}
                        </span>
                        {job.application_count > 0 && (
                            <span className="text-[#C5B239] text-sm font-bold bg-[#C5B239]/10 px-3 py-1 rounded-lg border border-[#C5B239]/20">
                                {job.application_count}{" "}
                                {job.application_count === 1 ? "application" : "applications"}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-200 text-sm mb-2 leading-relaxed">{job.description}</p>
                    {job.requirements && (
                        <div className="text-gray-400 text-sm">
                            <span className="font-bold text-gray-300">Requirements:</span>{" "}
                            {job.requirements}
                        </div>
                    )}
                </div>

                <div className="flex gap-2 ml-4">
                    {/* Delete button - Admin only */}
                    {user?.role === "admin" && (
                        <button
                            onClick={() => onDelete(job.job_id)}
                            className="text-red-400/60 hover:text-red-400 hover:bg-red-900/20 p-2.5 rounded-xl transition-all"
                            title="Delete job"
                        >
                            <FaTrash className="text-sm" />
                        </button>
                    )}

                    {/* Apply button - student or alumni */}
                    {user && (user.role === "student" || user.role === "alumni") && (
                        <button
                            onClick={() => onApply(job.job_id)}
                            className="bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black font-bold px-5 py-2 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Apply
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobCard;
