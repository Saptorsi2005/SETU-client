import React from "react";
import { FaTimes } from "react-icons/fa";

const AddJobModal = ({
    isOpen,
    onClose,
    jobFormData,
    onFormChange,
    onSubmit,
    userRole,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>
                <h2 className="text-white text-2xl font-semibold mb-6">
                    {userRole === "admin" ? "Create Job" : "Request Job Posting"}
                </h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Job Title *"
                        value={jobFormData.title}
                        onChange={(e) => onFormChange({ ...jobFormData, title: e.target.value })}
                        className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Company Name *"
                        value={jobFormData.company}
                        onChange={(e) => onFormChange({ ...jobFormData, company: e.target.value })}
                        className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location (e.g., Remote, Mumbai, Bangalore)"
                        value={jobFormData.location}
                        onChange={(e) => onFormChange({ ...jobFormData, location: e.target.value })}
                        className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                    />
                    <textarea
                        placeholder="Job Description *"
                        value={jobFormData.description}
                        onChange={(e) => onFormChange({ ...jobFormData, description: e.target.value })}
                        className="w-full bg-[#111] p-3 rounded-md text-white outline-none resize-none"
                        rows={4}
                        required
                    />
                    <textarea
                        placeholder="Requirements (Optional)"
                        value={jobFormData.requirements}
                        onChange={(e) => onFormChange({ ...jobFormData, requirements: e.target.value })}
                        className="w-full bg-[#111] p-3 rounded-md text-white outline-none resize-none"
                        rows={3}
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#C5B239] hover:bg-[#b9a531] py-3 rounded-md text-black font-semibold transition-colors"
                    >
                        {userRole === "admin" ? "Create Job" : "Submit Request"}
                    </button>
                    {userRole === "alumni" && (
                        <p className="text-gray-400 text-sm text-center">
                            Your job posting will be visible after admin approval.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddJobModal;
