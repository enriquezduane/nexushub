const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  username: String,
  role: String,
  posts: Number,
  age: Number,
  joinDate: String,
  currentServer: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
