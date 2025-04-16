// src/components/Chat.js

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Chat = ({ currentUserId, recipientId }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    // Establish socket connection and join a room based on userId
    useEffect(() => {
        const newSocket = io('http://localhost:5001');
        setSocket(newSocket);

        // Join a room for the current user
        newSocket.emit('joinRoom', currentUserId);

        // Receive messages
        newSocket.on('receiveMessage', (msg) => {
           //"Message received:", msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Cleanup on component unmount// Cleanup on component unmount or when currentUserId changes
        newSocket.on('disconnect', () => {
           //`User disconnected: ${newSocket.id}`);
        });

        // Clean up on unmount
        return () => {
            newSocket.off('receiveMessage');
            newSocket.off('disconnect');  // Remove disconnect listener
            newSocket.close();  // Close the socket connection
        };
    }, [currentUserId]);

    // Send message function
    const sendMessage = () => {
        if (message.trim()) {
            const msgData = {
                message,
                senderId: currentUserId,
                receiverId: recipientId,
            };

            // Emit the message to the server
            socket.emit('sendMessage', msgData);

            // Update local messages state and save to localStorage

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, msgData];
                localStorage
.setItem("chatMessages", JSON.stringify(updatedMessages));
                return updatedMessages;
            });

            // Clear the message input field
            setMessage("");
        }
    };

    useEffect(() => {
        const storedMessages = localStorage
.getItem("chatMessages");
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    return (
        <div className="chat-box border p-4 rounded shadow-md">
            <div className="messages-container overflow-y-auto" >
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.senderId === currentUserId ? 'text-right' : 'text-left'}`}>
                        <p className={`p-2 rounded ${msg.senderId === currentUserId ? 'bg-blue-300' : 'bg-gray-300'}`}>
                            {msg.message}
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-grow p-2 border rounded"
                />
                <button onClick={sendMessage} className="p-2 ml-2 bg-blue-500 text-white rounded">Send</button>
            </div>
        </div>
    );
};

export default Chat;
