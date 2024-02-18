const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll } = require('../controllers/helper');

// import controller
const { createCategory, createBoard, createUser, createPost, createReply } = require('../controllers/adminController');

router.get('/', populateAll, (req, res) => {
    try {
          // Render the homepage with the fetched data
          res.render('admin', { loggedIn: true, title: "Forum Master Page", action: req.query.action, boards: res.boards, categories: res.categories, users: res.users, 
          posts: res.posts, replies: res.replies});
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