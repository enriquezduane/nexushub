const mongoose = require('mongoose');
const Report = require('../models/reportModel');
const User = require('../models/userModel');

const { handleValidationError } = require('./helper');

const createReport = async (req, res) => {
    try {
        const { type, id, reason, description } = req.body;

        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: 'You must be logged in to report content.' });
        }

        const user = await User.findById(req.user.id);


        const report = new Report({
            _id: new mongoose.Types.ObjectId(),
            reporter: user.id,
            reportedItem: id,
            itemType: type,
            reason: reason,
        });

        if (description) {
            report.description = description;
        }

        await report.save();

        res.status(201).json({ message: 'Report submitted successfully!' });
    } catch (err) {
        console.error('Error:', err);
        const { status, message } = handleValidationError(err);
        return res.status(status).json({ message });
    }
}

module.exports = {
    createReport,
}