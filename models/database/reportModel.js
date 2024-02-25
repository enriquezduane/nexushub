const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const reportSchema = new mongoose.Schema({
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    itemType: {
      type: String,
      enum: ['Post', 'Reply', 'User'], // Adjust as needed
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    reportHandledAt: Date // Timestamp indicating when the report was handled (resolved or dismissed)
});

userSchema.virtual('createdAtSGT').get(function() {
    return moment(this.createdAt).tz('Asia/Singapore').format('MMM YYYY hh:mm A'); // Format SGT createdAt
});
  
module.exports = mongoose.model('Report', reportSchema);  