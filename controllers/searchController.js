const Post = require('../models/postModel');
const User = require('../models/userModel');
const { populatePosts, highlightSubstring, populateUsers, paginationLimit} = require('./helper');

const renderSearch = (req, res) => {
    try {
        // Render the search page
        if (req.query.page) {
            if (req.query.page < 1 || req.query.page > res.totalPages || isNaN(req.query.page)) {
                return res.status(404).json({ message: 'Page not found' });
            }
        }
        
        res.render('search', { 
            loggedIn: req.isAuthenticated(), 
            title: 'Search Results', 
            target: req.query.target,
            posts: res.posts, 
            users: res.users,
            query: req.query.query, 
            page: res.page,
            totalPages: res.totalPages,
            url: req.originalUrl,
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
        const page = parseInt(req.query.page) || 1;
        const limit = paginationLimit;

        let startIndex = (page - 1) * limit;
        let endIndex = startIndex + limit;

        if (query !== "") {
            if (target.toLowerCase() === 'posts') {
                const posts = await Post.find({ title: { $regex: new RegExp(query, 'i') } });
                const totalPosts = posts.length;
                const totalPages = Math.ceil(totalPosts / limit);
                const results = posts.slice(startIndex, endIndex);
                res.posts = await populatePosts(results);
                res.totalPages = totalPages;
                res.page = page;
            } else if (target.toLowerCase() === 'users') {
                const users = await User.find({ username: { $regex: new RegExp(query, 'i') } });
                const totalUsers = users.length;
                const totalPages = Math.ceil(totalUsers / limit);
                const results = users.slice(startIndex, endIndex);
                res.users = await populateUsers(results);
                res.totalPages = totalPages;
                res.page = page;
            } 
        } else {
            res.page = 1;
            res.totalPages = 1;
        }
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    renderSearch,
    searchFilter,
}