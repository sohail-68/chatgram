const mongoose = require('mongoose'); // Use require for importing

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  caption: { type: String },
  likes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema); // Create the model

module.exports = Post; // Export using module.exports
