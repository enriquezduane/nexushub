const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, headerFooterData } = require('../controllers/helper');

// import controller
const { renderIndex, renderTerms, authenticateUser } = require('../controllers/indexController');

router.get('/', populateAll, headerFooterData, renderIndex);

router.get('/terms-and-conditions', headerFooterData, renderTerms);

router.post('/login', authenticateUser);

router.post('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/'); 
    });
});

module.exports = router;