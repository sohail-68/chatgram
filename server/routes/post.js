const express = require('express'); // Import express
const isAuthenticated = require('../middlewares/authMiddleware');  // Middleware to check if the user is authenticated
const upload = require('../middlewares/multer');  // Middleware to handle file uploads
const {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  getAllPost,
  getCommentsOfPost,
  getUserPost,
  likePost,
  editPost,
  getCount,
  GetNoti,
  getUserPostCount
} = require('../controllers/postController');  // Import the controller functions

const router = express.Router();

// Add a new post with image upload
router.post('/addpost', isAuthenticated, express.json({ limit: '20mb' }), addNewPost);

// Get all posts (e.g., for the feed)
router.get('/all', isAuthenticated, getAllPost);
router.get('/notification', isAuthenticated, GetNoti);
router.get('/count/:id', isAuthenticated, getCount);
router.get('/user/postCount', isAuthenticated, getUserPostCount);
router.put('/edit/:id', isAuthenticated, editPost);
// Get all posts from a specific user
router.get('/userpost/all', isAuthenticated, getUserPost);

// Like a post
router.post('/:id/like', isAuthenticated, likePost);

// Dislike a post

// Add a comment to a post
router.post('/:id/comment', isAuthenticated, addComment);

// Get all comments for a specific post
router.get('/:id/comment/all', isAuthenticated, getCommentsOfPost);

// Delete a post by ID
router.delete('/delete/:id', isAuthenticated, deletePost);

// Bookmark a post by ID
router.post('/:id/bookmark', isAuthenticated, bookmarkPost);

module.exports = router; // Export the router
