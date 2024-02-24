const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Category = require('../models/categoryModel');
const Board = require('../models/boardModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const bcrypt = require('bcrypt');

const { highlightSubstring } = require('./helper');

const renderAdmin = (req, res) => {
    try {
        if (req.user.role !== 'Forum Master') {
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
            filteredData: res.filteredData || [], 
            highlightSubstring, 
            forumRules: res.forumRules, 
            userLoggedIn: req.user
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
}

const createCategory = async (req, res) => {
    try {
        const {title} = req.body;

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

        const userExists = await User.findOne({ username: username });

        if (userExists) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: username,
            role: role,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

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
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message });
    }
}

const createPost = async (req, res) => {
    try {
        const {title, content, poster, refBoard} = req.body;

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

        const post = await Post.findById(refPost);

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

        const category = await Category.findById(id);

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

        const board = await Board.findById(id);

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

        const user = await User.findById(id);

        user.username = username.trim();

        if (password) {
            user.password = password;
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

        const post = await Post.findById(id);

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

        const saveReply = await Reply.findById(id);

        saveReply.reply = content.trim();
        saveReply.updatedAt = Date.now();

        await saveReply.save();

        res.status(201).json({message: 'Reply updated successfully'});
    } catch (error) {
        console.error('Error updating reply:', error);
        res.status(500).json({ message: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;

        console.log('id:', id)

        category = await Category.findById(id);

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

        board = await Board.findById(id);

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

        user = await User.findById(id);

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

        post = await Post.findById(id);

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

        reply = await Reply.findById(id);

        await reply.deleteOne();

        res.status(200).json({message: 'Reply deleted successfully'});
    } catch (error) {
        console.error('Error deleting reply:', error);
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
}