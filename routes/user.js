const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll, headerFooterData } = require('../controllers/helper');

// import controller
const { renderUpdateProfile, renderUser, getUserByUrl, updateUser, createUser } = require('../controllers/userController');

router.get('/update=:id', headerFooterData, renderUpdateProfile);

router.get('/:id', populateAll, getUserByUrl, headerFooterData, renderUser);

router.post('/new', createUser);

router.patch('/', updateUser);

module.exports = router;