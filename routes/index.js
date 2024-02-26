const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, headerFooterData } = require('../controllers/helper');

// import controller
const { renderIndex, renderTerms, getLatestPosts, getTotalCounts } = require('../controllers/indexController');

router.get('/', populateAll, getLatestPosts, getTotalCounts, headerFooterData, renderIndex);

router.get('/terms-and-conditions', headerFooterData, renderTerms);

module.exports = router;