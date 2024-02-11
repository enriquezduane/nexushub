const mongoose = require('mongoose');
const User = require('../models/userModel');
const Reply = require('../models/replyModel');
const Post = require('../models/postModel');
const Board = require('../models/boardModel');
const Category = require('../models/categoryModel');

const populate = async (req, res, next) => {
    const categories = await Category.find()
    .populate(
        {
            path: 'boards',
            populate: [
                { 
                    path: 'posts', 
                    model: 'Post', 
                    populate: [
                        { 
                            path: 'poster', 
                            model: 'User', 
                        },
                        {
                            path: 'replies',
                            model: 'Reply',
                            populate: [
                                {
                                    path: 'refPost',
                                    model: 'Post'
                                },
                                {
                                    path: 'poster',
                                    model: 'User'
                                }
                            ]
                        }
                    ]
                },
                { 
                    path: 'lastPost', 
                    model: 'Post', 
                    populate: [
                        { 
                            path: 'poster', 
                            model: 'User', 
                        },
                        {
                            path: 'replies',
                            model: 'Reply',
                            populate: [
                                {
                                    path: 'refPost',
                                    model: 'Post'
                                },
                                {
                                    path: 'poster',
                                    model: 'User'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

    const boards = await Board.find().populate(
        { 
            path: 'posts', 
            model: 'Post', 
            populate: [
                { 
                    path: 'poster', 
                    model: 'User', 
                },
                {
                    path: 'replies',
                    model: 'Reply',
                    populate: [
                        {
                            path: 'refPost',
                            model: 'Post'
                        },
                        {
                            path: 'poster',
                            model: 'User'
                        }
                    ]
                }
            ]
        }).populate(
            { 
                path: 'lastPost', 
                model: 'Post', 
                populate: [
                    { 
                        path: 'poster', 
                        model: 'User', 
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                        populate: [
                            {
                                path: 'refPost',
                                model: 'Post'
                            },
                            {
                                path: 'poster',
                                model: 'User'
                            }
                        ]
                    }
                ]
            });
    const posts = await Post.find().populate(
    { 
        path: 'poster', 
        model: 'User', 
    }).populate(
    {
        path: 'replies',
        model: 'Reply',
        populate: [
            {
                path: 'refPost',
                model: 'Post',
                populate: [
                    { 
                        path: 'poster', 
                        model: 'User', 
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                        populate: [
                            {
                                path: 'refPost',
                                model: 'Post'
                            },
                            {
                                path: 'poster',
                                model: 'User'
                            }
                        ]
                    }
                ]
            },
            {
                path: 'poster',
                model: 'User'
            }
        ]
    
    });

    const replies = await Reply.find().populate('poster').populate('refPost');
    const users = await User.find();

    res.categories = categories;
    res.boards = boards;
    res.posts = posts;
    res.replies = replies;
    res.users = users;

    next();
}

module.exports = populate;