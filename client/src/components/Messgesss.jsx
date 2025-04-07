import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useChatMessages from '../hooks/useChatMessages';
import { io } from 'socket.io-client';

const Messgesss = () => {
  const { setUnreadMessages, messages, unreadMessages, setSocket, setMessages } = useChatMessages();
  const [suggested, setSuggest] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = sessionStorage.getItem('userid');

  // Fetch suggested users from API
  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/getfolow', {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      setSuggest(response.data);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    // Join room
    newSocket.emit('joinRoom', currentUserId);

    // Listen for incoming messages
    newSocket.on('receiveMessage', (msg) => {
      console.log(msg);
      
      setMessages([...messages,msg])
    
    });

    // Typing indicators
 

    return () => newSocket.disconnect();
}, [currentUserId, suggested._id, setMessages, setSocket]);

// useEffect(() => {
//     // Retrieve messages from local storage
//     const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
//     const filteredMessages = storedMessages.filter(
//         (msg) =>
//             (msg.senderId === currentUserId && msg.receiverId === suggested._id) ||
//             (msg.senderId === suggested._id && msg.receiverId === currentUserId)
//     );
//     setMessages(filteredMessages);
// }, [currentUserId, suggested._id, setMessages]);

  const handleFollow = (userId) => {
    navigate(`/message/${userId}`);
    console.log(`Followed user with ID: ${userId}`);
  };
  
console.log(messages);

  return (
    <div className="mt-3 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Suggestions For You</h3>
      <div>
        {suggested.map((item, index) => (
          <div key={item.id || index} className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={item.profilePicture || "/default-profile.png"}
                alt={`${item.username}'s profile`}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-bold">{item.username}</p>
                <p className="text-sm text-gray-500">
                  Created on: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Unknown"}
                </p>
                {messages.map((msg, index) => (
          <p key={index} className="text-sm text-gray-600">
            { msg.senderId===item._id &&  msg.message }
          </p>
        ))}
              </div>
            </div>
            <button
              onClick={() => handleFollow(item._id)}
              className="text-blue-500 text-sm font-semibold hover:underline"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
      <div>
        <h4 className="mt-4 font-semibold">Recent Messages:</h4>
     
      </div>
    </div>
  );
};

export default Messgesss;
