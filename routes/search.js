const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, headerFooterData } = require('../controllers/helper');

// import controller
const { renderSearch, getPostByQuery } = require('../controllers/searchController');

router.get('/', populateAll, getPostByQuery, headerFooterData, renderSearch);

module.exports = router;