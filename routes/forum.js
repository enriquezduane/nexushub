const express = require('express');
const router = express.Router();
path = require('path');

// router middlewares
router.use(express.static('public'));

// initialize database
const populate = require('../database/initdb');

// import controller
const { getBoardByUrl } = require('../controllers/boardController');

router.get('/:title', populate, getBoardByUrl, (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('board', { loggedIn: true, board: res.board, posts: res.posts, users: res.users });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;