// import models
const moment = require('moment-timezone');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Reply = require('../models/replyModel');
const Board = require('../models/boardModel');
const Category = require('../models/categoryModel');
const Report = require('../models/reportModel');
const bcrypt = require('bcrypt');

const populateAll = async (req, res, next) => {
    const categories = await populateCategories(await Category.find());
    const boards = await populateBoards(await Board.find());
    const posts = await populatePosts(await Post.find());
    const replies = await populateReplies(await Reply.find());
    const users = await populateUsers(await User.find());
    const reports = await populateReports(await Report.find());

    res.categories = categories;
    res.boards = boards;
    res.posts = posts;
    res.replies = replies;
    res.users = users;
    res.reports = reports;

    next();
}

const populateCategories = async (categories) => {
    for (let i = 0; i < categories.length; i++) {
        categories[i] = await populateCategory(categories[i]);
    }
    return categories;
}

const populateCategory = async (category) => {
    post = await Category.findById(category.id).populate(
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
                            populate: [
                                {
                                    path: 'posts',
                                    model: 'Post',
                                },
                                {
                                    path: 'replies',
                                    model: 'Reply',
                                }
                            ]
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
                                    model: 'User',
                                    populate: [
                                        {
                                            path: 'posts',
                                            model: 'Post',
                                        },
                                        {
                                            path: 'replies',
                                            model: 'Reply',
                                        }
                                    ]
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
                    path: 'category',
                    model: 'Category',
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
    board = await Board.findById(board.id).populate(
    { 
        path: 'posts', 
        model: 'Post', 
        populate: [
            { 
                path: 'poster', 
                model: 'User', 
                populate: [
                    {
                        path: 'posts',
                        model: 'Post',
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                    }
                ]
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
    }).populate('category');

    return board;
}


const populatePosts = async (posts) => {
    for (let i = 0; i < posts.length; i++) {
        posts[i] = await populatePost(posts[i]);
    }
    return posts;
}

const populatePost = async (post) => {
    post = await Post.findById(post.id).populate(
        { 
            path: 'poster', 
            model: 'User', 
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
                        },
                        {
                            path: 'refBoard',
                            model: 'Board',
                        }
                    ]
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
    }).populate({
        path: 'refBoard',
        model: 'Board',
        populate: {
            path: 'category',
            model: 'Category'
        }
    });
    return post;
}

const populateReplies = async (replies) => {
    for (let i = 0; i < replies.length; i++) {
        replies[i] = await populateReply(replies[i]);
    }
    return replies;
}

const populateReply = async (reply) => {
    reply = await Reply.findById(reply.id).populate({
        path: 'refPost',
        model: 'Post',
        populate: [
            { 
                path: 'poster', 
                model: 'User', 
                populate: [
                    {
                        path: 'posts',
                        model: 'Post',
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                    }
                ]
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
    }).populate({
        path: 'poster',
        model: 'User',
        populate: [
            {
                path: 'posts',
                model: 'Post',
            },
            {
                path: 'replies',
                model: 'Reply',
            }
        ]
    });
    return reply;
}

const populateUsers = async (users) => {
    for (let i = 0; i < users.length; i++) {
        users[i] = await populateUser(users[i]);
    }
    return users;
}

const populateUser = async (user) => {
    user = await User.findById(user.id).populate(
        { 
            path: 'posts', 
            model: 'Post', 
            populate: [
                { 
                    path: 'poster', 
                    model: 'User', 
                    populate: [
                        {
                            path: 'posts',
                            model: 'Post',
                        },
                        {
                            path: 'replies',
                            model: 'Reply',
                        }
                    ]
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
    return user;
}

const populateReports = async (reports) => {
    for (let i = 0; i < reports.length; i++) {
        reports[i] = await populateReport(reports[i]);
    }
    return reports;
}

const populateReport = async (report) => {
    report = await Report.findById(report.id)
        .populate({
            path: 'reporter',
            model: 'User',
            populate: [
                {
                    path: 'posts',
                    model: 'Post',
                },
                {
                    path: 'replies',
                    model: 'Reply',
                }
            ]
        })
        .populate({
            path: 'reportedItem.item',
            populate: {
                path: 'poster',
                model: 'User' // Assuming 'poster' refers to the user who posted the item
            }
        });;
    return report;
}

const highlightSubstring = (content, searchText) => {
    // Split the content into parts where the search query occurs
    const parts = content.split(new RegExp(`(${searchText})`, 'gi'));

    // Rebuild the content with styled HTML
    return parts.map(part => part.toLowerCase() === searchText.toLowerCase() ? `<strong style="color: #ff9200;">${part}</strong>` : part).join('');
}

const formatLatestPostDate = (post) => {
    return moment(post.createdAt).tz('Asia/Singapore').format('MMM DD [at] hh:mm A');
}

const headerFooterData = async (req, res, next) => {
    const forumRules = await Post.findOne({ title: 'Forum Rules' }).populate('refBoard');
    const userLoggedIn = await User.findOne({ username: 'lokitrickster' });

    res.forumRules = forumRules;
    res.userLoggedIn = userLoggedIn; // placeHolder because of no session management yet

    next();
}

const emoticonData = {
    'custom-emoticon-1': 'images/ro_emote_an.gif',
    'custom-emoticon-2': 'images/ro_emote_dotdotdot.gif',
    'custom-emoticon-3': 'images/ro_emote_eyes.gif',
    'custom-emoticon-4': 'images/ro_emote_gg.gif',
    'custom-emoticon-5': 'images/ro_emote_heh.gif',
    'custom-emoticon-6': 'images/ro_emote_hmm.gif',
    'custom-emoticon-7': 'images/ro_emote_ho.gif',
    'custom-emoticon-8': 'images/ro_emote_kis2.gif',
    'custom-emoticon-9': 'images/ro_emote_lv.gif',
    'custom-emoticon-10': 'images/ro_emote_no1.gif',
    'custom-emoticon-11': 'images/ro_emote_ook.gif',
    'custom-emoticon-12': 'images/ro_emote_questionmark.gif',
    'custom-emoticon-13': 'images/ro_emote_swt.gif',
};

const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

const handleValidationError = (err) => {
    if (err.code === 11000) {
        const { keyValue } = err;
        const key = Object.keys(keyValue)[0];
        const value = keyValue[key];
        return { status: 400, message: `${key} '${value}' already taken!` };
    }

    if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors).map(error => error.message);
        return { status: 400, message: errorMessage };
    }

    return { status: 500, message: 'Internal Server Error!' };
};

function checkIfBanned(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.banned) {
        return res.status(403).send("You have been banned! You cannot perform this action.");
    }
    next();
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
    populateUsers,
    populateUser,
    highlightSubstring,
    formatLatestPostDate,
    headerFooterData,
    emoticonData,
    hashPassword,
    handleValidationError,
    checkIfBanned
}