import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const JobSearchFilters = ({
    searchTerm,
    setSearchTerm,
    experience,
    setExperience,
    packageLevel,
    setPackageLevel,
    skills,
    setSkills,
    jobType,
    setJobType,
}) => {
    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-gray-800 shadow-lg mb-6">
            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search jobs by title, company, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1a1a] text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-[#C5B239] transition-colors"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 text-gray-300">
                        <FaFilter className="text-[#C5B239]" />
                        <span className="font-semibold">Advanced Filters:</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                    {/* Skills Input */}
                    <input
                        type="text"
                        placeholder="Skills (e.g. React, Python)"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-[#C5B239] text-sm"
                    />

                    {/* Experience Dropdown */}
                    <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-[#C5B239] text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Any Experience</option>
                        <option value="Fresher">Fresher (0 years)</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                    </select>

                    {/* Package Dropdown */}
                    <select
                        value={packageLevel}
                        onChange={(e) => setPackageLevel(e.target.value)}
                        className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-[#C5B239] text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Any Package</option>
                        <option value="Under 5 LPA">Under 5 LPA</option>
                        <option value="5-10 LPA">5-10 LPA</option>
                        <option value="10-20 LPA">10-20 LPA</option>
                        <option value="20+ LPA">20+ LPA</option>
                    </select>

                    {/* Job Type Dropdown */}
                    <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-[#C5B239] text-sm appearance-none cursor-pointer"
                    >
                        <option value="">Any Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default JobSearchFilters;
