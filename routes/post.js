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

function extractTitleFromUrl(url) {
    // Split the URL by slashes and get the last part
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];

    // Replace "%20" with spaces    
    const title = lastPart.replace(/%20/g, ' ');
    const posts = mockDatabase.posts;
    for (const post of posts) {
        if (post.title.toLowerCase() === title) {
            return post;
        }
    }
}

router.get('/:id', (req, res) => {
    url = req.originalUrl;
    postName = extractTitleFromUrl(url);
    res.render('post', { title: postName.title, post: postName, users: users });
})

module.exports = router;