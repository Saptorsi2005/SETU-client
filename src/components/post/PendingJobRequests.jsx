import React from "react";
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaTrash } from "react-icons/fa";

const PendingJobRequests = ({ myJobRequests, loadingRequests, onDelete }) => {
    const pendingRequests = myJobRequests.filter((req) => req.status === "pending");

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="h-1 w-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                <h2 className="text-xl font-bold tracking-wide text-gray-100">
                    My Pending Job Requests
                </h2>
            </div>
            <p className="text-gray-500 text-sm pl-14">
                Jobs you've requested that are awaiting admin approval
            </p>

            {loadingRequests ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C5B239]" />
                </div>
            ) : pendingRequests.length === 0 ? (
                <div className="bg-[#111] rounded-2xl border border-gray-800 border-dashed p-8 text-center">
                    <span className="text-3xl mb-2 block">⏳</span>
                    <p className="text-gray-400 text-sm font-medium">
                        No pending job requests. You can request a new job posting below.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingRequests.map((request) => (
                        <div
                            key={request.request_id}
                            className="bg-[#111] p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-200 space-y-3 shadow-lg group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-white group-hover:text-[#C5B239] transition-colors flex items-center gap-2">
                                        <FaBriefcase className="text-sm text-[#C5B239]" />
                                        {request.job_title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                            <FaBuilding className="text-xs" />
                                            {request.company}
                                        </span>
                                        {request.location && (
                                            <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                                <FaMapMarkerAlt className="text-xs" />
                                                {request.location}
                                            </span>
                                        )}
                                        <span
                                            className={`px-3 py-1 rounded-lg text-xs font-bold ${request.status === "pending"
                                                    ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                                                    : request.status === "approved"
                                                        ? "bg-green-500/15 text-green-400 border border-green-500/20"
                                                        : "bg-red-500/15 text-red-400 border border-red-500/20"
                                                }`}
                                        >
                                            {request.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mt-3 leading-relaxed">{request.description}</p>
                                    {request.requirements && (
                                        <div className="text-gray-400 text-sm mt-2">
                                            <span className="font-bold text-gray-300">Requirements:</span>{" "}
                                            {request.requirements}
                                        </div>
                                    )}
                                </div>

                                {/* Delete button for pending only */}
                                {request.status === "pending" && (
                                    <button
                                        onClick={() => onDelete(request.request_id)}
                                        className="text-red-400/60 hover:text-red-400 hover:bg-red-900/20 p-2.5 rounded-xl transition-all ml-4"
                                        title="Delete request"
                                    >
                                        <FaTrash className="text-sm" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingJobRequests;
