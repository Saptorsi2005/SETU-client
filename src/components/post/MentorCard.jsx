import React from "react";

const MentorCard = ({ mentor, onConnect, navigate }) => {
    return (
        <div className="bg-[#111] p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-200 group shadow-lg">
            <div className="flex items-center gap-3">
                <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-[#C5B239]/40 transition-all"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#C5B239] transition-colors truncate">
                        {mentor.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{mentor.skill}</p>
                </div>
                <span className="text-xs font-bold text-[#C5B239] bg-[#C5B239]/10 px-2 py-1 rounded-lg border border-[#C5B239]/20">
                    {mentor.match}%
                </span>
            </div>

            {/* Match bar */}
            <div className="w-full bg-gray-800 rounded-full h-1.5 mt-3">
                <div
                    className="bg-gradient-to-r from-[#C5B239] to-[#d4c048] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${mentor.match}%` }}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => navigate(`/mentor/${mentor.id}`)}
                    className="text-xs font-medium text-gray-400 hover:text-[#C5B239] transition-colors"
                >
                    View Profile
                </button>
                <button
                    onClick={() => onConnect(mentor)}
                    className="bg-gradient-to-r from-[#C5B239] to-[#a89628] text-black text-xs font-bold px-4 py-1.5 rounded-lg hover:from-[#d4c048] hover:to-[#C5B239] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    Connect
                </button>
            </div>
        </div>
    );
};

export default MentorCard;
