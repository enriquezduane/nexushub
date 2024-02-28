const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { headerFooterData } = require('../controllers/helper');

// import controller
const { renderSearch, searchFilter } = require('../controllers/searchController');

router.get('/', searchFilter, headerFooterData, renderSearch);

module.exports = router;