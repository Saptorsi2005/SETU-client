import React from "react";
import { FaTrash } from "react-icons/fa";

const PendingJobRequests = ({ myJobRequests, loadingRequests, onDelete }) => {
    const pendingRequests = myJobRequests.filter((req) => req.status === "pending");

    return (
        <div className="w-full bg-[#111] p-5 rounded-2xl border border-gray-800 shadow-lg">
            <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                Pending Requests
            </h3>

            {loadingRequests ? (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C5B239]" />
                </div>
            ) : pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-3">No pending requests</p>
            ) : (
                <div className="space-y-3">
                    {pendingRequests.map((request) => (
                        <div
                            key={request.request_id}
                            className="bg-gray-900/50 p-3.5 rounded-xl border border-gray-800 relative group"
                        >
                            <div className="pr-8">
                                <p className="text-sm font-bold text-white truncate" title={request.job_title}>
                                    {request.job_title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate" title={request.company}>
                                    {request.company}
                                </p>
                                <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] rounded-lg font-bold bg-yellow-500/15 text-yellow-500 border border-yellow-500/20">
                                    PENDING
                                </span>
                            </div>

                            <button
                                onClick={() => onDelete(request.request_id)}
                                className="absolute right-3 top-3.5 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/10 rounded-lg"
                                title="Delete request"
                            >
                                <FaTrash className="text-xs" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingJobRequests;
