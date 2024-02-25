const { formatLatestPostDate } = require('../controllers/helper');
const passport = require('passport');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const User = require('../models/userModel');
const { populatePosts } = require('../controllers/helper');

const renderIndex = (req, res) => {
    try {
        res.render('index', { 
            loggedIn: req.isAuthenticated(), 
            title: "NexusHub", 
            categories: res.categories, 
            boards: res.boards, 
            posts: res.posts, 
            users: res.users, 
            formatLatestPostDate, 
            latestPosts: res.latestPosts,
            postCount: res.postCount,
            replyCount: res.replyCount,
            userCount: res.userCount,
            forumRules: res.forumRules, 
            userLoggedIn: req.user
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
}

const renderTerms = (req, res) => {
    res.render('terms', { 
        loggedIn: req.isAuthenticated(), 
        title: "Terms and Conditions", 
        forumRules: 
        res.forumRules, 
        userLoggedIn: req.user 
    });
}

const authenticateUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            if (info && info.message === 'No user with that username') {
                // Username was incorrect
                return res.status(401).json({ error: 'No user with that username.' });
            } else if (info && info.message === 'Password incorrect') {
                // Password was incorrect
                return res.status(401).json({ error: 'Incorrect password.' });
            }
            // If there's no specific message, use a generic one
            return res.status(401).json({ error: 'Authentication failed. Please try again.' });
        }
        // Authentication successful
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Send JSON response indicating successful login
            res.json({ success: true });
        });
    })(req, res, next);
};

const getLatestPosts = async (req, res, next) => {
    try {
      // Query the database to get the three latest posts, sorted by createdAt date in descending order
      const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(3);
  
      // If there are no posts found, return an empty array
      if (!latestPosts || latestPosts.length === 0) {
        return res.status(404).json({ message: 'No posts found' });
      }

      const populatedLatestPosts = await populatePosts(latestPosts);

      res.latestPosts = populatedLatestPosts;

      next();
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
};

const getTotalCounts = async (req, res, next) => {
    try {
      // Query the database to get the total count of documents in the "Posts" collection
      const postCount = await Post.countDocuments();
  
      // Query the database to get the total count of documents in the "Replies" collection
      const replyCount = await Reply.countDocuments();
  
      // Query the database to get the total count of documents in the "Users" collection
      const userCount = await User.countDocuments();

      res.postCount = postCount;
      res.replyCount = replyCount;
      res.userCount = userCount;

      next();
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    renderIndex,
    renderTerms,
    authenticateUser,
    getLatestPosts,
    getTotalCounts
}