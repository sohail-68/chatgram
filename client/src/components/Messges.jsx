import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FiMoreVertical, FiSend } from 'react-icons/fi';
import useChatMessages from '../hooks/useChatMessages';
import { ArrowLeft, MoreVertical, SendHorizonal } from 'lucide-react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return isToday ? time : `${date.toLocaleDateString()} ${time}`;
};

const Chat = () => {
    const { setMessages, messages, setSocket, socket } = useChatMessages();
    const currentUserId = localStorage
.getItem('userid');
    const { id: recipientId } = useParams();
    const location = useLocation();

    const [message, setMessage] = useState('');
    const [data, setData] = useState({});
    const [isTyping, setIsTyping] = useState(false);
const navigate=useNavigate()
    useEffect(() => {
        const newSocket = io('https://chatgram-backend-934g.onrender.com');
        setSocket(newSocket);

        // Join room
        newSocket.emit('joinRoom', currentUserId);

        // Listen for incoming messages
        newSocket.on('receiveMessage', (msg) => {
            if (
                (msg.senderId === recipientId && msg.receiverId === currentUserId) ||
                (msg.senderId === currentUserId && msg.receiverId === recipientId)
            ) {
                setMessages((prev) => {
                    const updatedMessages = [...prev, msg];
                    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
                    return updatedMessages;
                });
            }
        });

        // Typing indicators
        newSocket.on('typing', (userId) => {
            if (userId === recipientId) setIsTyping(true);
        });

        newSocket.on('stopTyping', (userId) => {
            if (userId === recipientId) setIsTyping(false);
        });

        return () => newSocket.disconnect();
    }, [currentUserId, recipientId, setMessages, setSocket]);

    useEffect(() => {
        // Retrieve messages from local storage
        const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        const filteredMessages = storedMessages.filter(
            (msg) =>
                (msg.senderId === currentUserId && msg.receiverId === recipientId) ||
                (msg.senderId === recipientId && msg.receiverId === currentUserId)
        );
        setMessages(filteredMessages);
    }, [currentUserId, recipientId, setMessages]);

    const sendMessage = () => {
        if (message.trim()) {
            const msgData = {
                message,
                senderId: currentUserId,
                receiverId: recipientId,
                timestamp: new Date().toISOString(),
            };

            socket.emit('sendMessage', msgData);
            setMessages((prev) => {
                const updatedMessages = [...prev, msgData];
                localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
                return updatedMessages;
            });
            setMessage('');
            socket.emit('stopTyping', currentUserId);
        }
    };
    console.log(currentUserId,"send");
    console.log(recipientId,"reciver");
    
console.log(messages);

    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (e.target.value) {
            socket.emit('typing', currentUserId);
        } else {
            socket.emit('stopTyping', currentUserId);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const profileResponse = await axios.get(
                `https://chatgram-backend-934g.onrender.com/api/auth/userpro/${recipientId}`,
                { headers: { Authorization: `${localStorage
.getItem('token')}` } }
            );
            setData(profileResponse.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [recipientId]);

    return (
<div className="container mx-auto min-h-screen flex flex-col px-2 py-3 sm:px-4 sm:py-5">

  {/* Chat Container */}
  <div className="flex flex-col justify-between h-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">

    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <button
        onClick={() => navigate(-1)}
        className="p-2 hover:bg-white/10 rounded-full transition"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </button>

      <Link to={`/userprofile/${data._id}`} className="flex items-center gap-3 flex-1 px-3">
        <img
          src={data.profilePicture}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-white object-cover"
        />
        <div className="truncate">
          <h2 className="text-base font-semibold truncate">{data.username}</h2>
          {isTyping && (
            <span className="text-xs text-gray-200 italic animate-pulse">
              Typing...
            </span>
          )}
        </div>
      </Link>

      <button className="p-2 hover:bg-white/10 rounded-full transition">
        <MoreVertical className="h-5 w-5 text-white" />
      </button>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto scroll-smooth space-y-3 px-3 py-4 bg-gradient-to-b from-pink-100 via-white to-rose-50">
      {(location.state || messages).map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex flex-col gap-1 px-4 py-2 rounded-xl shadow max-w-[80%] sm:max-w-[60%] ${
              msg.senderId === currentUserId
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <div className="text-sm break-words">{msg.message}</div>
            <div className="text-[10px] text-gray-400 mt-1 text-right">
              {formatDate(msg.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Input Section */}
    <div className="flex items-center gap-3 px-4 py-3 bg-white/30 backdrop-blur-md border-t border-white/10">
      <input
        type="text"
        value={message}
        onChange={handleTyping}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 rounded-lg bg-white/90 text-gray-800 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={sendMessage}
        className="p-2 bg-gradient-to-tr from-gray-800 via-indigo-900 to-black text-white rounded-full hover:scale-105 transition-transform duration-200"
      >
        <SendHorizonal className="h-5 w-5" />
      </button>
    </div>
  </div>
</div>

      
    );
};

export default Chat;
