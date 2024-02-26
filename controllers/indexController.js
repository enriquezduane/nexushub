const { formatLatestPostDate } = require('../controllers/helper');
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
    getLatestPosts,
    getTotalCounts
}