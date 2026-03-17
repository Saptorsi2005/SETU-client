import React from "react";
import { FaTimes } from "react-icons/fa";

const ApplyJobModal = ({
    isOpen,
    onClose,
    applicationData,
    onDataChange,
    onSubmit,
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
                <h2 className="text-white text-2xl font-semibold mb-6">Apply for Job</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">
                            Resume URL (e.g., Google Drive, Dropbox)
                        </label>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={applicationData.resume_url}
                            onChange={(e) => onDataChange({ ...applicationData, resume_url: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Full Name *</label>
                        <input
                            type="text"
                            value={applicationData.full_name}
                            onChange={(e) => onDataChange({ ...applicationData, full_name: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Email *</label>
                        <input
                            type="email"
                            value={applicationData.email}
                            onChange={(e) => onDataChange({ ...applicationData, email: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Phone Number *</label>
                        <input
                            type="tel"
                            value={applicationData.phone}
                            onChange={(e) => onDataChange({ ...applicationData, phone: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Current Location *</label>
                        <input
                            type="text"
                            value={applicationData.location}
                            onChange={(e) => onDataChange({ ...applicationData, location: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Years of Experience *</label>
                            <input
                                type="number"
                                min="0"
                                value={applicationData.experience_years}
                                onChange={(e) => onDataChange({ ...applicationData, experience_years: e.target.value })}
                                className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Expected Salary *</label>
                            <input
                                type="text"
                                placeholder="e.g., 8 LPA"
                                value={applicationData.expected_salary}
                                onChange={(e) => onDataChange({ ...applicationData, expected_salary: e.target.value })}
                                className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Availability / Notice Period *</label>
                        <input
                            type="text"
                            placeholder="Immediate / 15 days / 30 days"
                            value={applicationData.availability}
                            onChange={(e) => onDataChange({ ...applicationData, availability: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                            required
                        />
                    </div>

                    <div className="text-center text-gray-500 text-sm">OR</div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Paste Resume Text</label>
                        <textarea
                            placeholder="Paste your resume content here..."
                            value={applicationData.resume_text}
                            onChange={(e) => onDataChange({ ...applicationData, resume_text: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none resize-none"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Cover Letter (Optional)</label>
                        <textarea
                            placeholder="Write your cover letter..."
                            value={applicationData.cover_letter}
                            onChange={(e) => onDataChange({ ...applicationData, cover_letter: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none resize-none"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Additional Details (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g., Portfolio link, LinkedIn, etc."
                            value={applicationData.additional_details}
                            onChange={(e) => onDataChange({ ...applicationData, additional_details: e.target.value })}
                            className="w-full bg-[#111] p-3 rounded-md text-white outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#C5B239] hover:bg-[#b9a531] py-3 rounded-md text-black font-semibold transition-colors"
                    >
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyJobModal;
