import React from "react";
import JobCard from "./JobCard";
import PendingJobRequests from "./PendingJobRequests";
import MyApplicationsSidebar from "./MyApplicationsSidebar";

const JobPostTab = ({
    user,
    jobs,
    loadingJobs,
    myJobRequests,
    loadingRequests,
    myApplications,
    loadingApplications,
    onDeleteJob,
    onDeletePendingRequest,
    onApply,
    onOpenAddJobModal,
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT: Job Content */}
            <div className="flex-1 space-y-6">

                {/* Alumni: My Pending Job Requests */}
                {user?.role === "alumni" && (
                    <PendingJobRequests
                        myJobRequests={myJobRequests}
                        loadingRequests={loadingRequests}
                        onDelete={onDeletePendingRequest}
                    />
                )}

                {/* Job Openings */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full" />
                            <h2 className="text-xl font-bold tracking-wide text-gray-100">Job Openings</h2>
                        </div>

                        {user && (user.role === "alumni" || user.role === "admin") && (
                            <button
                                onClick={onOpenAddJobModal}
                                className="bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-[#C5B239]/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {user.role === "admin" ? "Create Job" : "Request Job Posting"}
                            </button>
                        )}
                    </div>

                    {loadingJobs ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C5B239]" />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="bg-[#111] rounded-2xl border border-gray-800 border-dashed p-10 text-center">
                            <span className="text-4xl mb-3 block">💼</span>
                            <p className="text-gray-400 font-medium">No jobs available at the moment.</p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <JobCard
                                key={job.job_id}
                                job={job}
                                user={user}
                                onDelete={onDeleteJob}
                                onApply={onApply}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: My Applications */}
            {user && (user.role === "student" || user.role === "alumni") && (
                <MyApplicationsSidebar
                    myApplications={myApplications}
                    loadingApplications={loadingApplications}
                />
            )}
        </div>
    );
};

export default JobPostTab;
