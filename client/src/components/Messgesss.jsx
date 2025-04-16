import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { useChatMessages } from '../context/AuthContext'; // Make sure this path is correct

const Messgesss = () => {
  // Destructure values from the ChatMessages context
  const { messages, currentUserId, suggestedUsers, setMessages } = useChatMessages();
  const navigate = useNavigate();

  const handleFollow = (userId) => {
    navigate(`/message/${userId}`);

    // Optionally clear cached messages from localStorage (if needed)
    setMessages([])
    // localStorage.removeItem('chatMessages');
  };

  // This effect ensures messages are stored locally when messages change (optional)
  useEffect(() => {
    // Optionally: You can store messages locally or do any side effect here
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
console.log(messages);

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4 py-6 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Suggestions For You</h3>

      <div className="space-y-6">
        {/* Render suggested users */}
        {suggestedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-start justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            {/* Left side: Profile picture and user info */}
            <div className="flex gap-4">
              <img
                src={user.profilePicture || '/default-profile.png'}
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <p className="text-md font-semibold text-gray-800">{user.username}</p>
                <p className="text-xs text-gray-500 mb-1">
                  Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>

                {/* Display last message with this user */}
                {messages
                  .filter((msg) =>
                    (msg.senderId === user._id && msg.receiverId === currentUserId) ||
                    (msg.senderId === currentUserId && msg.receiverId === user._id)
                  )
                  .slice(-1)
                  .map((msg, i) => (
                    <p key={i} className="text-sm text-gray-600 italic truncate max-w-xs">
                      {msg.message}
                    </p>
                  ))}
              </div>
            </div>

            {/* Button to navigate to the message page */}
            <button
              onClick={() => handleFollow(user._id)}
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
