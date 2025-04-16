import React, { useEffect, useState } from "react";
import { createPost, Edit } from "../services/api";
import { ImagetoBase64 } from "../utility/ImagetoBase64.js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [mood, setMood] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const[imgpr,setPreviewImage]=useState(null)
  
  const location = useLocation();
const navigate=useNavigate()
  // Initialize form fields for edit mode
  useEffect(() => {
    if (location.state?.post) {
      const { caption, image, mood } = location.state.post;
      setCaption(caption);
      setMood(mood);
      setImage(image);
    }
  }, [location.state]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);   
        setPreviewImage(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (location.state?.post) {
        // Update existing post
        const data = await Edit(location.state.post._id, {
          caption,
          image,
          mood,
        });
        toast.success("Post updated successfully!");

        setTimeout(() => {
        navigate("/")
          
        }, 3000);
        console.log("Post updated:", data);
      } else {
        // Create a new post
        const data = await createPost({ caption, image, mood });
        console.log(data);
        
        toast.success("Post created successfully!");
        console.log("Post created:", data);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the post.");
      console.error("Error submitting post:", error);
    } finally {
      setLoading(false);
    }
  };

  const moods = {
    normal: "😐",
    happy: "😊",
    sad: "😢",
  };

  return (
    <div>
      <div className="flex justify-center min-h-screen items-center bg-gradient-to-br from-[#6B73FF] via-[#ddd6f3] to-[#faaca8] px-4 sm:px-8 lg:px-16 xl:px-32">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-300"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            {location.state?.post ? "Edit Post" : "Create a New Post"}
          </h2>

          {/* Caption Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg"
            />
          </div>

          {/* Mood Selector */}
          <label
            htmlFor="mood"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Select Mood:
          </label>
          <select
            id="mood"
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            onChange={(e) => setMood(e.target.value)}
            value={mood}
          >
            <option value="Normal">Normal</option>
            <option value="Sad">Sad</option>
            <option value="Happy">Happy</option>
          </select>

          {/* Image Input */}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="block text-gray-600 mb-2 cursor-pointer"
            >
              Upload an image
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          {/* Image Preview */}
          {imgpr && (
    <img
      src={imgpr}
      alt="Preview"
      className="w-40 h-40 object-cover rounded-full border shadow"
    />
  )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out ${
              loading ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : location.state?.post
              ? "Update Post"
              : "Create Post"}
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default CreatePost;
