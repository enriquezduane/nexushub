const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll } = require('../controllers/helper');
const Category = require('../models/categoryModel');

router.get('/', populateAll, (req, res) => {
    try {
          // Render the homepage with the fetched data
           res.render('index', { loggedIn: true, title: "NexusHub", categories: res.categories, 
           boards: res.boards, posts: res.posts, users: res.users });
    } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ message: err.message });
    }
})

router.get('/terms-and-conditions', (req, res) => {
      res.render('terms', { loggedIn: true, title: "Terms and Conditions" });
})

module.exports = router;