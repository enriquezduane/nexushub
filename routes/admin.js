const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll } = require('../controllers/helper');

router.get('/', populateAll, (req, res) => {
    try {
          // Render the homepage with the fetched data
          if (req.query.action === 'boards')
          {
            res.render('admin', { loggedIn: true, title: "Forum Master Page", action: "boards", boards: res.boards});
          } else if (req.query.action === 'users') {
            res.render('admin', { loggedIn: true, title: "Forum Master Page", action: "users", users: res.users});
          } else if (req.query.action === 'posts') {
            res.render('admin', { loggedIn: true, title: "Forum Master Page", action: "posts", posts: res.posts});
          } else if (req.query.action === 'replies') {
            res.render('admin', { loggedIn: true, title: "Forum Master Page", action: "replies", replies: res.replies});
          } else {
            res.render('admin', { loggedIn: true, title: "Forum Master Page", action: "categories", categories: res.categories});
          }    
    } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ message: err.message });
    }
})

module.exports = router;