const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Board = require('../models/boardModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const Report = require('../models/reportModel');
const bcrypt = require('bcrypt');

const { highlightSubstring } = require('./helper');

const renderAdmin = (req, res) => {
    try {
        /*
        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }
        */

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

const createCategory = async (req, res) => {
    try {
        const {title} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        // check if category already exists
        const categoryExists = await Category.findOne({ title: title });

        if (categoryExists) {
            return res.status(409).json({ message: 'Category already exists' });
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
                populateFields = ['reporter', 'reportedItem.item'];
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
                    { username: { $regex: new RegExp(search, 'i') } } // Search for username property for users
                ]
            };

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

const createBoard = async (req, res) => {
    try {
        const {title, description, innerDescription, category} = req.body;

        if (!req.isAuthenticated() || req.user.role !== 'Forum Master') {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const boardExists = await Board.findOne({ title: title });                      

        if (boardExists) {
            return res.status(409).json({ message: 'Board already exists' });
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
        res.status(500).json({ message: error.message });
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

        const titleExists = await Post.findOne({ title: title });

        if (titleExists) {
            return res.status(409).json({ message: 'Post already exists' });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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

        await user.deleteOne();

        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
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
    deleteReport
}