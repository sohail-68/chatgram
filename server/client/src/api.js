import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001' });

export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const fetchProfile = (id) => API.get(`/users/${id}/profile`);
export const fetchPosts = (id) => API.get(`/users/${id}/posts`);
export const followUser = (id) => API.post(`/users/${id}/follow`);
export const bookmarkPost = (postId) => API.post(`/users/bookmark/${postId}`);
export const fetchBookmarks = () => API.get('/users/bookmarks');
export const fetchSuggestedUsers = () => API.get('/users/suggested');
