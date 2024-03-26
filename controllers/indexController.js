const { formatLatestPostDate } = require('../controllers/helper');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const User = require('../models/userModel');
const Activity = require('../models/activityModel');
const OnlineCount = require('../models/onlineCountModel');
const { populatePosts, populateCategories, populateUser } = require('../controllers/helper');

const renderIndex = (req, res) => {
    try {
        res.render('index', { 
            loggedIn: req.isAuthenticated(), 
            title: "NexusHub", 
            categories: res.categories, 
            boards: res.boards, 
            posts: res.posts, 
            latestUser: res.latestUser, 
            formatLatestPostDate, 
            latestPosts: res.latestPosts,
            postCount: res.postCount,
            replyCount: res.replyCount,
            userCount: res.userCount,
            activeGuestCount: res.activeGuestCount,
            activeUserCount: res.activeUserCount,
            mostOnlineToday: res.mostOnlineToday,
            mostOnlineEver: res.mostOnlineEver,
            mostOnlineEverDate: res.mostOnlineEverDate,
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

const getIndexPageItems = async (req, res, next) => {
    try {
        // Query the database to get all categories 
        const categories = await Category.find();

        const populatedCategories = await populateCategories(categories);

        // Query the latest user 

        const latestUser = await User.findOne().sort({ createdAt: -1 });

        const populatedLatestUser = await populateUser(latestUser);

        res.categories = populatedCategories;
        res.latestUser = populatedLatestUser;

        next();
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
}

const getActivityCounts = async (req, res, next) => {
    try {
        const fiveMinutesAgo = moment().subtract(5, 'minutes');
        const activities = await Activity.find({ timestamp: { $gte: fiveMinutesAgo } });

        let guestCount = 0;
        let userCount = 0;

        activities.forEach(activity => {
            if (activity.user === null) {
                guestCount++;
            } else {
                userCount++;
            }
        });

        const totalCount = guestCount + userCount;

        let onlineCounts = await OnlineCount.findOne();

        if (!onlineCounts) {
            onlineCounts = new OnlineCount();
            onlineCounts._id = new mongoose.Types.ObjectId();
        }

        // Compare totalCount with mostOnlineToday and update if needed
        if (totalCount > onlineCounts.mostOnlineToday) {
            onlineCounts.mostOnlineToday = totalCount;
        }

        // Compare totalCount with mostOnlineEver and update if needed
        if (totalCount > onlineCounts.mostOnlineEver.count) {
            // Update mostOnlineEver count and date
            onlineCounts.mostOnlineEver.count = totalCount;
            onlineCounts.mostOnlineEver.date = Date.now();
        }

        await onlineCounts.save();

        res.activeGuestCount = guestCount;
        res.activeUserCount = userCount;

        next();
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: err.message });
    }
};

const getMostOnlineCounts = async (req, res, next) => {
    try {
        let onlineCounts = await OnlineCount.findOne();

        res.mostOnlineToday = onlineCounts.mostOnlineToday;
        res.mostOnlineEver = onlineCounts.mostOnlineEver.count;
        res.mostOnlineEverDate = onlineCounts.mostOnlineEverDateFormatted;

        next();
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    renderIndex,
    renderTerms,
    getLatestPosts,
    getTotalCounts,
    getIndexPageItems,
    getActivityCounts,
    getMostOnlineCounts
}