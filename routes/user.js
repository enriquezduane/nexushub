const express = require('express');
const router = express.Router();
path = require('path');

// router middlewares
router.use(express.static('public'));

// initialize database
const populate = require('../database/initdb');

// import controller
const { getUserByUrl } = require('../controllers/userController');

router.get('/:id', populate, getUserByUrl, (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('user', { loggedIn: true, user: res.user });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;