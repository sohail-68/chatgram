const Post= require('../models/Post')

// Add a new post

// Add a new post
const addNewPost = async (req, res) => {
  try {
    const { caption, image ,mood} = req.body; // Get caption and image from request body

    const post = new Post({
      user: req.user.id, // Get user ID from authenticated request
      image, // Use Base64 image string directly
      caption,
      mood,
    });

    await post.save(); // Save post to the database
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserPostCount = async (req, res) => {
  try {
      // Get the logged-in user's ID
      const userId = req.user.id;

      // Count posts created by the logged-in user
      const postCount = await Post.countDocuments({ user: userId });

      // Send the post count as the response
      res.status(200).json({ postCount });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getCount = async (req, res) => {
   try {
      // Get the logged-in user's ID
      const userId = req.params.id;
     //userId);
      

      // Find posts created by the logged-in user
      const postCount = await Post.countDocuments({ user: userId });
      const postdata = await Post.find({ user: userId });


      // Send the posts as the response
      res.status(200).json({ postCount,postdata });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Get all posts
 const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate('user').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts from a specific user
 const getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).populate('user');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a post
 const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.find(like => like.user.toString() === req.user.id);

    if (liked) {
      post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
    } else {
      post.likes.push({ user: req.user.id });
    }

    await post.save();
    res.status(200).json({ message: 'Post liked/unliked successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike a post
const GetNoti = async (req, res) => {
  try {
    // Fetch posts created by the user that have likes or comments
    const notifications = await Post.find({
      user: req.user.id,  // Filter by user ID
      $or: [
        { "likes.0": { $exists: true } },   // Posts with at least one like
        { "comments.0": { $exists: true } } // Posts with at least one comment
      ]
    })
      .populate("likes.user")  // Populate like user details
      .populate("comments.user",) // Populate comment user details
      .sort({ createdAt: -1 });  // Sort by the most recent

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add a comment to a post
 const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
   //post);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user.id, text: req.body.text });
    await post.save();

    res.status(200).json({ message: 'Comment added successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a specific post
 const getCommentsOfPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user', 'username profilePicture');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post by ID
 const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, image,mood } = req.body;

    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this post' });
    }

    // Update the post with new data
    if (caption) post.caption = caption;
    if (image) post.image = image;
    if (mood) post.mood = mood;

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Bookmark a post by ID
 const bookmarkPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const bookmarked = post.bookmarks.includes(req.user.id);

    if (bookmarked) {
      post.bookmarks = post.bookmarks.filter(userId => userId.toString() !== req.user.id);
      res.status(200).json({ message: 'Post unbookmarked successfully' });
    } else {
      post.bookmarks.push(req.user.id);
      res.status(200).json({ message: 'Post bookmarked successfully' });
    }

    await post.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports={getCount,
  getUserPostCount, bookmarkPost,GetNoti,deletePost,editPost,getCommentsOfPost,bookmarkPost,addComment,addNewPost,getAllPost,likePost,getUserPost,
}