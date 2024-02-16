// import mongoose and models
const mongoose = require('mongoose');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Reply = require('../models/replyModel');
const Board = require('../models/boardModel');
const Category = require('../models/categoryModel');

const populateAll = async (req, res, next) => {
    const categories = await Category.find().populate(
        {
            path: 'boards',
            populate: { 
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
                        },
                        {
                            path: 'refBoard',
                            model: 'Board',
                        }
                    ]
                },
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
        }).populate('category');
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
    
    }).populate('refBoard');

    const replies = await Reply.find().populate('poster').populate('refPost');
    const users = await User.find().populate(
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
                },
                {
                    path: 'refBoard',
                    model: 'Board',
                }
            ]
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
                            },
                            {
                                path: 'refBoard',
                                model: 'Board',
                            }
                        ]
                    },
                    {
                        path: 'poster',
                        model: 'User'
                    }
                ]
            });

    res.categories = categories;
    res.boards = boards;
    res.posts = posts;
    res.replies = replies;
    res.users = users;

    next();
}

const populateCategories = async (categories) => {
    for (let i = 0; i < categories.length; i++) {
        categories[i] = await populatePost(categories[i]);
    }
    return categories;
}

const populateCategory = async (category) => {
    post = await Category.findOne( { id: category.id } ).populate(
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
    return post;
}

const populateBoards = async (boards) => {
    for (let i = 0; i < boards.length; i++) {
        boards[i] = await populateBoard(boards[i]);
    }

    return boards;
}

const populateBoard = async (board) => {
    board = await Board.findOne( { id: board.id } ).populate(
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

    return board;
}


const populatePosts = async (posts) => {
    for (let i = 0; i < posts.length; i++) {
        posts[i] = await populatePost(posts[i]);
    }
    return posts;
}

const populatePost = async (post) => {
    post = await Post.findOne( { id: post.id } ).populate(
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
    return post;
}

const populateReplies = async (replies) => {
    replies = await Reply.find().populate('refPost').populate('poster');
    return replies;
}

const populateReply = async (reply) => {
    reply = await Reply.findById(reply._id).populate('refPost').populate('poster');
    return reply;
}

const getCurrentDate = () => {
    // Create a new Date object
    const currentDate = new Date();
        
    // Get the current date components
    const year = currentDate.getFullYear(); // Get the current year (e.g., 2024)
    const month = currentDate.toLocaleString('default', { month: 'short' }); // Get the current month (e.g., Jan)
    const day = currentDate.getDate(); // Get the current day of the month (1-31)

    // Get the current time components
    let hours = currentDate.getHours(); // Get the current hour (0-23)
    const minutes = currentDate.getMinutes(); // Get the current minute (0-59)

    // Convert the hour to a 12-hour clock format
    hours = hours % 12 || 12; // Convert 0 to 12 if it's midnight

    // Determine the meridiem (AM/PM)
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    // Format the date and time as needed
    let formattedDateTime = `${month} ${day}, ${year} ${hours}:${minutes} ${meridiem}`; // Example: "Feb 11, 2024 3:30 PM"

    // Add a leading zero to the minutes if needed
    if (minutes < 10) {
        formattedDateTime = formattedDateTime.replace(/:\d{1} /, ':0$&');
    }

    return formattedDateTime;
}

const highlightSubstring = (content, searchText) => {
    // Split the content into parts where the search query occurs
    const parts = content.split(new RegExp(`(${searchText})`, 'gi'));

    // Rebuild the content with styled HTML
    return parts.map(part => part.toLowerCase() === searchText.toLowerCase() ? `<strong style="color: #ff9200;">${part}</strong>` : part).join('');
}



module.exports = {
    populateAll,
    populateCategories,
    populateCategory,
    populateBoards,
    populateBoard,
    populatePosts,
    populatePost,
    populateReplies,   
    populateReply,
    getCurrentDate,
    highlightSubstring
}