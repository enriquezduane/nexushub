const express = require('express');
const router = express.Router();
path = require('path');

// middlewares
router.use(express.static('public'));

// import database
const User = require('../models/userModel');
const Reply = require('../models/replyModel');
const Post = require('../models/postModel');
const Board = require('../models/boardModel');
const Category = require('../models/categoryModel');

// initialize database
const populate = require('../database/initdb');

function extractTitleFromUrl(url, boards) {
    // Split the URL by slashes and get the last part
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];

    // Replace "%20" with spaces    
    const title = lastPart.replace(/%20/g, ' ');
    for (const board of boards) {
        if (board.title.toLowerCase() === title) {
            return board;
        }
    }
}

router.get('/:id', async (req, res) => {
    try {
        // Fetch data from the database
        const { categories, boards, posts, users } = await populate();

        // Extract the board title from the URL
        url = req.originalUrl;
        board = extractTitleFromUrl(url, boards);

        // Render the dynamic boards pages with the fetched data
        res.render('board', { board: board, posts: posts, users: users });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;