const express = require('express');
const router = express.Router();
path = require('path');

// router middlewares
router.use(express.static('public'));

// initialize database
const populate = require('../database/initdb');
// import controller
const { getPostByUrl } = require('../controllers/postController');
const { createReply } = require('../controllers/replyController');

router.get('/:title', populate, getPostByUrl, (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('post', { loggedIn: true, post: res.post, users: res.users });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message, post: res.post});
    }
})

router.post('/', createReply, (req, res) => {
    try {
        // Send the new reply data
        res.json(res.reply);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;