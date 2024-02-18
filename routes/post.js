const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, headerFooterData } = require('../controllers/helper');

// import controller
const { renderCreatePost, renderPost, getPostByUrl, 
        createPost, createReply, deleteContent, updateContent, upvote } = require('../controllers/postController');

router.get('/create', renderCreatePost);

router.get('/:id', populateAll, getPostByUrl, headerFooterData, renderPost);

router.post('/post', createPost);

router.post('/reply', createReply);

router.patch('/upvote', upvote);

router.patch('/edit', updateContent);

router.delete('/delete', deleteContent);

module.exports = router;