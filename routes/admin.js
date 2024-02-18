const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, highlightSubstring } = require('../controllers/helper');

// import controller
const { createCategory, createBoard, createUser, createPost, createReply, searchFilter } = require('../controllers/adminController');

router.get('/', populateAll, searchFilter, (req, res) => {
    try {
          // Render the homepage with the fetched data
          res.render('admin', { 
            loggedIn: true, 
            title: "Forum Master Page", 
            action: req.query.action, 
            query: req.query.search, 
            categories: res.categories, 
            boards: res.boards, 
            users: res.users, 
            posts: res.posts, 
            replies: res.replies,
            filteredData: res.filteredData || [] // Include filtered data or an empty array
        });   
    } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ message: err.message });
    }
})

router.post('/category', createCategory);

router.post('/board', createBoard);

router.post('/user', createUser);

router.post('/post', createPost);

router.post('/reply', createReply);

module.exports = router;