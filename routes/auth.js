const express = require('express');
const router = express.Router();

// import controller
const { authenticateUser, logoutUser } = require('../controllers/authController');

router.post('/login', authenticateUser);

router.post('/logout', logoutUser);

module.exports = router;