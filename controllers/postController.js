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

        // Find the board in the database using a case-insensitive regex
        const post = await Post.findById(lastPart);

        if (!post) {
            return res.status(404).json({ message: 'Post not found', post: post });
        } else {
            res.post = await populatePost(post);
        }
    } catch (err) {
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
const deleteContent = async (req, res, next) => {
    try {
        const { type, id } = req.body;

        if (type === 'post') {

            // Find the post
            const post = await Post.findById(id);

            // Delete the post
            await post.deleteOne();

            res.status(200).json({ message: 'Post deleted successfully' });
        } else {

            // Find the reply
            const reply = await Reply.findById(id);

            // Delete the reply
            await reply.deleteOne();
            
            res.status(200).json({ message: 'Reply deleted successfully' });
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateContent = async (req, res, next) => {
    try {
        const { type, id, content } = req.body;

        if (type === 'post') {

            // Find the post
            const post = await Post.findById(id);

            // Update the post
            post.content = content;
            post.updatedAt = Date.now();
            await post.save();

            res.status(200).json({ updatedAt: post.updatedAtSGT });
        } else {

            // Find the reply
            const reply = await Reply.findById(id);

            // Update the reply
            reply.reply = content;
            reply.updatedAt = Date.now();
            await reply.save();

            res.status(200).json({ updatedAt: reply.updatedAtSGT });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const upvote = async (req, res, next) => {
    try {
        const { type, id, count } = req.body;

        if (type === 'post') {
            console.log('Upvoting post')
            // Find the post
            const post = await Post.findById(id);

            // Update the post
            post.upvotes = count;
            await post.save();
        } else {
            console.log('Upvoting reply')
            // Find the reply
            const reply = await Reply.findById(id);

            // Update the reply
            reply.upvotes = count;
            await reply.save();
        }

        // Send a success response
        res.status(200).json({ message: 'Upvoted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getPostByUrl,
    createReply,
    deleteContent,
    updateContent,
    upvote,
};
