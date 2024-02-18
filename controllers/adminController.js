const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Category = require('../models/categoryModel');
const Board = require('../models/boardModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');

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
            title: title,
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

const createBoard = async (req, res) => {
    try {
        const {title, description, innerDescription, category} = req.body;

        const boardExists = await Board.findOne({ title: title });                      

        if (boardExists) {
            return res.status(409).json({ message: 'Board already exists' });
        }

        const board = new Board({
            _id: new mongoose.Types.ObjectId(),
            title: title,
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
            user.password = password;
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

const searchFilter = async (req, res, next) => {
    // Extract the action and query from the request query string
    const { action, search } = req.query;

    if (action && search) {
        // Define an array to store filtered data
        const filteredData = [];

        // Determine which mongoose model to search based on the action
        let modelToSearch;
        switch (action) {
            case 'categories':
                modelToSearch = Category;
                break;
            case 'boards':
                modelToSearch = Board;
                break;
            case 'users':
                modelToSearch = User;
                break;
            case 'posts':
                modelToSearch = Post;
                break;
            case 'replies':
                modelToSearch = Reply;
                break;
            default:
                // If the action is not recognized, proceed to the next middleware
                return next();
        }

        try {
            // Construct the regular expression search query for each property
            const regexQuery = Object.keys(modelToSearch.schema.obj).reduce((acc, key) => {
                acc[key] = { $regex: new RegExp(search, 'i') };
                return acc;
            }, {});

            // Perform the text search query
            const textSearchResults = await modelToSearch.find(
                { $text: { $search: search } }
            );

            // Perform the regular expression search query
            const regexSearchResults = await modelToSearch.find(regexQuery);

            // Combine the results from both queries
            const data = [...textSearchResults, ...regexSearchResults];

            // Store the filtered data
            filteredData.push(...data);
            res.filteredData = filteredData;
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


module.exports = {
    createCategory,
    createBoard,
    createUser,
    createPost,
    createReply,
    searchFilter,
}