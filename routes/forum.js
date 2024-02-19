const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, headerFooterData } = require('../controllers/helper');

// import controller
const { renderBoard, getBoardByUrl, getBoardPosts } = require('../controllers/forumController');

router.get('/:id', populateAll, getBoardByUrl, getBoardPosts, headerFooterData, renderBoard);

module.exports = router;