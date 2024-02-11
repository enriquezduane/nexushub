const mongoose = require('mongoose');
const Reply = require('../models/replyModel');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const { populatePost, populateReply, getCurrentDate } = require('./helper');

// Create a new reply
const createReply = async (req, res, next) => {
    try {
        const { content, postId } = req.body;
        
        // Find the post and user by its ID
        const initialPost = await Post.findOne({ id: postId });
        const user = await User.findOne({ id: 1});

        const post = await populatePost(initialPost);

        // Create a new reply
        const initialReply = new Reply({
            _id: new mongoose.Types.ObjectId(),
            id: post.replies.length + 1,
            title: 'Re: ' + post.title,
            refPost: post._id,
            poster: user._id,
            date: getCurrentDate(),
            reply: content
        });

        // populate the reply object
        let reply = await initialReply.save();
        reply = await populateReply(reply);

        // Add the new reply object id to the post's replies array
        post.replies.push(initialReply._id);
        post.replyCount += 1;
        
        // Save the updated post and reply to the database
        await post.save();

        // Send the new reply object to the client
        res.reply = reply;
    } catch (err) {
        res.status(400).json({ message: err.message, request: req.body });
    }
    next();
};

// Get all replies
const getAllReplies = async (req, res) => {
    try {
        const replies = await Reply.find();
        res.json(replies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user by ID
const getReplyById = async (req, res) => {
    try {
      const reply = await Reply.findById(req.params.id);
      if (!reply) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(reply);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
// Update user by ID
const updateReplyById = async (req, res) => {
    try {
        const reply = await Reply.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reply) {
        return res.status(404).json({ message: 'User not found' });
        }
        res.json(reply);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user by ID
const deleteReplyById = async (req, res) => {
    try {
        const reply = await Reply.findByIdAndDelete(req.params.id);
        if (!reply) {
        return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createReply,
    getAllReplies,
    getReplyById,
    updateReplyById,
    deleteReplyById
}