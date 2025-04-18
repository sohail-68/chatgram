// ChatMessagesContext.js
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const ChatMessagesContext = createContext();

export const ChatMessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [token, settoken] = useState("");

  // Set current user ID


  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userid');
    const storedToken = sessionStorage.getItem('token');
  
    setCurrentUserId(storedUserId);
    settoken(storedToken);
  }, []);
  

  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/getfolow', {
        headers: {
          Authorization: token,
        },
      });
      setSuggestedUsers(response.data);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };
  
  useEffect(() => {
    if (token) fetchSuggestedUsers();
  }, [token]);
  
  

  // Global socket logic using suggested users
  useEffect(() => {
    if (!currentUserId || suggestedUsers.length === 0) return;

    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    newSocket.emit('joinRoom', currentUserId);

    newSocket.on('receiveMessage', (msg) => {
      const isRelevant = suggestedUsers.some((user) =>
        (msg.senderId === user._id && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === user._id)
      );

      if (isRelevant) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => newSocket.disconnect();
  }, [currentUserId, suggestedUsers]);

  return (
    <ChatMessagesContext.Provider
      value={{ messages, setMessages, socket,fetchSuggestedUsers, setSocket, settoken, currentUserId, setCurrentUserId, suggestedUsers }}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};

export const useChatMessages = () => useContext(ChatMessagesContext);
