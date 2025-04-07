const Post=require("../models/Post")
// Add a comment to a post
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.postId;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Create a new comment
        const newComment = new Comment({
            user: req.id, // The ID of the current user
            post: postId,
            text,
        });

        await newComment.save();

        // Add the comment to the post's comments array
        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit a comment
const editComment = async (req, res) => {
    try {
        const { text } = req.body;
        const commentId = req.params.commentId;

        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Check if the comment belongs to the current user
        if (comment.user.toString() !== req.id) {
            return res.status(403).json({ message: 'You are not authorized to edit this comment' });
        }

        // Update the comment
        comment.text = text;
        await comment.save();

        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Check if the comment belongs to the current user
        if (comment.user.toString() !== req.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        // Remove the comment
        await comment.remove();

        // Remove the comment reference from the post's comments array
        await Post.updateOne(
            { _id: comment.post },
            { $pull: { comments: commentId } }
        );

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all comments for a specific post
const getCommentsForPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Find all comments for the post
        const comments = await Comment.find({ post: postId }).populate('user', 'username'); // Populate the user's username

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export the functions as a module
module.exports = {
    addComment,
    editComment,
    deleteComment,
    getCommentsForPost
};
