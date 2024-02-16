const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const User = require('../models/userModel');
const { populatePost, populateReply, getCurrentDate } = require('./helper');

// Get post by URL
const getPostByUrl = async (req, res, next) => {
    try {
        // Split the URL by slashes and get the last part
        const url = req.originalUrl;
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];

        // Replace "%20" with spaces
        const title = decodeURIComponent(lastPart.replace(/\+/g, ' '));

        // Find the board in the database
        const post = await Post.findOne({ title: { $regex: new RegExp(title, 'i') } });  

        if (!post) {
            return res.status(404).json({ message: 'Post not found', post: post });
        } else {
            res.post = await populatePost(post);
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
    next();
}

// Create a new reply
const createReply = async (req, res, next) => {
    try {
        const { content, postId } = req.body;
        
        // Find the post and user by its ID
        const initialPost = await Post.findById(postId);
        const user = await User.findOne({username: "lokitrickster"}); // No session management yet, placeholder username

        // Populate the post object
        const post = await populatePost(initialPost);

        // Create a new reply
        const initialReply = new Reply({
            _id: new mongoose.Types.ObjectId(),
            title: 'Re: ' + post.title,
            refPost: post.id,
            poster: user.id,
            reply: content,
            createdAt: Date.now(),
            updatedAt: Date.now() 
        });

        // save the new reply
        const reply = await initialReply.save();

        // populate the new reply object
        populatedReply = await populateReply(reply);

        // Send the new reply object to the client
        res.reply = populatedReply;
    } catch (err) {
        res.status(400).json({ message: err.message, request: req.body });
    }
    next();
};

// Delete reply
const deleteReply = async (req, res, next) => {
    try {
        if (req.body.type === 'post') {
            console.log('Deleting post:', req.body);

            // Find the post
            const post = await Post.findOne({ title: req.body.title });

            // Delete the post
            await post.deleteOne();

            res.message = { message: 'Post deleted successfully' };
        } else {
            console.log('Deleting reply:', req.body);

            // Find the reply
            const reply = await Reply.findOne({ title: req.body.title });

            // Delete the reply
            await reply.deleteOne();
            
            res.message = { message: 'Reply deleted successfully' };
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
    next();
};



module.exports = { 
    getPostByUrl,
    createReply,
    deleteReply,
};
