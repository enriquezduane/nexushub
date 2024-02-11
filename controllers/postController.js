const Post = require('../models/postModel');
const { populatePost, populatePosts } = require('./helper');

// Create a new post
const createPost = async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get post by ID
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update post by ID
const updatePostById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

// Get post by query and highlight the query in the post title
const getPostByQuery = async (req, res, next) => {
    try {
        const query = req.query.query;
        const posts = await Post.find({ title: { $regex: new RegExp(query, 'i') } });
        res.posts = await populatePosts(posts);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
    next();
}

module.exports = { 
    createPost, 
    getAllPosts, 
    getPostById, 
    updatePostById, 
    getPostByUrl,
    getPostByQuery,
};
