const passport = require('passport');
const uuid = require('uuid');

const issueRememberToken = async (user) => {
    const token = uuid.v4(); // Generate a random token
    user.rememberToken = token;
    await user.save();
    return token;
};

const authenticateUser = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
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
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }

            // If remember me option is selected, issue remember me token
            if (req.body.rememberMe) {
                const token = await issueRememberToken(user);

                // Store remember me token in cookie
                res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days expiration time
            }

            // Send JSON response indicating successful login
            return res.json({ success: true });
        });
    })(req, res, next);
};

const logoutUser = async (req, res) => {
    // Remove the rememberToken from the user
    try {
        if (req.user) {
            await req.user.updateOne({ $unset: { rememberToken: 1 } });
        }
    } catch (error) {
        console.error(error);
    }

    // Clear the remember_me cookie
    res.clearCookie('remember_me');

    // Logout the user
    req.logout(() => {
        res.redirect('/');
    });
};

module.exports = { authenticateUser, logoutUser };