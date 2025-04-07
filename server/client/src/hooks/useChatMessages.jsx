// src/hooks/useChat.js
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const useChatMessages = (currentUserId, recipientId, showNotification) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
  const [bookmarks, setbookmarks] = useState([]);

    const [isTyping, setIsTyping] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0); // Tra

    // useEffect(() => {
    //     const newSocket = io('http://localhost:5001');
    //     setSocket(newSocket);

    //     newSocket.emit('joinRoom', currentUserId);

    //     // Listen for incoming messages
    //     newSocket.on('receiveMessage', (msg) => {
    //         setMessages((prev) => [...prev, msg]);

    //         // Show notification if the message is from the other user and the chat window is not in focus
           
    //     });

    //     // Listen for typing indicators
    //     newSocket.on('typing', (userId) => {
    //         if (userId !== currentUserId) setIsTyping(true);
    //     });

    //     newSocket.on('stopTyping', (userId) => {
    //         if (userId !== currentUserId) setIsTyping(false);
    //     });

    //     return () => newSocket.close();
    // }, [currentUserId, recipientId]);

  

    const handleTyping = (message, socket) => {
        if (message) {
            socket.emit('typing', currentUserId);
        } else {
            socket.emit('stopTyping', currentUserId);
        }
    };

    return { messages,bookmarks,setbookmarks, setMessages,setUnreadMessages,unreadMessages,socket, isTyping,setSocket, handleTyping };
};

export default useChatMessages;
