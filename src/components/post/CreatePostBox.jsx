import React from "react";

const CreatePostBox = ({
    newPost,
    setNewPost,
    onPost,
    onImageSelect,
    onRemoveImage,
}) => {
    return (
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#111] p-5 rounded-2xl border border-gray-800 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5B239]/5 rounded-full blur-3xl pointer-events-none" />

            <textarea
                value={newPost.text}
                onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                placeholder="What's on your mind? Share with your network..."
                rows={3}
                className="w-full bg-black/40 text-white p-4 rounded-xl outline-none resize-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500 relative z-10"
            />

            {/* Image upload */}
            <div className="flex items-center gap-3 relative z-10">
                <label className="cursor-pointer bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-gray-700 hover:border-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span className="text-sm font-medium">Add Photo</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageSelect}
                        className="hidden"
                    />
                </label>

                {newPost.image && (
                    <span className="text-green-400 text-sm flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Image added
                    </span>
                )}
            </div>

            {/* Image preview */}
            {newPost.image && (
                <div className="relative rounded-xl overflow-hidden border border-gray-700 z-10">
                    <img
                        src={URL.createObjectURL(newPost.image)}
                        alt="Preview"
                        className="w-full max-h-96 object-contain bg-black"
                    />
                    <button
                        onClick={onRemoveImage}
                        className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 transition-all shadow-lg backdrop-blur-sm"
                        title="Remove image"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="flex justify-end relative z-10">
                <button
                    onClick={onPost}
                    className="bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-[#C5B239]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default CreatePostBox;
