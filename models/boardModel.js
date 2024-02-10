const mongoose = require('mongoose');
const Post = require('./postModel');

const boardSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  title: String,
  description: String,
  postCount: Number,
  replies: Number,
  lastPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
