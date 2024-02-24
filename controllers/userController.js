const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const renderUpdateProfile = (req, res) => {
  try {
    // Render the edit profile page
    res.render('updateProfile', { 
      loggedIn: true, 
      title: 'Update Profile', 
      userId: req.params.id, 
      forumRules: res.forumRules, 
      userLoggedIn: res.userLoggedIn
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: err.message });
  }
}

const renderUser = (req, res) => {
  try {
    // Render the users page
    res.render('user', { loggedIn: true, title: res.user.username, user: res.user, forumRules: res.forumRules, userLoggedIn: res.userLoggedIn });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: err.message });
  }
}

const getUserByUrl = async (req, res, next) => {
  try {
      // Split the URL by slashes and get the last part
      const url = req.originalUrl;
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      
      // Find the board in the database
      const user = await User.findById(lastPart);  

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      } else {
          res.user = user;
      }
  }
  catch (err) {
      console.log('Error fetching user:', err.message)
      res.status(500).json({ message: err.message });
  }
  next();
}

const createUser = async (req, res) => {
  try {
    // Get the username and password from the request body
    const { registerUsername, registerPassword } = req.body;

    // Check if the username already exists
    const existing = await User.findOne({ username: registerUsername });

    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerPassword, salt);

    const user = new User({ 
        _id: new mongoose.Types.ObjectId(),
        username: registerUsername, 
        password: hashedPassword,
        role: 'Novice Adventurer',
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    
    await user.save();

    req.login(user, (err) => {
      if (err) {
          return res.status(500).json({ message: 'Login failed after registration' });
      }
      return res.status(200).json({ message: 'User registered and logged in successfully' });
    });

  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: err.message });
  }
}

const updateUser = async (req, res) => {
  try {
    const { userId, age, description, newPassword } = req.body;
    const user = await User.findById(userId);

    if (age) {
      user.age = age;
    }

    if (newPassword) {
      user.password = newPassword;
    }

    if (description) {
      user.description = description;
    }

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  }
  catch (err) {
    console.log('Error updating user:', err.message);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  renderUpdateProfile,
  renderUser,
  getUserByUrl,
  createUser,
  updateUser,
}
