import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FiMoreVertical, FiSend } from 'react-icons/fi';
import useChatMessages from '../hooks/useChatMessages';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return isToday ? time : `${date.toLocaleDateString()} ${time}`;
};

const Chat = () => {
    const { setMessages, messages, setSocket, socket } = useChatMessages();
    const currentUserId = sessionStorage.getItem('userid');
    const { id: recipientId } = useParams();
    const location = useLocation();

    const [message, setMessage] = useState('');
    const [data, setData] = useState({});
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const newSocket = io('http://localhost:5001');
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
                `http://localhost:5001/api/auth/userpro/${recipientId}`,
                { headers: { Authorization: `${sessionStorage.getItem('token')}` } }
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
        <div className="flex flex-col h-full w-full max-w-lg mx-auto bg-gray-50 rounded-lg shadow-lg border border-gray-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                    <img
                        src={data.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <div>
                        <h2 className="text-lg font-semibold">{data.username}</h2>
                        {isTyping && <span className="text-sm text-gray-200 italic">Typing...</span>}
                    </div>
                </div>
                <button className="text-gray-100 hover:text-gray-300">
                    <FiMoreVertical size={20} />
                </button>
            </div>

            {/* Messages Container */}
            <div
                className="flex flex-col overflow-y-auto p-4 bg-gray-100"
                style={{ height: '400px' }}
            >
                {(location.state || messages).map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex mb-4 ${
                            msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`relative px-4 py-3 rounded-xl shadow-md max-w-xs text-sm ${
                                msg.senderId === currentUserId
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                    : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                        >
                            <p>{msg.message}</p>
                            <span className="text-xs text-gray-400 absolute bottom-1 right-2">
                                {formatDate(msg.timestamp)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Section */}
            <div className="flex items-center p-4 bg-white border-t border-gray-200 rounded-b-lg shadow-inner">
                <input
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    className="flex-grow p-3 text-gray-800 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                <button
                    onClick={sendMessage}
                    className="ml-3 p-3 text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 transform hover:scale-105"
                >
                    <FiSend size={20} />
                </button>
            </div>
        </div>
    );
};

export default Chat;
