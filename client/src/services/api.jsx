// src/services/api.js
import axios from 'axios';
import { io } from 'socket.io-client';

const API = axios.create({ baseURL: 'https://chatgram-backend-934g.onrender.com' });

// Attach the token for authorization
API.interceptors.request.use((req) => {
  if (localStorage
.getItem('token')) {
    req.headers.Authorization =localStorage
.getItem('token');
  }
  return req;
});

// Auth API
export const login = (formData) => API.post('/api/auth/login', formData);
export const register = (formData) => API.post('/api/auth/register', formData);

// Post API
export const fetchPosts = () => API.get('/api/all');
export const Del = (id) => API.delete(`/api/delete/${id}`);
export const createPost = (postData) => API.post('api//addpost', postData);
export const Edit = (id,postData) => API.put(`/api/edit/${id}`, postData);
export const likePost = (id) => API.post(`/api/${id}/like`);
export const commentOnPost = (id, commentData) => API.post(`/api/${id}/comment`,commentData);
export const fetchComments = (id) => API.get(`/posts/${id}/comments`);
// src/services/api.js

let socket;
export const connectSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000'); // Connect to server
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const sendMessage = (msg) => {
  if (socket) socket.emit('chatMessage', msg);
};

export const onMessageReceived = (callback) => {
  if (socket) socket.on('chatMessage', callback);
};
export const fetchBookmarks = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5001/api/auth/bookmarked",
      {
        headers: { Authorization: localStorage
.getItem("token") },
      }
    );
    return response.data.bookmarks; // Return bookmarks to caller
  } catch (error) {
    console.error("Failed to fetch bookmarks", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
export const loadBookmarks=async()=>{
  
}

// Function to delete all bookmarks
