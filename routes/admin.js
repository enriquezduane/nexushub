const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, highlightSubstring } = require('../controllers/helper');

// import controller
const { 
    createCategory, searchFilter, createBoard, createUser, createPost, createReply, 
    editCategory, editBoard, editUser, editPost, editReply,
    deleteCategory, deleteBoard, deleteUser, deletePost, deleteReply 
    } = require('../controllers/adminController');

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
            filteredData: res.filteredData || [], // Include filtered data or an empty array
            highlightSubstring
        });   
    } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ message: err.message });
    }
})

router.route('/category')
    .post(createCategory)
    .patch(editCategory)
    .delete(deleteCategory);

router.route('/board')
    .post(createBoard)
    .patch(editBoard)
    .delete(deleteBoard);

router.route('/user')
    .post(createUser)
    .patch(editUser)
    .delete(deleteUser);

router.route('/post')
    .post(createPost)
    .patch(editPost)
    .delete(deletePost);

router.route('/reply')
    .post(createReply)
    .patch(editReply)
    .delete(deleteReply);

module.exports = router;