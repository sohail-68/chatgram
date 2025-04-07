import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import {
  likePost,
  commentOnPost,
  Del,
} from "../services/api";
import { HeartIcon, BookmarkIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import {
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaEdit,
  FaEllipsisV,
  FaBookmark,
  FaCommentDots,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles
const Post = ({ post, handleDeleteSuccess }) => {
  const [comment, setComment] = useState("");
  const [menu, setMenu] = useState(""); // Menu state for managing different UI views
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const isPostLiked = post.likes.some(
      (like) => like.user === sessionStorage.getItem("userid")
    );
    setLiked(isPostLiked);
  }, [post.likes]);

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      const updatedPost = await likePost(post._id);
      const isLiked = updatedPost.data.post.likes.some(
        (like) => like.user === sessionStorage.getItem("userid")
      );
      setLiked(isLiked);
      setLikesCount(updatedPost.data.post.likes.length);
    } catch (error) {
      console.error("Error liking post:", error);
      setLiked(!liked); // Revert like on error
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await commentOnPost(post._id, { text: comment });
      setComment("");
  
      // Toast notification for success
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error commenting on post:", error);
  
      // Toast notification for error
      toast.error("Failed to post comment. Please try again.");
    }
  };
  

  const handleEdit = () =>
    navigate(`create/${post._id}`, { state: { post } });

  const handleDelete = async () => {
    try {
      await Del(post._id);
      handleDeleteSuccess(post._id);
  
      // Toast notification for success
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
  
      // Toast notification for error
      toast.error("Failed to delete post. Please try again.");
    }
  };
  

  const openUserProfile = () => {
    if (post.user._id === sessionStorage.getItem("userid")) {
      navigate("/profile");
    } else {
      navigate(`/userprofile/${post.user._id}`, { state: { post } });
    }
  };

  const handleSave = async (data) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");
  
      await axios.post(
        `http://localhost:5001/api/auth/bookmark/${data}`,
        {},
        { headers: { Authorization: `${token}` } }
      );
  
      // Toast notification for success
      toast.success("Post bookmarked successfully!");
    } catch (error) {
      console.error("Error bookmarking post:", error);
  
      // Toast notification for error
      toast.error("Failed to bookmark post. Please try again.");
    }
  };
  

  const toggleMenu = (newState) => {
    // Toggle between menu and comment input
    setMenu(menu === newState ? "" : newState);
  };
  const moods = {
    normal: "😐",
    happy: "😊",
    sad: "😢",
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative rounded-2xl shadow-lg bg-white p-4 mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-10 h-10 rounded-full overflow-hidden"
            whileHover={{ scale: 1.1 }}
          >
            <img
              src={post.user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h6
            className="text-slate-800 font-semibold cursor-pointer"
            onClick={openUserProfile}
          >
            {post.user.username}
          </h6>
        </div>
        {post.user._id === sessionStorage.getItem("userid") && (
          <FaEllipsisV
            className="text-gray-600 cursor-pointer"
            onClick={() => toggleMenu("menu")}
          />
        )}
      </div>

      {post.image && (
        <motion.div
          className="mb-4"
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={post.image}
            alt="Post"
            className="w-full h-auto max-h-[500px] object-contain rounded-lg"
          />
        </motion.div>
      )}

      <div className="space-y-3">
        <motion.p
          ref={ref}
          className="text-lg xl:max-w-sm max-md:max-w-xs font-semibold text-gray-800 bg-gray-100 p-3 rounded-lg shadow-md"
          initial={{ opacity: 0 ,y:-1000}}
          animate={{ opacity: 1 ,y:0, transition: { duration: 2 }}}
        >
             <span className="font-bold text-gray-900">Caption</span>

        :{post.caption ? post.caption.toUpperCase() : "No Caption Provided"}
        </motion.p>

        {/* Mood */}
        <motion.p
          ref={ref}
     className="text-lg xl:max-w-sm max-md:max-w-xs font-semibold text-gray-800 bg-gray-100 p-3 rounded-lg shadow-md"
          initial={{ opacity: 0 ,x:-1000}}
          animate={{ opacity: 1 ,x:0, transition: { duration: 2 }}}
        >
          <span className="font-bold text-gray-900">Mood:</span>
          {post.mood === "Normal"
            ? `${post.mood} ${moods.normal}`
            : post.mood === "Sad"
            ? `${post.mood} ${moods.sad}`
            : post.mood === "Happy"
            ? `${post.mood} ${moods.happy}`
            : "Unknown"}
        </motion.p>
      </div>
      <div className="flex  relative top-5 gap-1">
  {/* Like Button */}
  <motion.button
    onClick={handleLike}
    className="group flex  items-center gap-2 text-gray-700 hover:text-red-500 transition-all duration-300"
    aria-label={liked ? "Unlike post" : "Like post"}
    whileTap={{ scale: 0.9 }}
    initial={{y:-1000}}
    animate={{ opacity: 1 ,y:0, transition: { duration: 2 }}}
    
  >
    {liked ? (
      <FaHeart className="w-6 h-6 text-red-500 group-hover:scale-110 transition-all duration-300" />
    ) : (
      <HeartIcon className="w-6 h-6 text-gray-700 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300" />
    )}
    <span className="text-lg font-medium">{likesCount}</span>
  </motion.button>

  {/* Save Button */}
  <motion.button
    onClick={() => handleSave(post._id)}
    className="group flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-all duration-300"
    whileTap={{ scale: 0.9 }}
    initial={{y:-1000}}
    animate={{ opacity: 1 ,y:0, transition: { duration: 2 }}}
  >
    <BookmarkIcon className="w-6 h-6 text-gray-700 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
    <span className="text-lg font-medium">Save</span>
  </motion.button>

  {/* Comment Button */}
  <motion.button
    onClick={() => toggleMenu("comment")}
    className="group flex items-center gap-2 text-gray-700 hover:text-green-500 transition-all duration-300"
    whileTap={{ scale: 0.9 }}
    initial={{y:-1000}}
    animate={{ opacity: 1 ,y:0, transition: { duration: 2 }}}
  >
    <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-gray-700 group-hover:text-green-500 group-hover:scale-110 transition-all duration-300" />
    <span className="text-lg font-medium">Comment</span>
  </motion.button>
</div>;

      {menu === "comment" && (
        <motion.form
          onSubmit={handleComment}
          className="flex items-center gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
        >
          <input
            type="text"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded p-2 w-full text-sm"
          />
          <button type="submit" className="text-blue-500">
            Post
          </button>
        </motion.form>
      )}

      {menu === "menu" && (
        <motion.div
          className="absolute top-12 right-0 bg-gray-950 w-40 shadow-md rounded-lg p-2 mt-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
        >
          <button
            className="text-blue-800 font-semibold hover:text-white mb-2 block"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </motion.div>
      )}
 <ToastContainer
  position="top-right"
  autoClose={2000} // Automatically close after 2 seconds
  hideProgressBar={false} // Show a progress bar
  newestOnTop // Keep the newest notifications on top
  closeOnClick // Allow users to close by clicking
  pauseOnHover // Pause the timer when hovered
  draggable // Allow dragging to dismiss
  theme="colored" // Use a colored theme
/>

    </motion.div>
  );
};

export default Post;
