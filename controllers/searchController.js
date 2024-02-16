const Post = require('../models/postModel');
const { populatePosts, } = require('./helper');

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
    getPostByQuery,
}