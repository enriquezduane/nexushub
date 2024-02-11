const User = require('../models/userModel');

// Create a new user
const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserByUrl = async (req, res, next) => {
  try {
      // Split the URL by slashes and get the last part
      const url = req.originalUrl;
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];

      // Remove id= text
      const idText = lastPart.replace("id=", '');
      const idValue = parseInt(idText);

      // Find the board in the database
      const user = await User.findOne({ id: idValue });  

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      } else {
          res.user = user;
      }
  }
  catch (err) {
      res.status(500).json({ message: err.message });
  }
  next();
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByUrl,
}
