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

function extractUserIDFromUrl(url, users) {
    // Split the URL by slashes and get the last part
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];

    // Remove id= text  
    const idText = lastPart.replace("id=", '');
    const idValue = parseInt(idText);
    for (const user of users) {
        if (user.id === idValue) {
            return user;
        }
    }
}

router.get('/:id', async (req, res) => {
    try {
        // Fetch data from the database
        const { users } = await populate();

        // Extract the board title from the URL
        url = req.originalUrl;
        user = extractUserIDFromUrl(url, users);

        // Render the dynamic boards pages with the fetched data
        res.render('user', { user: user });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;