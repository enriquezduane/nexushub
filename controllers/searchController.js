const Post = require('../models/postModel');
const User = require('../models/userModel');
const { populatePosts, highlightSubstring, populateUsers } = require('./helper');

const renderSearch = (req, res) => {
    try {
        // Render the search page
        res.render('search', { 
            loggedIn: req.isAuthenticated(), 
            title: 'Search Results', 
            target: req.query.target,
            posts: res.posts, 
            users: res.users,
            query: req.query.query, 
            highlightSubstring, 
            forumRules: res.forumRules, 
            userLoggedIn: req.user
        });
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
}

// Get post by query and highlight the query in the post title
const searchFilter = async (req, res, next) => {
    try {
        const query = req.query.query;
        const target = req.query.target;

        if (query !== "") {
            if (target.toLowerCase() === 'posts') {
            const posts = await Post.find({ title: { $regex: new RegExp(query, 'i') } });
            res.posts = await populatePosts(posts);
            } else if (target.toLowerCase() === 'users') {
                const users = await User.find({ username: { $regex: new RegExp(query, 'i') } });
                res.users = await populateUsers(users);
            }
        }
        next();
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    renderSearch,
    searchFilter,
}