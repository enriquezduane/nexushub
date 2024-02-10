const Reply = require('../models/replyModel');

// Create a new reply
exports.createReply = async (req, res) => {
    try {
        const newReply = await Reply.create(req.body);
        res.status(201).json(newReply);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all replies
exports.getAllReplies = async (req, res) => {
    try {
        const replies = await Reply.find();
        res.json(replies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user by ID
exports.getReplyById = async (req, res) => {
    try {
      const reply = await Reply.findById(req.params.id);
      if (!reply) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(reply);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
// Update user by ID
exports.updateReplyById = async (req, res) => {
    try {
        const reply = await Reply.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reply) {
        return res.status(404).json({ message: 'User not found' });
        }
        res.json(reply);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user by ID
exports.deleteReplyById = async (req, res) => {
    try {
        const reply = await Reply.findByIdAndDelete(req.params.id);
        if (!reply) {
        return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
