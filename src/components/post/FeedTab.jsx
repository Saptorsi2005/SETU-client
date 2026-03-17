import React from "react";
import CreatePostBox from "./CreatePostBox";
import PostCard from "./PostCard";

const FeedTab = ({
    newPost,
    setNewPost,
    onPost,
    onImageSelect,
    onRemoveImage,
    loadingPosts,
    posts,
    user,
    onDeletePost,
    onLike,
    commentText,
    onCommentChange,
    onAddComment,
    showComments,
    onToggleComments,
    comments,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full" />
                <h2 className="text-xl font-bold tracking-wide text-gray-100">Feed</h2>
            </div>

            <CreatePostBox
                newPost={newPost}
                setNewPost={setNewPost}
                onPost={onPost}
                onImageSelect={onImageSelect}
                onRemoveImage={onRemoveImage}
            />

            {/* Loading state */}
            {loadingPosts && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C5B239]" />
                </div>
            )}

            {/* Posts */}
            {!loadingPosts &&
                posts.map((post) => (
                    <PostCard
                        key={post.post_id}
                        post={post}
                        user={user}
                        onDelete={onDeletePost}
                        onLike={onLike}
                        commentText={commentText[post.post_id]}
                        onCommentChange={onCommentChange}
                        onAddComment={onAddComment}
                        showComments={showComments[post.post_id]}
                        onToggleComments={onToggleComments}
                        comments={comments[post.post_id]}
                    />
                ))}

            {/* No posts message */}
            {!loadingPosts && posts.length === 0 && (
                <div className="bg-[#111] rounded-2xl border border-gray-800 border-dashed p-12 text-center">
                    <span className="text-4xl mb-3 block">📝</span>
                    <p className="text-gray-400 font-medium">No posts yet. Be the first to share!</p>
                </div>
            )}
        </div>
    );
};

export default FeedTab;
