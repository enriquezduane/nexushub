const mongoose = require('mongoose');
const User = require('./userModel');
const Reply = require('./replyModel');

const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  title: String,
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  date: String,
  replyCount: Number,
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  views: Number
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
