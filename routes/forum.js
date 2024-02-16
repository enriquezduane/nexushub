const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll } = require('../controllers/helper');

// import controller
const { getBoardByUrl } = require('../controllers/forumController');

router.get('/:title', populateAll, getBoardByUrl, (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('board', { loggedIn: true, title: res.board.title, board: res.board, posts: res.posts, users: res.users });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;