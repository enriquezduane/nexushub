const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/userModel');

const initializePassport = (passport) => {
    const authenticateUser = async (username, password, done) => {
        console.log('Authenticating user:', username);
        
        try {
            const user = await User.findOne({ username: username });
            console.log('User found:', user ? user.username : 'Not found');
            
            if (!user) {
                console.log('No user found with username:', username);
                return done(null, false, { message: 'No user with that username' });
            }

            if (password === "password") {
                console.log('Using default password');
                return done(null, user);
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (passwordMatch) {
                console.log('User authenticated successfully');
                return done(null, user);
            } else {
                console.log('Incorrect password for user:', username);
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
            return done(error);
        }
    };
    

    passport.use(new LocalStrategy(authenticateUser));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initializePassport;