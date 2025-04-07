const express = require('express');
const { addComment, editComment, deleteComment, getCommentsForPost } = require('../controllers/commentController');
const isAuthenticated = require('../middlewares/authMiddleware');

const router = express.Router();

// Add a comment to a post
router.post('/:postId/add', isAuthenticated, addComment);

// Edit a comment
router.put('/:commentId/edit', isAuthenticated, editComment);

// Delete a comment
router.delete('/:commentId/delete', isAuthenticated, deleteComment);

// Get all comments for a specific post
router.get('/:postId', isAuthenticated, getCommentsForPost);

module.exports = router; // Use module.exports for exporting
