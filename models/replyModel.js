const mongoose = require('mongoose');
const Post = require('./postModel');
const User = require('./userModel');

const replySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  title: String,
  refPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  reply: String
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
