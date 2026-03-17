import React from "react";

const ConnectionsTab = ({
    connections,
    searchQuery,
    onSearchChange,
    user,
    studentRequests,
    loadingStudentRequests,
    onAccept,
    onReject,
    navigate,
    setActiveTab,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-2">
                    <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full" />
                    <h2 className="text-xl font-bold tracking-wide text-gray-100">
                        Your Connections
                    </h2>
                </div>

                {/* Top Controls: Search + Requests */}
                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Search Bar */}
                    <div className="flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search connections by name..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-black/40 text-white p-3.5 rounded-xl outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500 h-[50px]"
                        />
                    </div>

                    {/* Student Requests Panel (Alumni Only) */}
                    {user?.role === "alumni" && (
                        <div className="w-full md:w-auto md:min-w-[320px] lg:min-w-[350px] bg-[#111] p-5 rounded-2xl border border-gray-800 self-start shadow-lg">
                            <h3 className="text-sm font-bold text-gray-200 mb-3 flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#C5B239] rounded-full" />
                                    Student Requests
                                </span>
                                {studentRequests.length > 0 && (
                                    <span className="bg-gradient-to-r from-[#C5B239] to-[#a89628] text-black text-xs px-2.5 py-0.5 rounded-full font-bold">
                                        {studentRequests.length}
                                    </span>
                                )}
                            </h3>

                            {loadingStudentRequests ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C5B239]" />
                                </div>
                            ) : studentRequests.length === 0 ? (
                                <p className="text-gray-500 text-xs text-center py-3">No pending requests</p>
                            ) : (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                    {studentRequests.map((req) => (
                                        <div
                                            key={req.request_id}
                                            className="bg-gray-900/50 p-3.5 rounded-xl border border-gray-800"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <p className="text-sm font-bold text-white">{req.student_name}</p>
                                                    <p className="text-xs text-gray-500">{req.student_skill || "Student"}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-2.5">
                                                <button
                                                    onClick={() => onAccept(req.request_id)}
                                                    className="flex-1 bg-green-600/80 hover:bg-green-600 text-white text-xs py-1.5 rounded-lg transition-colors font-semibold"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => onReject(req.request_id)}
                                                    className="flex-1 bg-red-600/80 hover:bg-red-600 text-white text-xs py-1.5 rounded-lg transition-colors font-semibold"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Connections Grid */}
            <div className="w-full">
                {connections.length === 0 ? (
                    <div className="bg-[#111] p-10 rounded-2xl text-center border border-gray-800 border-dashed">
                        <span className="text-4xl mb-3 block">🤝</span>
                        <p className="text-gray-400 mb-3 font-medium">You have no connections yet.</p>
                        <button
                            onClick={() => setActiveTab("recommendations")}
                            className="text-[#C5B239] hover:underline text-sm font-semibold"
                        >
                            Find mentors to connect with →
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {connections
                            .filter((conn) =>
                                conn.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((conn) => (
                                <div
                                    key={conn.id}
                                    onClick={() => navigate(`/connectionProfile/${conn.id}`)}
                                    className="bg-[#111] p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-200 border border-gray-800 hover:border-gray-700 shadow-lg group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={conn.avatar}
                                            alt={conn.name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-[#C5B239]/40 transition-all"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white group-hover:text-[#C5B239] transition-colors truncate">
                                                {conn.name}
                                            </h3>
                                            <p className="text-gray-500 text-xs truncate max-w-[120px]">
                                                {conn.skill || "Connected"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate("/messages", {
                                                state: {
                                                    userId: conn.id,
                                                    userName: conn.name,
                                                    userAvatar: conn.avatar,
                                                    userRole: "Mentor",
                                                },
                                            });
                                        }}
                                        className="bg-[#C5B239]/10 hover:bg-[#C5B239] text-[#C5B239] hover:text-black font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all border border-[#C5B239]/30 hover:border-[#C5B239] hover:scale-[1.02] active:scale-[0.98] shrink-0"
                                    >
                                        Message
                                    </button>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectionsTab;
