const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Board = require('../models/boardModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const Report = require('../models/reportModel');
const bcrypt = require('bcrypt');

const { highlightSubstring, handleValidationError } = require('./helper');

const renderAdmin = (req, res) => {
    try {
        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        res.render('admin', { 
            loggedIn: req.isAuthenticated(), 
            title: "Forum Master Page", 
            action: req.query.action, 
            query: req.query.search, 
            categories: res.categories, 
            boards: res.boards, 
            users: res.users, 
            posts: res.posts, 
            replies: res.replies, 
            reports: res.reports,
            filteredData: res.filteredData || [], 
            highlightSubstring, 
            forumRules: res.forumRules, 
            userLoggedIn: req.user,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
}

const searchFilter = async (req, res, next) => {
    // Extract the action and query from the request query string
    const { action, search } = req.query;

    if (action && search) {
        // Determine which mongoose model to search based on the action
        let modelToSearch;
        let populateFields = [];

        switch (action) {
            case 'categories':
                modelToSearch = Category;
                populateFields = ['boards']; // Fields to populate for categories
                break;
            case 'boards':
                modelToSearch = Board;
                populateFields = ['category', 'posts']; // Fields to populate for boards
                break;
            case 'users':
                modelToSearch = User;
                populateFields = ['posts', 'replies']; // Fields to populate for users
                break;
            case 'posts':
                modelToSearch = Post;
                populateFields = ['refBoard', 'poster', 'replies']; // Fields to populate for posts
                break;
            case 'replies':
                modelToSearch = Reply;
                populateFields = ['refPost', 'poster']; // Fields to populate for replies
                break;
            case 'reports':
                modelToSearch = Report;
                populateFields = populateFields = [
                    { path: 'reporter' }, // Populate the 'reporter' field directly
                    { path: 'reportedItem.item', // Populate the 'reportedItem.item' field
                      populate: {
                          path: 'poster', // Nested population for the 'poster' field inside 'reportedItem.item'
                          model: 'User' // Assuming 'poster' refers to the user who posted the item
                      }
                    }
                ];
                break;
            default:
                // If the action is not recognized, proceed to the next middleware
                return next();
        }

        try {
            // Construct the search query for title or username properties
            const query = {
                $or: [
                    { title: { $regex: new RegExp(search, 'i') } }, // Search for title property
                    { description: { $regex: new RegExp(search, 'i') } }, // Search for description property for boards
                    { innerDescription: { $regex: new RegExp(search, 'i') } }, // Search for innerDescription property for boards
                    { username: { $regex: new RegExp(search, 'i') } }, // Search for username property for users
                    { email: { $regex: new RegExp(search, 'i') } }, // Search for email property for users
                    { role: { $regex: new RegExp(search, 'i') } }, // Search for role property for users
                    { currentServer: { $regex: new RegExp(search, 'i') } }, // Search for currentServer property for users
                    { reason: { $regex: new RegExp(search, 'i') } }, // Search for reason property for reports
                    { 'reportedItem.itemType': { $regex: new RegExp(search, 'i') } }, // Search for itemType property for reports
                    { status: { $regex: new RegExp(search, 'i') } }, // Search for status property for reports
                ]
            };

            if (action === 'users' && !isNaN(search)) {
                query.$or.push({ age: parseInt(search) });
            }

            if (action === 'posts') {
                const posters = await User.find({ username: { $regex: new RegExp(search, 'i') } });
                const posterIds = posters.map(poster => poster._id);

                query.$or.push({ poster: { $in: posterIds } });

                if (!isNaN(search)) {
                    query.$or.push({ views: parseInt(search) });
                    query.$or.push({ upvotes: parseInt(search) });
                }
            }

            if (action === 'replies') {
                const posters = await User.find({ username: { $regex: new RegExp(search, 'i') } });
                const posterIds = posters.map(poster => poster._id);

                query.$or.push({ poster: { $in: posterIds } });

                if (!isNaN(search)) {
                    query.$or.push({ upvotes: parseInt(search) });
                }
            }

            if (action === 'reports') {
                const reporters = await User.find({ username: { $regex: new RegExp(search, 'i') } });
                const reporterIds = reporters.map(reporter => reporter._id);

                const reportedPosts = await Post.find({ title: { $regex: new RegExp(search, 'i') } });
                const reportedPostIds = reportedPosts.map(post => post._id);

                const reportedReplies = await Reply.find({ reply: { $regex: new RegExp(search, 'i') } });
                const reportedReplyIds = reportedReplies.map(reply => reply._id);

                const reportedPosters = await User.find({ username: { $regex: new RegExp(search, 'i') } });

                const reportedIds = reportedPosters.reduce((acc, user) => {
                    acc.push(...user.posts);
                    acc.push(...user.replies);
                    return acc;
                }, []);

                query.$or.push({ reporter: { $in: reporterIds } });
                query.$or.push({ 'reportedItem.item': { $in: reportedPostIds.concat(reportedReplyIds) } });
                query.$or.push({ 'reportedItem.item': { $in: reportedIds } });
            }

            // Perform the search query and dynamically populate fields
            let searchResults = modelToSearch.find(query);
            populateFields.forEach(field => {
                searchResults = searchResults.populate(field);
            });

            // Execute the query
            searchResults = await searchResults.exec();

            // Assign the search results to res.filteredData
            res.filteredData = searchResults;
            next();
        } catch (error) {
            // Handle errors
            console.error('Error filtering data:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // If action or query is missing, proceed to the next middleware
        next();
    }
};

const createCategory = async (req, res) => {
    try {
        const {title} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const category = new Category({
            _id: new mongoose.Types.ObjectId(),
            title: title.trim(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        await category.save();
        
        res.status(201).json({message: 'Category created successfully'});
    } catch (error) {
        console.error('Error creating category:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const createBoard = async (req, res) => {
    try {
        const {title, description, innerDescription, category} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const board = new Board({
            _id: new mongoose.Types.ObjectId(),
            title: title.trim(),
            description: description,
            innerDescription: innerDescription,
            category: category,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        await board.save();
        
        res.status(201).json({message: 'Board created successfully'});
    } catch (error) {
        console.error('Error creating board:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const createUser = async (req, res) => {
    try {
        const {username, password, email, role, description, age, currentServer} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: username,
            role: role,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;

        if (email) {
            user.email = email;
        }

        if (description) {
            user.description = description;
        }

        if (age) {
            user.age = age;
        }

        if (currentServer) {
            user.currentServer = currentServer;
        }

        await user.save();

        res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        console.error('Error:', err);
        const { status, message } = handleValidationError(err);
        return res.status(status).json({ message });
    }
}

const createPost = async (req, res) => {
    try {
        const {title, content, poster, refBoard} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            title: title,
            content: content,
            poster: poster,
            refBoard: refBoard,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        await post.save();
        
        res.status(201).json({message: 'Post created successfully'});
    
    } catch (error) {
        console.error('Error creating post:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const createReply = async (req, res) => {
    try {
        const {reply, poster, refPost} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const post = await Post.findById(refPost);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newReply = new Reply({
            _id: new mongoose.Types.ObjectId(),
            title: 'Re: ' + post.title,
            reply: reply,
            poster: poster,
            refPost: refPost,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        await newReply.save();
        
        res.status(201).json({message: 'Reply created successfully'});
    } catch (error) {
        console.error('Error creating reply:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const editCategory = async (req, res) => {
    try {
        const {id, title} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.title = title.trim();
        category.updatedAt = Date.now();

        await category.save();
        
        res.status(201).json({message: 'Category created successfully'});
    } catch (error) {
        console.error('Error creating category:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const editBoard = async (req, res) => {
    try {
        const {id, title, description, innerDescription} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const board = await Board.findById(id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        board.title = title.trim();

        if (description) {
            board.description = description;
        }

        if (innerDescription) {
            board.innerDescription = innerDescription;
        }

        board.updatedAt = Date.now();

        await board.save();

        res.status(201).json({message: 'Board updated successfully'});
    } catch (error) {
        console.error('Error updating board:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const editUser = async (req, res) => {
    try {
        const {id, username, password, email, role, description, age, currentServer} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        trimmedUsername = username.trim();

        if (trimmedUsername.length < 3 || trimmedUsername.length > 15) {
            return res.status(400).json({ message: 'Username must be between 3 and 15 characters' });
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters'});
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if (email) {
            user.email = email;
        }

        if (role) {
            if (user.role === 'Forum Master' && role !== 'Forum Master') {
                return res.status(400).json({ message: 'Cannot demote Forum Masters!' });
            }
            user.role = role;
        }

        if (description) {
            user.description = description;
        }

        if (age) {
            if (age < 13 || age > 110) {
                return res.status(400).json({ message: 'Age must be between 13 and 110' });
              }

            user.age = age;
        }

        if (currentServer) {
            user.currentServer = currentServer;
        }

        user.updatedAt = Date.now();

        await user.save();

        res.status(201).json({message: 'User updated successfully'});
    } catch (error) {
        console.error('Error updating user:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const editPost = async (req, res) => {
    try {
        const {id, title, content} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.title = title.trim();
        post.content = content.trim();
        post.updatedAt = Date.now();

        await post.save();

        res.status(201).json({message: 'Post updated successfully'});
    } catch (error) {
        console.error('Error updating post:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}  

const editReply = async (req, res) => {
    try {
        const {id, content} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const reply = await Reply.findById(id);

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        reply.reply = content.trim();
        reply.updatedAt = Date.now();

        await reply.save();

        res.status(201).json({message: 'Reply updated successfully'});
    } catch (error) {
        console.error('Error updating reply:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        console.log('id:', id)

        category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.deleteOne();

        res.status(200).json({message: 'Category deleted successfully'});
    } catch (error) {
        console.error('Error deleting category:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const deleteBoard = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        board = await Board.findById(id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        await board.deleteOne();

        res.status(200).json({message: 'Board deleted successfully'});
    } catch (error) {
        console.error('Error deleting board:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'Forum Master') {
            return res.status(400).json({ message: 'Cannot delete Forum Masters!' });
        }

        await user.deleteOne();

        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        console.error('Error deleting user:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.deleteOne();

        res.status(200).json({message: 'Post deleted successfully'});
    } catch (error) {
        console.error('Error deleting post:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const deleteReply = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        reply = await Reply.findById(id);

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        await reply.deleteOne();

        res.status(200).json({message: 'Reply deleted successfully'});
    } catch (error) {
        console.error('Error deleting reply:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const deleteReport = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }
        
        report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        await report.deleteOne();

        res.status(200).json({message: 'Report deleted successfully'});
    } catch (error) {
        console.error('Error deleting report:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const resolveReport = async (req, res) => {
    try {
        const { id, action, banUser, posterId } = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }
        
        report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.status !== 'Pending') {
            return res.status(400).json({ message: 'Report has already been handled!' });
        }

        report.status = action;

        if (banUser) {
            const user = await User.findById(posterId);
            user.banned = true;
            await user.save();
        }

        if (report.reportHandledAt) {
            return res.status(400).json({ message: 'Report has already been handled!' });
        }

        report.reportHandledAt = Date.now();

        await report.save();

        res.status(200).json({message: 'Report resolved successfully!'});
    } catch (error) {
        console.error('Error resolving report:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

const unbanUser = async (req, res) => {
    try {
        const { id } = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }
        
        user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.banned === false) {
            return res.status(400).json({ message: 'User is already unbanned!' });
        }

        user.banned = false;

        await user.save();

        res.status(200).json({message: 'User unbanned successfully!'});
    } catch (error) {
        console.error('Error unbanning user:', error);
        const { status, message } = handleValidationError(error);
        return res.status(status).json({ message });
    }
}

module.exports = {
    renderAdmin,
    createCategory,
    createBoard,
    createUser,
    createPost,
    createReply,
    searchFilter,
    editCategory,
    editBoard,
    editUser,
    editPost,
    editReply,
    deleteCategory,
    deleteBoard,
    deleteUser,
    deletePost,
    deleteReply,
    deleteReport,
    resolveReport,
    unbanUser
}