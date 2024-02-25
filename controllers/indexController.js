const { formatLatestPostDate } = require('../controllers/helper');
const passport = require('passport');

const renderIndex = (req, res) => {
    try {
        res.render('index', { 
            loggedIn: req.isAuthenticated(), 
            title: "NexusHub", 
            categories: res.categories, 
            boards: res.boards, 
            posts: res.posts, 
            users: res.users, 
            formatLatestPostDate, 
            forumRules: res.forumRules, 
            userLoggedIn: req.user
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
}

const renderTerms = (req, res) => {
    res.render('terms', { 
        loggedIn: req.isAuthenticated(), 
        title: "Terms and Conditions", 
        forumRules: 
        res.forumRules, 
        userLoggedIn: req.user 
    });
}

const authenticateUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            if (info && info.message === 'No user with that username') {
                // Username was incorrect
                return res.status(401).json({ error: 'No user with that username.' });
            } else if (info && info.message === 'Password incorrect') {
                // Password was incorrect
                return res.status(401).json({ error: 'Incorrect password.' });
            }
            // If there's no specific message, use a generic one
            return res.status(401).json({ error: 'Authentication failed. Please try again.' });
        }
        // Authentication successful
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Send JSON response indicating successful login
            res.json({ success: true });
        });
    })(req, res, next);
};

module.exports = {
    renderIndex,
    renderTerms,
    authenticateUser
}