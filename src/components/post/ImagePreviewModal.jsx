import React from "react";

const ImagePreviewModal = ({
    isOpen,
    imagePreview,
    imageZoom,
    onZoomChange,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-[#C5B239]">
                        Preview &amp; Adjust Image
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Image Preview Area */}
                <div className="flex-1 overflow-auto p-6 bg-[#0a0a0a] flex items-center justify-center">
                    {imagePreview && (
                        <div className="relative max-w-full max-h-full flex items-center justify-center">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    transform: `scale(${imageZoom})`,
                                    transition: "transform 0.2s ease",
                                    maxWidth: "100%",
                                    maxHeight: "70vh",
                                    objectFit: "contain",
                                }}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-4 border-t border-gray-700 space-y-4">
                    {/* Zoom Slider */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Zoom</label>
                            <span className="text-sm text-[#C5B239]">
                                {Math.round(imageZoom * 100)}%
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onZoomChange(Math.max(0.5, imageZoom - 0.1))}
                                className="bg-[#2a2a2a] hover:bg-[#333] text-white p-2 rounded-lg transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>

                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={imageZoom}
                                onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #C5B239 0%, #C5B239 ${((imageZoom - 0.5) / 1.5) * 100}%, #374151 ${((imageZoom - 0.5) / 1.5) * 100}%, #374151 100%)`,
                                }}
                            />

                            <button
                                onClick={() => onZoomChange(Math.min(2, imageZoom + 0.1))}
                                className="bg-[#2a2a2a] hover:bg-[#333] text-white p-2 rounded-lg transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>

                            <button
                                onClick={() => onZoomChange(1)}
                                className="bg-[#2a2a2a] hover:bg-[#333] text-white px-3 py-2 rounded-lg transition text-sm"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-[#C5B239] hover:bg-[#b9a531] text-black py-3 rounded-lg transition font-medium"
                        >
                            Use This Image
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        Tip: Adjust the zoom to fit your image perfectly. The image will be optimized for posting.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImagePreviewModal;
