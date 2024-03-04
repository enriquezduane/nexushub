const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { headerFooterData } = require('../controllers/helper');

// import controller
const { renderUpdateProfile, renderPosts, renderReplies, renderUsers, renderUser, getUserByUrl, getUsers, getUsersPagination,
    getPagination, setReplyHrefs, updateUser, createUser } = require('../controllers/userController');

router.get('/update=:id', getUserByUrl, headerFooterData, renderUpdateProfile);

router.get('/posts=:id', getUserByUrl, getPagination, headerFooterData, renderPosts);

router .get('/replies=:id', getUserByUrl, getPagination, setReplyHrefs, headerFooterData, renderReplies);

router.get('/all', getUsers, getUsersPagination, headerFooterData, renderUsers);

router.get('/:id', getUserByUrl, headerFooterData, renderUser);

router.post('/new', createUser);

router.patch('/', updateUser);

module.exports = router;