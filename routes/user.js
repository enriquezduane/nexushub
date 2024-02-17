const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { populateAll } = require('../controllers/helper');

// import controller
const { getUserByUrl, updateUser } = require('../controllers/userController');

router.get('/update-:id', (req, res) => {
    try {
        // Render the edit profile page
        res.render('updateProfile', { loggedIn: true, title: 'Update Profile', userId: req.params.id});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
})

router.get('/:id', populateAll, getUserByUrl, (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('user', { loggedIn: true, title: res.user.username, user: res.user });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
})

router.patch('/', updateUser);

module.exports = router;