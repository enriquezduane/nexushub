const express = require('express');
const router = express.Router();
path = require('path');

// router middlewares
router.use(express.static('public'));

// initialize database
const populate = require('../database/initdb');

// import controller
const { getPostByQuery } = require('../controllers/postController');

router.get('/', populate, getPostByQuery, (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('search', { loggedIn: true, posts: res.posts, query: req.query.query, highlightSubstring});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
})

const highlightSubstring = (content, searchText) => {
    // Split the content into parts where the search query occurs
    const parts = content.split(new RegExp(`(${searchText})`, 'gi'));

    // Rebuild the content with styled HTML
    return parts.map(part => part.toLowerCase() === searchText.toLowerCase() ? `<strong style="color: #ff9200;">${part}</strong>` : part).join('');
  }

module.exports = router;