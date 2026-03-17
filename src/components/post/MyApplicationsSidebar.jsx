import React from "react";

const MyApplicationsSidebar = ({ myApplications, loadingApplications }) => {
    return (
        <div className="w-full bg-[#111] p-5 rounded-2xl border border-gray-800 h-fit lg:sticky lg:top-24 shadow-lg">
            <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C5B239] rounded-full" />
                My Job Applications
            </h3>

            {loadingApplications ? (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C5B239]" />
                </div>
            ) : myApplications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-3">No applications yet</p>
            ) : (
                <div className="space-y-3">
                    {myApplications.map((app) => (
                        <div
                            key={app.application_id}
                            className="bg-gray-900/50 p-3.5 rounded-xl border border-gray-800"
                        >
                            <p className="text-sm font-bold text-white">{app.job_title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{app.company}</p>
                            <span
                                className={`inline-block mt-2 px-2.5 py-0.5 text-xs rounded-lg font-bold ${app.status === "pending"
                                    ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                                    : app.status === "accepted"
                                        ? "bg-green-500/15 text-green-400 border border-green-500/20"
                                        : "bg-red-500/15 text-red-400 border border-red-500/20"
                                    }`}
                            >
                                {app.status?.toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsSidebar;
