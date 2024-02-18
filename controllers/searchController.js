const Post = require('../models/postModel');
const { populatePosts, highlightSubstring } = require('./helper');

const renderSearch = (req, res) => {
    try {
        // Render the search page
        res.render('search', { loggedIn: true, title: 'Search Results', posts: res.posts, query: req.query.query, highlightSubstring, 
        forumRules: res.forumRules, userLoggedIn: res.userLoggedIn});
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
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
    renderSearch,
    getPostByQuery,
}