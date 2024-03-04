const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { populateUser, populateUsers, handleValidationError, paginationLimit } = require('./helper');

const renderUpdateProfile = (req, res) => {
  try {
    // Render the edit profile page
    if (!req.isAuthenticated() || req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden Access' });
    }

    res.render('updateProfile', { 
      loggedIn: req.isAuthenticated(), 
      title: 'Update Profile', 
      userId: req.params.id, 
      user: res.user,
      forumRules: res.forumRules, 
      userLoggedIn: req.user
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: err.message });
  }
}

const renderPosts = (req, res) => {
  try {
    // Render the users posts page

    if (req.query.page) {
      if (req.query.page < 1 || req.query.page > res.totalPages || isNaN(req.query.page)) {
          return res.status(404).json({ message: 'Page not found' });
      }
    }

    res.render('myPosts', { 
      loggedIn: req.isAuthenticated(),
      title: `Posts by ${res.user.username}`, 
      user: res.user, 
      posts: res.posts.sort((a, b) => b.createdAt - a.createdAt),
      page: res.page,
      totalPages: res.totalPages,
      forumRules: res.forumRules, 
      userLoggedIn: req.user 
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: error.message });
  }
}

const renderReplies = (req, res) => {
  try {
    // Render the users replies page

    if (req.query.page) {
      if (req.query.page < 1 || req.query.page > res.totalPages || isNaN(req.query.page)) {
          return res.status(404).json({ message: 'Page not found' });
      }
    }

    res.render('myReplies', { 
      loggedIn: req.isAuthenticated(),
      title: `Replies by ${res.user.username}`, 
      user: res.user, 
      replies: res.replies.sort((a, b) => b.createdAt - a.createdAt),
      page: res.page,
      totalPages: res.totalPages,
      forumRules: res.forumRules, 
      userLoggedIn: req.user 
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: err.message });
  }
}

const renderUser = (req, res) => {
  try {
    // Render the users page
    res.render('user', { 
      loggedIn: req.isAuthenticated(), 
      title: res.user.username, 
      user: res.user, forumRules: 
      res.forumRules, 
      userLoggedIn: req.user 
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: error.message });
  }
}

const renderUsers = (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'User is not logged in!' });
    }

    // Render all users page
    if (req.query.page) {
      if (req.query.page < 1 || req.query.page > res.totalPages || isNaN(req.query.page)) {
          return res.status(404).json({ message: 'Page not found' });
      }
    }

    res.render('allUsers', { 
      loggedIn: req.isAuthenticated(), 
      title: 'All Users', 
      users: res.paginationResults, 
      letter: req.query.letter,
      page: res.page,
      totalPages: res.totalPages,
      forumRules: res.forumRules, 
      userLoggedIn: req.user 
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: error.message });
  }
}

const getUserByUrl = async (req, res, next) => {
  try {
      const user = await User.findById(req.params.id);  

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      } else {
          res.user = await populateUser(user);
      }
      next();
  } catch (err) {
      console.log('Error fetching user:', err.message)
      res.status(500).json({ message: err.message });
  }
}

const getUsers = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.letter) {
      const letterRegex = new RegExp(`^${req.query.letter}`, 'i');
      query = { username: { $regex: letterRegex } };
    }

    const users = await User.find(query).collation({ locale: 'en', strength: 2 }).sort({ username: 1 });

    if (!users) {
      return res.status(404).json({ message: 'Users not found' });
    } else {
      res.users = await populateUsers(users);
    }

    next();
  } catch (err) {
    console.log('Error fetching users:', err.message)
    res.status(500).json({ message: err.message });
  }
}


const getUsersPagination = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = paginationLimit;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  try {
    const users = res.users;

    const totalPages = Math.ceil(users.length / limit);

    const paginatedUsers = users.slice(startIndex, endIndex);

    res.paginationResults = paginatedUsers;
    res.totalPages = totalPages ? totalPages : 1;
    res.page = page;

    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
}

const getPagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = paginationLimit;

  try {
    const user = res.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Extract pagination type and user ID from the URL path
    const pathSegments = req.originalUrl.split('/');
    const paginationType = pathSegments[pathSegments.length - 1].split('=')[0]; // "posts" or "replies"

    dataToPaginate = paginationType === 'posts' ? user.posts : user.replies;

    const totalPages = Math.ceil(dataToPaginate.length / limit);
    
    // Calculate startIndex and endIndex in reverse order
    let endIndex = dataToPaginate.length - (page - 1) * limit;
    let startIndex = Math.max(0, endIndex - limit);

    const results = dataToPaginate.slice(startIndex, endIndex);

    if (paginationType === 'posts') {
      res.posts = results;
    } else {
      res.replies = results;
    }

    res.totalPages = totalPages ? totalPages : 1;
    res.page = page;

    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
}

const setReplyHrefs = (req, res, next) => {
  const limit = paginationLimit;
  const replies = res.replies;

  try {
      replies.forEach(reply => {
      // index + 2 to account for the post which is page 1 and array indexing starting at 0
      const page = Math.ceil((reply.refPost.replies.findIndex(item => item.id === reply.id)) + 2 / limit);
      reply.href = `/forum/${reply.refPost.refBoard._id}/${reply.refPost._id}?page=${page}#${reply._id}`;
    });

    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
}

const createUser = async (req, res) => {
  try {
    // Get the username and password from the request body
    const { registerUsername, registerEmail, registerPassword } = req.body;

    if (registerPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters!'}); 
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerPassword, salt);

    const user = new User({ 
        _id: new mongoose.Types.ObjectId(),
        username: registerUsername, 
        password: hashedPassword,
        email: registerEmail,
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
    const { status, message } = handleValidationError(err);
    return res.status(status).json({ message });
  }
}

const updateUser = async (req, res) => {
  try {
    const { userId, email, age, description, newPassword } = req.body;

    if (!req.isAuthenticated() || req.user.id !== userId) {
      return res.status(403).json({ message: 'User not logged in!' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email) {
      user.email = email;
    }

    if (age) {
      user.age = age;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters!'});
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
    }

    if (description) {
      user.description = description;
    }

    user.updatedAt = Date.now();

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  }
  catch (err) {
    console.error('Error:', err);
    const { status, message } = handleValidationError(err);
    return res.status(status).json({ message });
  }
}

module.exports = {
  renderUpdateProfile,
  renderPosts,
  renderReplies,
  renderUsers,
  renderUser,
  getUserByUrl,
  getUsers,
  getUsersPagination,
  getPagination,
  setReplyHrefs,
  createUser,
  updateUser,
}
