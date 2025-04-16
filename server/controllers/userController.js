const User = require('../models/User'); // Remove .js if using require
const Post = require('../models/Post'); // Remove .js if using require
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registration
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      user = new User({ username, email, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
      const payload = { user: { id:user._id ,email:user.email,password:user.password} };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.json({ token,payload });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const payload = { user: { id:user._id ,email:user.email,password:user.password} };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  
    
      return res.json({ token, payload });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Logout
const logout = (req, res) => {
    // Optionally invalidate token or clear session
    res.status(200).json({ message: 'Logout successful' });
};
// Profile Controller
const profile = async (req, res) => {
    try {
      if (req.method === 'GET') {
        // Retrieve user profile data
        const user = await User.findById(req.user.id)
          .populate('followers', 'username')
          .populate('following', 'username')
          .populate('posts')
          .populate('bookmarks');
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        res.json({ message: 'User profile retrieved successfully', user });
      } 
      else if (req.method === 'PUT') {
        // Update user profile data
        const updates = {};
        
        // Optional fields for update
        if (req.body.username) updates.username = req.body.username;
        if (req.body.email) updates.email = req.body.email;
        if (req.body.bio) updates.bio = req.body.bio;
        if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;
        if (req.body.gender) updates.gender = req.body.gender;
  
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          { $set: updates },
          { new: true }
        ).populate('followers', 'username')
         .populate('following', 'username')
         .populate('posts')
         .populate('bookmarks');
  
        res.json({ message: 'User profile updated successfully', user: updatedUser });
      } 
      else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };

const changePassword = async (req, res) => {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// // Get User Profile by ID
// const getProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).select('-password'); // Exclude password
//         if (!user) return res.status(404).json({ error: 'User not found' });

//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Edit User Profile
const editProfile = async (req, res) => {
    const { username, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, email, profilePicture: req.file?.path }, // Handle profile picture upload
            { new: true }
        ).select('-password'); // Exclude password from response

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Follow/Unfollow User
const followOrUnfollowUser = async (req, res) => {
    try {
        const followKrneWala = req.user.id; // patel
        console.log(followKrneWala);
        
        const jiskoFollowKrunga = req.params.id; // shivani
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
       //error);
    }
};
const Gtefolow = async (req, res) => {
    try {
      // Find users who are following the logged-in user
      const notifications = await User.find({
        followers: { $in: [req.user.id] }  // Check if logged-in user's ID is in the followers array
      });
  
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password'); // exclude password for security

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get All Posts by User
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.id }).populate('author', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Bookmark a Post
const bookmarkPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const user = await User.findById(req.user.id);
        if (!user.bookmarks.includes(post.id)) {
            user.bookmarks.push(post.id);
            await user.save();
            res.status(200).json({ message: 'Post bookmarked' });
        } else {
            res.status(400).json({ error: 'Post already bookmarked' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteAllBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.bookmarks = []; // Clear the bookmarks array
        await user.save(); // Save the updated user record

        res.status(200).json({ message: 'All bookmarks deleted',user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Bookmarked Posts
const getBookmarkedPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('bookmarks');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Suggested Users for Following
const getSuggestedUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).limit(5); // Suggest 5 users excluding the logged-in user
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchUsers = async (req, res) => {
    const searchQuery = req.query.q;

    if (!searchQuery) {
        return res.status(400).json({ error: "Search query is required." });
    }

    try {
        const users = await User.find({
            _id: { $ne: req.user.id }, // Exclude the logged-in user
            $or: [
                { name: { $regex: searchQuery, $options: "i" } },
                { username: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
            ],
        }).limit(10); // Limit results for performance

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Export all controller functions as a module
module.exports = {
    register,
    login,
    logout,
    searchUsers,
    // getProfile,
    changePassword,
    editProfile,
    followOrUnfollowUser,
    getUserPosts,
    bookmarkPost,
    profile,
    getBookmarkedPosts,
    getSuggestedUsers,getUserProfile,
    Gtefolow,
    deleteAllBookmarks
};
