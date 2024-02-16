const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll } = require('../controllers/helper');

// import controller
const { getPostByQuery } = require('../controllers/searchController');
const { highlightSubstring } = require('../controllers/helper');

router.get('/', populateAll, getPostByQuery, (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('search', { loggedIn: true, title: "Search Results", posts: res.posts, 
        query: req.query.query, highlightSubstring});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;