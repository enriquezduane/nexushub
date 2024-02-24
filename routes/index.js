const express = require('express');
const router = express.Router();
const passport = require('passport');

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, headerFooterData } = require('../controllers/helper');

// import controller
const { renderIndex, renderTerms } = require('../controllers/indexController');

router.get('/', populateAll, headerFooterData, renderIndex);

router.get('/terms-and-conditions', headerFooterData, renderTerms);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));

router.post('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/'); 
    });
});

module.exports = router;