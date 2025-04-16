// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ImagetoBase64 } from "../utility/ImagetoBase64.js";
import { FaBookmark, FaHeart, FaTrashAlt } from "react-icons/fa";
import useChatMessages from "../hooks/useChatMessages.jsx";
import { Del } from "../services/api.jsx";
import { Pencil, Trash2 } from "lucide-react";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [use, setuse] = useState([]);
  const [count, setcount] = useState([]);
const {bookmarks,setbookmarks} =useChatMessages()

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/auth/myprofile",
          {
            headers: { Authorization: token },
          }
        );
       //response);
console.log(response);

setUser(response.data.user);
setMessage(response.data.message);
        setFormData({
          username: response.data.user.username,
          email: response.data.user.email,
          bio: response.data.user.bio,
          profilePicture: response.data.user.profilePicture,
          gender: response.data.user.gender,
        });
        sessionStorage.setItem("profile", JSON.stringify(response.data.user));
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle input changes
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files?.length > 0) {
      const data = await ImagetoBase64(files[0]);
     //data);

      if (data) {
        setFormData((prev) => ({
          ...prev,
          profilePicture: data, // Set profilePicture as a Base64 string
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => setEditMode((prev) => !prev);

  // Handle form submission
  const handleSave = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5001/api/auth/myprofile",
        formData,
        { headers: { Authorization: token } }
      );
      setUser(response.data.user);

      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };
  console.log(user);
  
  const fetchUserProfilUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/userpost/all`,
        {
          headers: {
            Authorization: `${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      
      setuse(response.data);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
 //use);
console.log(use);

  const Count = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/user/postCount`,
        {
          headers: {
            Authorization: `${sessionStorage.getItem("token")}`, // Add "Bearer" before the token
          },
        }
      );
  
      setcount(response.data.postCount); // Set only the post count
     //"Response data:", response.data);
    } catch (error) {
      console.error('Error fetching user post count:', error.message);
    }
  };
  
  const Bookmark = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/auth/bookmarked",
        {
          headers: { Authorization: sessionStorage.getItem("token") },
        }
      );
      console.log(response);
      
     //response.data);
      setbookmarks(response.data.bookmarks)
      
      
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };
  console.log("bbok",bookmarks);
  
 //bookmarks);
  const del = async () => {
    
    try {
      const token =sessionStorage.getItem("token"); // Retrieve token from sessionStorage
      if (!token) throw new Error("User not authenticated");
  
      // Make POST request to bookmark API
      const response = await axios.delete(
        `http://localhost:5001/api/auth/users/bookmarks`,
        {
          headers: { Authorization: `${token}` },
        }
      );
  
     //"del bookmarked:", response.data); // Optional logging for confirmation
      setbookmarks([])
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };


  useEffect(()=>{
    fetchUserProfilUser()

    Count()
    window.addEventListener("resize", function(){
      if(this.window.innerWidth>700){
        setShow(true)
      }
    });
  },[])
  
 useEffect(()=>{
  // del()

 },[])
 useEffect(()=>{
  Bookmark();


 },[])
 const handleDelete = async (postId) => {
  try {
    await Del(postId);
    fetchUserProfilUser()

  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

 console.log(use);
 const moods = {
  Normal: "😐",
  Happy: "😊",
  Sad: "😢",
};

function Chnage(){
  navigate("/changepassword")
}
  return (
   <div className={`h-screen`}>
     <div className=" bg-white shadow-lg rounded-lg p-4">
    

      {/* Profile Info */}
      <div className=" flex lg:flex-row xl:flex-row max-lg:flex-col max-md:flex-row max-md:gap-4 max-md:justify-center max-md:items-center max-sm:flex-row max-sm:gap-2 max-sm:justify-center max-sm:flex max-sm:items-center items-center xl:mt-1 max-xl:mt-2">
        <div className="flex flex-col gap-1">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full overflow-hidden">
          {formData.profilePicture ? (
            <img
              src={formData.profilePicture} // Show uploaded or existing profile picture
              alt={`${formData.username}'s profile`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
     
        </div>   <div className="flex flex-col items-center">
    
    {
      editMode &&   <label
      htmlFor="file-upload"
      className="custom-file-upload border border-gray-300 rounded-md py-2 px-4 cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out"
    >
      Custom Upload
    </label>
    }
     {
      editMode &&
      <input
      id="file-upload"
      type="file"
      name="profilePicture"
      onChange={handleChange}
      className="hidden" // Hide the file input
    />
     }
    </div>
        </div>

   

        {/* User Info */}
        <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
          {editMode ? (
            <>
            <input
  type="text"
  name="username"
  value={formData.username}
  onChange={handleChange}
  placeholder="Enter your username"
  className="block w-full px-4 py-2 mb-4 text-md text-black bg-transparent border border-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
/>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-2 mb-4 text-md text-black bg-transparent border border-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"

              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="block w-full px-4 py-2 mb-1 text-md text-black bg-transparent border border-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"

                placeholder="Bio"
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">
                {formData.username}
              </h2>
              <p className="text-gray-600">{formData.email}</p>
              <p className="text-gray-500 mt-2">
                {formData.bio || "No bio available"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 p-1 grid max-lg:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-lg shadow-md hover:bg-blue-100">
          <span className="block text-2xl font-bold text-blue-700">
            {user?.followers.length}
          </span>
          <span className="text-blue-600">Followers</span>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg shadow-md hover:bg-purple-100">
          <span className="block text-2xl font-bold text-purple-700">
            {user?.following.length}
          </span>
          <span className="text-purple-600">Following</span>
        </div>
        <div className="p-4 bg-green-50 rounded-lg shadow-md hover:bg-green-100">
          <span className="block text-2xl font-bold text-green-700">
            {count}
          </span>
          <span className="text-green-600">Posts</span>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg shadow-md hover:bg-yellow-100">
          <span className="block text-2xl font-bold text-yellow-700">
            {user?.bookmarks.length}
          </span>
          <span className="text-yellow-600">Bookmarks</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-x-4 pb-2 ">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-gray-950 text-white rounded-lg"
          >
            Edit Profile
          </button>
          

        )}
      
      </div>
      <button
            onClick={()=>Chnage()}
            className="px-4 py-2  bg-gray-900 text-white rounded-lg"
          >
        Change Password
          </button>


    </div>
    <div className="fixed xl:top-5 xl:right-28 z-50 flex xl:gap-2 lg:top-4 lg:right-20 lg:gap-1 md:top-4 md:gap-1 max-md:gap-1 md:right-20 max-md:top-4 max-md:right-20">
  <button
  onClick={del}
  aria-label="Remove all bookmarks"
  className="flex items-center gap-2 px-3 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 active:scale-95 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-300"
>
  <FaTrashAlt className="text-white" />
</button>

  {/* Show Bookmarks Button */}
{
  bookmarks.length && (
    <button
    onClick={() => setShow(!show)}
    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 ease-in-out"
  >
    {show &&   <FaBookmark />}
  </button>
  )
}
</div>


<div className={`grid gap-4 p-3 mt-3 ${use.length ? 'h-screen':''} sm:grid-cols-2 lg:grid-cols-3`}>
  {use.map((item, index) => (
    <div
      key={index}
      className="relative bg-white h-[500px] flex flex-col justify-between shadow-md rounded-lg overflow-hidden hover:scale-95 transition-all"
    >
      {/* Delete Button - floating top-right */}
      <button
        onClick={() => handleDelete(item._id)}
        className="absolute top-2 right-2 p-1 bg-white/70 rounded-full hover:bg-red-100 z-10 transition"
        title="Delete"
      >
        <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
      </button>

      {/* Image Section - fills most of the card */}
      <div className="flex-1">
        <img
          src={item.image}
          alt={`Post ${index}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="p-3 bg-white">
        <p className="text-sm font-medium">
          <strong>Caption:</strong> {item.caption || "No caption"}
        </p>
        <p className="text-sm font-medium">
          <strong>Mood:</strong>{" "}
          {Object.keys(moods).includes(item.mood)
            ? `${item.mood} ${moods[item.mood]}`
            : "Unknown 😶"}
        </p>
      </div>
    </div>
  ))}
</div>



{
  bookmarks.length!==0 ? (
    <div
    className={`fixed overflow-auto scroll-smooth h-screen flex-col-reverse bg-gradient-to-b from-gray-900 to-black p-6 shadow-xl top-20 right-0 transition-transform duration-300 ${
      show ? "translate-x-full" : "translate-x-0"
    } custom-scrollbar`}
  >
    <div className="flex justify-center items-center xl:flex-col gap-4 max-md:flex-col">
      {bookmarks.map((item, index) => (
        <div
          key={index}
          className="p-5 shadow-lg rounded-lg mb-6 flex flex-col items-start bg-gray-800 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-3 w-24 h-24">
            <img
              src={item.image}
              alt="Bookmarked post"
              className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
            />
          </div>
  
          <p className="text-gray-100 font-semibold mb-1">{item.caption}</p>
  
          <p className="text-gray-400 text-sm mb-2">
            {item.comments.length > 0
              ? `Comments: ${item.comments.length}`
              : "No comments"}
          </p>
  
          {item.likes.length > 0 && (
            <div className="flex items-center text-red-500">
              <FaHeart className="mr-2" />
              <span>{item.likes.length}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>   
  ) :null
}


   </div>
  );
};

export default Dashboard;
