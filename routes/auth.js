const express = require('express');
const router = express.Router();

// import controller
const { authenticateUser } = require('../controllers/authController');

router.post('/login', authenticateUser);

router.post('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/'); 
    });
});

module.exports = router;