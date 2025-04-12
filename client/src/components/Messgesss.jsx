import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useChatMessages } from "../context/AuthContext";
import { FaPaperPlane } from 'react-icons/fa';

const Messgesss = () => {
  const { messages, setMessages, socket, setSocket } = useChatMessages();
  const [suggested, setSuggest] = useState([]);
  const [localm, setlocalm] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = localStorage.getItem('userid');

  // Fetch suggested users
  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get('https://chatgram-backend-934g.onrender.com/api/auth/getfolow', {
        headers: {
          Authorization: localStorage.getItem("token"),
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

  // Setup socket connection and message handling
  useEffect(() => {
    const newSocket = io('https://chatgram-backend-934g.onrender.com');
    setSocket(newSocket);

    newSocket.emit('joinRoom', currentUserId);

    newSocket.on('receiveMessage', (msg) => {
      const previous = JSON.parse(localStorage.getItem("mess")) || [];
      const updated = [...previous, msg];
      localStorage.setItem("mess", JSON.stringify(updated));
      setlocalm(updated);
    });

    return () => newSocket.disconnect();
  }, [currentUserId, setSocket]);

  // Load messages from localStorage whenever route changes
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("mess")) || [];
    setlocalm(stored);
  }, [location.pathname]);

  const handleFollow = (userId) => {
    navigate(`/message/${userId}`);
    localStorage.removeItem("mess");
    setlocalm([]);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4 py-6 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Suggestions For You</h3>

      <div className="space-y-6">
        {suggested.map((item, index) => (
          <div
            key={item._id || index}
            className="flex items-start justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex gap-4">
              <img
                src={item.profilePicture || '/default-profile.png'}
                alt={item.username}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <p className="text-md font-semibold text-gray-800">{item.username}</p>
                <p className="text-xs text-gray-500 mb-1">
                  Joined: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
                {localm
                  .filter((msg) => msg.senderId === item._id)
                  .slice(-1)
                  .map((msg, i) => (
                    <p key={i} className="text-sm text-gray-600 italic truncate max-w-xs">
                      {msg.message}
                    </p>
                  ))}
              </div>
            </div>

            <button
              onClick={() => handleFollow(item._id)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50 hover:shadow-sm transition"
            >
              <FaPaperPlane className="text-blue-600" />
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messgesss;
