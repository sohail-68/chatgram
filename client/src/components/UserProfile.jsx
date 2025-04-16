import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaTrash, FaEdit, FaEllipsisV } from "react-icons/fa";
// import useChatMessages from '../hooks/useChatMessages';
import { io } from 'socket.io-client';
import { useChatMessages } from '../context/AuthContext'; // Make sure this path is correct


const UserProfile = () => {
  // const {messages,unreadMessages,setSocket,  setMessages,setUnreadMessages}=useChatMessages()
  const { messages,setSocket,socket ,suggestedUsers,fetchSuggestedUsers, setMessages } = useChatMessages();


  const location = useLocation();
 //location);
  
  const params = useParams();
  console.log(params,"ppp");
  
 //params);
 //location);
  const currentUserId = sessionStorage
.getItem("userid");

  const navigate=useNavigate()
  
  const [isFollowing, setIsFollowing] = useState("");
  const [data, setData] = useState(null);
  const [post, setPost] = useState([]);
  const [showChat, setShowChat] = useState(false); // Toggle for chat box visibility
  const token = sessionStorage
.getItem('token');
  const [postCount, setPostCount] = useState(null);

  // Initial check to see if the user is already following
  useEffect(() => {
    if (location.state?.isFollowing) {
      setIsFollowing(location.state.isFollowing);
    }
  }, [location.state]);

  // Toggle follow/unfollow status
  const handleFollowClick = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5001/api/auth/follow/${params.id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setIsFollowing(res.data.message);
      fetchUserProfile(); // Refresh user profile data
fetchSuggestedUsers()
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    }
  };
console.log(isFollowing);


  // Fetch user profile and post count
  const fetchUserProfile = async () => {
    try {
      const profileResponse = await axios.get(
        `http://localhost:5001/api/auth/userpro/${params.id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setData(profileResponse.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
 //data);
  console.log("da",data);
  
  const fetchPostCount = async () => {
    try {
      const postResponse = await axios.get(
        `http://localhost:5001/api/count/${params.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
     //postResponse);
      
      setPostCount(postResponse.data.postCount);
      setPost(postResponse.data.postdata); 
      // setpost(postResponse.data.postdata);
    } catch (err) {
      console.error('Error fetching post count:', err);
    }
  };
console.log("pos",post);

  useEffect(() => {
    fetchUserProfile();
    fetchPostCount();
         const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    newSocket.emit('joinRoom', currentUserId);
        // Listen for incoming messages
        newSocket.on('receiveMessage', (msg) => {
          setMessages((prev) => [...prev, msg]);
          
          // setUnreadMessages((pre)=>pre+1)

          // Show notification if the message is from the other user and the chat window is not in focus
         
      });
  }, []);

  if (!data) return <div>Loading...</div>;
function seTNew(id){
 //id);
  
  navigate(`/message/${id}`)
}
  return (
  <div>
      <div className="flex xl:justify-center xl:items-center sm:justify-start sm:p-1  ">
      <div className="flex xl:justify-center xl:items-center sm:justify-start gap-1 ">
        
        {/* User Profile Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 xl:w-32 xl:h-32 overflow-hidden rounded-full border-2 border-gray-200">
  <img 
    src={data.profilePicture} 
    alt="user" 
    className="object-cover w-full h-full" 
  />
</div>
        
        {/* User Details and Stats */}
        <div className="flex flex-col xl:justify-center xl:items-center sm:justify-start gap-4">
          
          {/* User Name and Bio */}
          <div>
            <h2 className="text-2xl font-bold">{data.username}</h2>
            <p className="text-gray-600">{data.bio}</p>
          </div>
          
          {/* User Stats */}
          <div className="flex gap-3 text-center">
            <div>
              <p className="text-xl font-semibold">{postCount}</p>
              <p className="text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{data.followers.length}</p>
              <p className="text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{data.following.length}</p>
              <p className="text-gray-500">Following</p>
            </div>
          </div>
<div className='flex flex-row xl:justify-center xl:items-center sm:justify-starts  gap-1'>
<button 
        onClick={handleFollowClick} 
        className={`px-4 py-2 max-xl:relative max-xl:right-16
     rounded-md font-semibold ${
          data.followers.includes(sessionStorage
.getItem("userid"))  ? "bg-gray-400" : "bg-blue-500"
        } text-white`}
      >
        {data.followers.includes(sessionStorage
.getItem("userid")) ? 'unfollow' : 'follow'}
      </button>
      {data.followers.includes(sessionStorage
.getItem("userid"))  && (
            <button 
              // onClick={() => setShowChat(!showChat)} 
              className="px-4 py-2 max-xl:relative max-xl:right-16 rounded-md font-semibold bg-blue-500 text-white"
              onClick={()=>seTNew(location.state ?location.state.post.user._id:params.id)}
            >
              Message{messages.length}
            </button>
          )}

</div>
        </div>
        <div className='relative'>
   
        </div>
      </div>

      {/* Follow Button */}


      {/* Message Button */}


        {/* {showChat && ( */}
      {/* { data.followers.length ? <Chat currentUserId={sessionStorage
.getItem('userid')} recipientId={location.state.post.user._id}  />:null} */}
      {/* )} */}
    </div>

    <div className='mt-4'>
    <div className="mb-4 p-4 bg-white shadow-xl grid gap-2 xl:grid-cols-3 md:grid-cols-2 max-md:grid-cols-1">
        {post.length > 0 ? (
          post.map((item, index) => (
            <div key={index} className="shadow-md hover:scale-90 transition-all">
              <img src={item.image} alt="post" className=" w-full max-md:w-[100vw]  object-cover  aspect-[3/2]" />
              <p>{item.caption}</p>
              <div className="flex items-center gap-2 mt-2">
                {
                  item.likes.length!==0?
                  <FaHeart className="text-red-500" />:
                <FaRegHeart />
                }
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts available</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default UserProfile;
