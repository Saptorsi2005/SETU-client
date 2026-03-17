import React from "react";
import JobCard from "./JobCard";

const JobRecommendations = ({ recommendedJobs, user, onApply }) => {
    if (!recommendedJobs || recommendedJobs.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-amber-500 rounded-full" />
                <h2 className="text-xl font-bold tracking-wide text-gray-100 flex items-center gap-2">
                    <span className="text-2xl">✨</span> Recommended For You
                </h2>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                {recommendedJobs.map((job) => (
                    <div key={job.job_id} className="min-w-[320px] max-w-[400px] flex-shrink-0 snap-start">
                        {/* We use JobCard but wrap it in a slightly highlighted border to make it pop */}
                        <div className="bg-gradient-to-b from-[#C5B239]/10 to-transparent p-[1px] rounded-2xl h-full">
                            <JobCard
                                job={job}
                                user={user}
                                onDelete={() => { }} // Usually you don't delete from recommendations directly
                                onApply={onApply}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobRecommendations;
