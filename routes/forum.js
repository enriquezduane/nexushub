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
    const boards = mockDatabase.boards;
    for (const board of boards) {
        for (const boardName of board.boardNames) {
            if (boardName.title.toLowerCase() === title) {
                return boardName;
            }
        }
    }
}

router.get('/:id', (req, res) => {
    url = req.originalUrl;
    boardName = extractTitleFromUrl(url);
    res.render('board', { title: boardName.title, board: boardName, posts: posts, users: users });
})

module.exports = router;