import React from "react";
import { assets } from "../../assets/assets";

const PostCard = ({
    post,
    user,
    onDelete,
    onLike,
    commentText,
    onCommentChange,
    onAddComment,
    showComments,
    onToggleComments,
    comments,
}) => {
    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-gray-800 shadow-lg hover:border-gray-700 transition-all duration-200 space-y-4 group">
            {/* Author Info with Delete Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={post.author_avatar || assets.profile}
                            alt="User"
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-[#C5B239]/30 transition-all"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#111]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white group-hover:text-[#C5B239] transition-colors">
                            {post.author_name ||
                                `${post.user_role === "student" ? "Student" : "Alumni"} (ID: ${post.user_id})`}
                        </h3>
                        <p className="text-gray-500 text-xs font-medium capitalize">{post.user_role}</p>
                    </div>
                </div>

                {/* Delete button - only visible to post owner */}
                {user &&
                    (user.id === post.user_id ||
                        user.user_id === post.user_id ||
                        user.student_id === post.user_id) && (
                        <button
                            onClick={() => onDelete(post.post_id)}
                            className="text-red-400/60 hover:text-red-400 hover:bg-red-900/20 p-2.5 rounded-xl transition-all"
                            title="Delete post"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
            </div>

            {/* Post Text */}
            <p className="text-gray-200 leading-relaxed">{post.content}</p>

            {/* Post Image */}
            {post.image_url && (
                <div className="w-full rounded-xl overflow-hidden border border-gray-800 bg-black">
                    <img
                        src={post.image_url}
                        alt="Post visual"
                        className="w-full max-h-[600px] object-contain"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <button
                    onClick={() => onLike(post.post_id, post.is_liked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${post.is_liked
                            ? "text-[#C5B239] bg-[#C5B239]/10 border border-[#C5B239]/20"
                            : "text-gray-400 hover:text-[#C5B239] hover:bg-gray-800/50"
                        }`}
                >
                    👍 {post.is_liked ? "Liked" : "Like"} ({post.likes_count})
                </button>

                <button
                    onClick={() => onToggleComments(post.post_id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-[#C5B239] hover:bg-gray-800/50 transition-all"
                >
                    💬 Comment ({post.comments_count})
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-[#C5B239] hover:bg-gray-800/50 transition-all">
                    ✉️ Message
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-2 border-t border-gray-800 pt-4 space-y-3">
                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={commentText || ""}
                            onChange={(e) => onCommentChange(post.post_id, e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") onAddComment(post.post_id);
                            }}
                            placeholder="Write a comment..."
                            className="flex-1 bg-black/40 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#C5B239]/50 transition-colors text-sm"
                        />
                        <button
                            onClick={() => onAddComment(post.post_id)}
                            className="bg-[#C5B239] text-black px-5 py-2.5 rounded-xl hover:bg-[#d4c04a] transition-all font-semibold text-sm"
                        >
                            Post
                        </button>
                    </div>

                    {/* Display Comments */}
                    <div className="space-y-2">
                        {comments?.length > 0 ? (
                            comments.map((comment) => (
                                <div
                                    key={comment.comment_id}
                                    className="bg-gray-900/50 p-3.5 rounded-xl border border-gray-800"
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C5B239] to-[#a89628] flex items-center justify-center text-black text-xs font-bold">
                                            {comment.user_role?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 capitalize">
                                            {comment.user_role}
                                        </span>
                                        <span className="text-xs text-gray-600">•</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed pl-8">
                                        {comment.comment_text}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
