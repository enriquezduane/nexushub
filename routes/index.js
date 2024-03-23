const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { headerFooterData } = require('../controllers/helper');

// import controller
const { renderIndex, renderTerms, getLatestPosts, getTotalCounts, getIndexPageItems } = require('../controllers/indexController');

router.get('/', getIndexPageItems, getLatestPosts, getTotalCounts, headerFooterData, renderIndex);

router.get('/terms-and-conditions', headerFooterData, renderTerms);

module.exports = router;