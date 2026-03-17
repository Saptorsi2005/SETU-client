import React from "react";
import MentorCard from "./MentorCard";

const RecommendationsTab = ({
    filteredMentors,
    searchQuery,
    onSearchChange,
    onConnect,
    navigate,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full" />
                <h2 className="text-xl font-bold tracking-wide text-gray-100">
                    Mentor Recommendations
                </h2>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search mentors by name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-black/40 text-white p-3.5 rounded-xl outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500"
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMentors.map((mentor) => (
                    <MentorCard
                        key={mentor.id}
                        mentor={mentor}
                        onConnect={onConnect}
                        navigate={navigate}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecommendationsTab;
