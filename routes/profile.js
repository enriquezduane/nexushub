const express = require('express');
const router = express.Router();
path = require('path');

// middlewares
router.use(express.static('public'));

// import mock database
const mockDatabase = require('../mockDB');
const boards = mockDatabase.boards;
const posts = mockDatabase.posts;
const users = mockDatabase.users;

function extractUserIDFromUrl(url) {
    // Split the URL by slashes and get the last part
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];

    // Remove id= text  
    const users = mockDatabase.users;
    const idText = lastPart.replace("id=", '');
    const idValue = parseInt(idText);
    for (const user of users) {
        if (user.id === idValue) {
            return user;
        }
    }
}

router.get('/:id', (req, res) => {
    url = req.originalUrl;
    userName = extractUserIDFromUrl(url);
    res.render('profile', { title: userName.username, user: userName });
})

module.exports = router;