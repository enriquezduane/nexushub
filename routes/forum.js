const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, headerFooterData } = require('../controllers/helper');

// import controller
const { renderBoard, getBoardByUrl, getBoardPosts, getPagination } = require('../controllers/forumController');

router.get('/:id', populateAll, getBoardByUrl, getBoardPosts, getPagination, headerFooterData, renderBoard);

module.exports = router;