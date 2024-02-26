const passport = require('passport');

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

module.exports = { authenticateUser };