const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    identifier: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: () => Date.now(),
    },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

