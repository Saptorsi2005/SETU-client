import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { useUser } from "../context/UserContext";
import { jobsAPI, postsAPI, connectionsAPI } from "../services/api";
import {
  FaTimes,
  FaBriefcase,
  FaMapMarkerAlt,
  FaBuilding,
  FaUserTie,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";

// Post Components
import RecommendationsTab from "../components/post/RecommendationsTab";
import ConnectionsTab from "../components/post/ConnectionsTab";
import FeedTab from "../components/post/FeedTab";
import JobPostTab from "../components/post/JobPostTab";
import ApplyJobModal from "../components/post/ApplyJobModal";
import AddJobModal from "../components/post/AddJobModal";
import ImagePreviewModal from "../components/post/ImagePreviewModal";

// Helper function to get random avatar
const getRandomAvatar = () => {
  const avatars = [
    assets.person1,
    assets.person2,
    assets.person3,
    assets.person4,
    assets.person5,
    assets.person6,
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

const Post = () => {
  const [activeTab, setActiveTab] = useState("recommendations");
  const navigate = useNavigate();
  const { user } = useUser();

  // Student connection requests (for alumni)
  const [studentRequests, setStudentRequests] = useState([]);
  const [loadingStudentRequests, setLoadingStudentRequests] = useState(false);

  // Jobs applied by user (student/alumni)
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);


  const [searchQuery, setSearchQuery] = useState("");

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  // Alumni job requests state
  const [myJobRequests, setMyJobRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Application form state
  const [applicationData, setApplicationData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    experience_years: "",
    expected_salary: "",
    availability: "",
    resume_url: "",
    resume_text: "",
    cover_letter: "",
    additional_details: "",
  });

  // Job creation/request form state
  const [jobFormData, setJobFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
  });

  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [connectedMentorNames, setConnectedMentorNames] = useState(new Set());

  const [connections, setConnections] = useState([]);

  // Fetch existing connections on mount
  // Fetch existing connections
  const fetchConnections = React.useCallback(async () => {
    if (!user) return;

    try {
      const response = await connectionsAPI.getAll();
      if (response.success) {
        console.log('🔍 Raw connections data:', response.connections);

        // Format connections for display
        const formattedConnections = response.connections.map((conn) => {
          // Format skills - handle both array and string formats
          let skillDisplay = conn.mentor_skill;
          if (Array.isArray(skillDisplay)) {
            skillDisplay = skillDisplay.join(', ');
          } else if (typeof skillDisplay === 'string') {
            // Already a string, use as-is
            skillDisplay = skillDisplay;
          } else {
            skillDisplay = '';
          }

          return {
            id: conn.connection_user_id, // Use the actual user ID, not connection table ID
            name: conn.mentor_name,
            skill: skillDisplay,
            avatar: conn.mentor_avatar || assets.profile,
            match: conn.match_score,
          };
        });

        console.log('📋 Formatted connections:', formattedConnections);
        setConnections(formattedConnections);

        // Track connected mentor names
        const connectedNames = new Set(
          response.connections.map((c) => c.mentor_name)
        );
        setConnectedMentorNames(connectedNames);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    }
  }, [user]);

  // Fetch connections on mount
  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    const fetchStudentRequests = async () => {
      if (!user || user.role !== "alumni") return;

      try {
        setLoadingStudentRequests(true);
        const res = await connectionsAPI.getPendingRequests();
        if (res.success) {
          setStudentRequests(res.requests);
        }
      } catch (err) {
        console.error("Failed to fetch student requests:", err);
      } finally {
        setLoadingStudentRequests(false);
      }
    };

    fetchStudentRequests();
  }, [user]);

  // Fetch mentors from AI model
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("❌ No token in localStorage");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/mentor-recommend`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ Mentor API raw data:", res.data);

        const formatted = res.data.map((m, index) => {
          console.log(`🔍 Mentor ${index} - ${m.name}:`, {
            match_percentage: m.match_percentage,
            score: m.score,
            skill_match_count: m.skill_match_count,
            calculated_match: m.match_percentage !== undefined ? m.match_percentage : Math.round((m.score || 0.5) * 100)
          });
          return {
            id: m.id || index,
            name: m.name,
            skill: m.skills.join(", "),
            match: m.match_percentage !== undefined ? m.match_percentage : Math.round((m.score || 0.5) * 100),
            avatar: m.profile_image || assets.profile,
          };
        });

        console.log("📋 Formatted mentors:", formatted);
        setRecommendedMentors(formatted);
      } catch (err) {
        console.error(
          "❌ Mentor fetch error:",
          err.response?.data || err.message
        );
      }
    };

    fetchMentors();
  }, []);




  const handleConnect = async (mentor) => {
    try {
      // Check if user is logged in
      if (!user) {
        alert("Please log in to connect with mentors");
        return;
      }

      // Save connection to database
      const response = await connectionsAPI.create({
        receiver_id: mentor.id,
        mentor_name: mentor.name,
        mentor_skill: mentor.skill,
        match_score: mentor.match,
        mentor_identifier: `${mentor.id}`,
      });

      if (response.success) {
        // Mark as pending (don't add to connections yet)
        setConnectedMentorNames((prev) => new Set([...prev, mentor.name]));

        // Remove from recommendations
        setRecommendedMentors((prev) => prev.filter((m) => m.id !== mentor.id));

        // Show pending status message
        alert(`Connection request sent to ${mentor.name}! Waiting for approval.`);
      }
    } catch (error) {
      console.error("Failed to connect:", error);

      // Handle duplicate connection
      if (error.response?.data?.alreadyConnected) {
        alert("You are already connected with this mentor");
        setConnectedMentorNames((prev) => new Set([...prev, mentor.name]));
        setRecommendedMentors((prev) => prev.filter((m) => m.id !== mentor.id));
      } else if (error.response?.data?.message?.includes("already sent")) {
        alert("Connection request already sent to this mentor");
        setConnectedMentorNames((prev) => new Set([...prev, mentor.name]));
        setRecommendedMentors((prev) => prev.filter((m) => m.id !== mentor.id));
      } else {
        alert("Failed to send connection request. Please try again.");
      }
    }
  };
  const handleAcceptRequest = async (requestId) => {
    try {
      const res = await connectionsAPI.acceptRequest(requestId);
      if (res.success) {
        setStudentRequests(prev => prev.filter(r => r.request_id !== requestId));
        fetchConnections(); // refresh mentor list
        alert("Connection accepted!");
      }
    } catch (err) {
      console.error("Accept failed:", err);
      alert("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const res = await connectionsAPI.rejectRequest(requestId);
      if (res.success) {
        setStudentRequests(prev => prev.filter(r => r.request_id !== requestId));
        alert("Request rejected");
      }
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject request");
    }
  };


  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // 🔹 Create Post state
  const [newPost, setNewPost] = useState({
    text: "",
    image: null,
  });

  // 🔹 Image preview and crop state
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImageFile, setTempImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);

  // 🔹 Create Post handler
  const handleCreatePost = async () => {
    if (!newPost.text.trim() && !newPost.image) {
      alert("Please enter some text or select an image");
      return;
    }

    if (!user) {
      alert("Please log in to create a post");
      return;
    }

    try {
      console.log("Creating post...", { user, content: newPost.text });

      const response = await postsAPI.create({
        content: newPost.text,
        image: newPost.image,
      });

      console.log("Post response:", response);

      if (response.success) {
        // Add the new post to the feed
        const formattedPost = {
          post_id: response.post.post_id,
          user_id: response.post.user_id,
          user_role: response.post.user_role,
          content: response.post.content,
          image_url: response.post.image_url,
          created_at: response.post.created_at,
          author_name: response.post.author_name,
          author_avatar: response.post.author_avatar,
          likes_count: response.post.likes_count || 0,
          comments_count: response.post.comments_count || 0,
          is_liked: response.post.is_liked || false,
        };

        setPosts((prev) => [formattedPost, ...prev]);
        setNewPost({ text: "", image: null });
        alert("Post created successfully!");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to create post: ${errorMsg}`);
    }
  };

  // 🔹 Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      setTempImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setShowImageModal(true);
      setImageZoom(1);
    }
  };

  // 🔹 Confirm and use the selected image
  const handleConfirmImage = async () => {
    if (!tempImageFile) return;

    const img = new Image();
    img.src = imagePreview;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      width *= imageZoom;
      height *= imageZoom;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          const processedFile = new File([blob], tempImageFile.name, {
            type: tempImageFile.type,
            lastModified: Date.now(),
          });

          setNewPost({ ...newPost, image: processedFile });
          setShowImageModal(false);
          setTempImageFile(null);
        },
        tempImageFile.type,
        0.9
      );
    };
  };

  // 🔹 Cancel image selection
  const handleCancelImage = () => {
    setShowImageModal(false);
    setTempImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageZoom(1);
  };

  // 🔹 Remove selected image from post
  const handleRemoveImage = () => {
    if (newPost.image) {
      setNewPost({ ...newPost, image: null });
    }
  };

  // 🔹 Delete post handler
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await postsAPI.delete(postId);

      if (response.success) {
        setPosts((prev) => prev.filter((post) => post.post_id !== postId));
        alert("Post deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to delete post: ${errorMsg}`);
    }
  };

  // 🔹 Like/Unlike handler
  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await postsAPI.unlike(postId);
      } else {
        await postsAPI.like(postId);
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.post_id === postId
            ? {
              ...post,
              is_liked: !isLiked,
              likes_count: isLiked
                ? post.likes_count - 1
                : post.likes_count + 1,
            }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
      alert("Failed to update like");
    }
  };

  // 🔹 Comment state and handler
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text || !text.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const response = await postsAPI.addComment(postId, text);

      if (response.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post.post_id === postId
              ? { ...post, comments_count: post.comments_count + 1 }
              : post
          )
        );

        setCommentText((prev) => ({ ...prev, [postId]: "" }));

        if (showComments[postId]) {
          fetchComments(postId);
        }
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment");
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await postsAPI.getComments(postId);
      if (response.success) {
        setComments((prev) => ({ ...prev, [postId]: response.comments }));
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const toggleComments = (postId) => {
    const isCurrentlyShowing = showComments[postId];
    setShowComments((prev) => ({ ...prev, [postId]: !isCurrentlyShowing }));

    if (!isCurrentlyShowing && !comments[postId]) {
      fetchComments(postId);
    }
  };

  // Fetch jobs when jobpost tab is active
  useEffect(() => {
    if (activeTab === "jobpost") {
      fetchJobs();
      fetchMyJobRequests();
    }
  }, [activeTab]);

  // Fetch posts when feed tab is active
  useEffect(() => {
    if (activeTab === "feed") {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await postsAPI.getAll({ page: postsPage, limit: 10 });

      if (response.success) {
        setPosts(response.posts);
        setHasMorePosts(response.pagination.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await jobsAPI.getAll();
      if (response.success) {
        setJobs(response.data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      alert("Failed to load jobs. Please try again later.");
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch alumni job requests
  const fetchMyJobRequests = async () => {
    if (user?.role !== "alumni") return;

    try {
      setLoadingRequests(true);
      const response = await jobsAPI.getMyRequests();
      if (response.success) {
        setMyJobRequests(response.data || response.requests || []);
      }
    } catch (err) {
      console.error("Error fetching job requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!user) return;

      try {
        setLoadingApplications(true);
        const res = await jobsAPI.getMyApplications(); // ⚠️ backend required
        if (res.success) {
          setMyApplications(res.data || res.applications || []);
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoadingApplications(false);
      }
    };

    if (activeTab === "jobpost") {
      fetchMyApplications();
    }
  }, [user, activeTab]);


  // Delete job handler
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      const response = await jobsAPI.deleteJob(jobId);

      if (response.success) {
        setJobs((prev) => prev.filter((job) => job.job_id !== jobId));
        alert("Job deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to delete job";
      alert(errorMsg);
    }
  };

  // Delete pending job request handler (for alumni)
  const handleDeletePendingRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this job request?")) {
      return;
    }

    try {
      const response = await jobsAPI.deletePendingRequest(requestId);

      if (response.success) {
        setMyJobRequests((prev) =>
          prev.filter((req) => req.request_id !== requestId)
        );
        alert("Job request deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete job request:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete job request";
      alert(errorMsg);
    }
  };

  const handleApplyForJob = async (e) => {
    e.preventDefault();

    if (
      !applicationData.full_name ||
      !applicationData.email ||
      !applicationData.phone ||
      !applicationData.location ||
      !applicationData.experience_years ||
      !applicationData.expected_salary ||
      !applicationData.availability
    ) {
      alert("Please fill all required candidate details.");
      return;
    }

    try {
      const response = await jobsAPI.apply(showApplyModal, applicationData);
      if (response.success) {
        alert("Application submitted successfully!");
        setShowApplyModal(null);
        setApplicationData({
          full_name: "",
          email: "",
          phone: "",
          location: "",
          experience_years: "",
          expected_salary: "",
          availability: "",
          resume_url: "",
          resume_text: "",
          cover_letter: "",
          additional_details: "",
        });

        fetchJobs();
      }
    } catch (err) {
      console.error("Application error:", err);
      alert(
        err.response?.data?.message ||
        "Failed to submit application. Please try again."
      );
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();

    console.log("=== Job Submission Debug ===");
    console.log("User from context:", user);
    console.log("User role:", user?.role);
    console.log("Token in localStorage:", localStorage.getItem("token"));

    if (!jobFormData.title || !jobFormData.company || !jobFormData.description) {
      alert("Please fill in title, company, and description.");
      return;
    }

    try {
      let response;
      if (user?.role === "admin") {
        console.log("Admin creating job with data:", jobFormData);
        response = await jobsAPI.create(jobFormData);
      } else if (user?.role === "alumni") {
        const requestData = {
          job_title: jobFormData.title,
          company: jobFormData.company,
          location: jobFormData.location,
          description: jobFormData.description,
          requirements: jobFormData.requirements,
        };
        console.log("Alumni submitting job request:", requestData);
        response = await jobsAPI.requestJob(requestData);
        console.log("Response received:", response);
      } else {
        alert(
          "You don't have permission to create jobs. Your role: " +
          (user?.role || "not logged in")
        );
        return;
      }

      if (response && response.success) {
        const message =
          user?.role === "admin"
            ? "Job created and published successfully!"
            : "Job request submitted successfully! It will be visible after admin approval.";
        alert(message);
        setShowAddJobModal(false);
        setJobFormData({
          title: "",
          company: "",
          location: "",
          description: "",
          requirements: "",
        });
        if (user?.role === "admin") {
          fetchJobs();
        } else if (user?.role === "alumni") {
          fetchMyJobRequests();
        }
      }
    } catch (err) {
      console.error("=== Error Details ===");
      console.error("Full error:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit job request. Please try again.";
      alert("ERROR: " + errorMessage);
    }
  };

  // Filter mentors: exclude already connected ones, apply search, sort by match
  const filteredMentors = recommendedMentors
    .filter((m) => !connectedMentorNames.has(m.name))
    .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.match - a.match)
    .slice(0, 50);

  return (
    <div>
      <Navbar />

      <div className="pt-24 min-h-screen bg-[#0d0d0d] text-white p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 pb-6 mb-6 border-b border-gray-800">
          {["recommendations", "connections", "feed", "jobpost"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-xl font-semibold transition-all duration-200 ${activeTab === tab
                ? "bg-gradient-to-r from-[#C5B239] to-[#a89628] text-black shadow-lg shadow-[#C5B239]/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-700"
                }`}
            >
              {tab === "jobpost" ? "Job Post" : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto space-y-6">
          {activeTab === "recommendations" && (
            <RecommendationsTab
              filteredMentors={filteredMentors}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onConnect={handleConnect}
              navigate={navigate}
            />
          )}

          {activeTab === "connections" && (
            <ConnectionsTab
              connections={connections}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              user={user}
              studentRequests={studentRequests}
              loadingStudentRequests={loadingStudentRequests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              navigate={navigate}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "feed" && (
            <FeedTab
              newPost={newPost}
              setNewPost={setNewPost}
              onPost={handleCreatePost}
              onImageSelect={handleImageSelect}
              onRemoveImage={handleRemoveImage}
              loadingPosts={loadingPosts}
              posts={posts}
              user={user}
              onDeletePost={handleDeletePost}
              onLike={handleLike}
              commentText={commentText}
              onCommentChange={(postId, text) =>
                setCommentText((prev) => ({ ...prev, [postId]: text }))
              }
              onAddComment={handleAddComment}
              showComments={showComments}
              onToggleComments={toggleComments}
              comments={comments}
            />
          )}

          {activeTab === "jobpost" && (
            <JobPostTab
              user={user}
              jobs={jobs}
              loadingJobs={loadingJobs}
              myJobRequests={myJobRequests}
              loadingRequests={loadingRequests}
              myApplications={myApplications}
              loadingApplications={loadingApplications}
              onDeleteJob={handleDeleteJob}
              onDeletePendingRequest={handleDeletePendingRequest}
              onApply={(jobId) => setShowApplyModal(jobId)}
              onOpenAddJobModal={() => setShowAddJobModal(true)}
            />
          )}
        </div>
      </div>

      <ApplyJobModal
        isOpen={!!showApplyModal}
        onClose={() => {
          setShowApplyModal(null);
          setApplicationData({
            full_name: "",
            email: "",
            phone: "",
            location: "",
            experience_years: "",
            expected_salary: "",
            availability: "",
            resume_url: "",
            resume_text: "",
            cover_letter: "",
            additional_details: "",
          });
        }}
        applicationData={applicationData}
        onDataChange={setApplicationData}
        onSubmit={handleApplyForJob}
      />

      <AddJobModal
        isOpen={showAddJobModal}
        onClose={() => {
          setShowAddJobModal(false);
          setJobFormData({
            title: "",
            company: "",
            location: "",
            description: "",
            requirements: "",
          });
        }}
        jobFormData={jobFormData}
        onFormChange={setJobFormData}
        onSubmit={handleAddJob}
        userRole={user?.role}
      />

      <ImagePreviewModal
        isOpen={showImageModal}
        imagePreview={imagePreview}
        imageZoom={imageZoom}
        onZoomChange={setImageZoom}
        onConfirm={handleConfirmImage}
        onCancel={handleCancelImage}
      />
    </div>
  );
};

export default Post;
