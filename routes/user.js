const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { headerFooterData } = require('../controllers/helper');

// import controller
const { renderUpdateProfile, renderPosts, renderUser, getUserByUrl, getPagination, updateUser, createUser } = require('../controllers/userController');

router.get('/update=:id', getUserByUrl, headerFooterData, renderUpdateProfile);

router.get('/posts=:id', getUserByUrl, getPagination, headerFooterData, renderPosts);

router.get('/:id', getUserByUrl, headerFooterData, renderUser);

router.post('/new', createUser);

router.patch('/', updateUser);

module.exports = router;