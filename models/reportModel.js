const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const reportReasons = [
  'Disrespectful Behavior',
  'Hate Speech or Offensive Content',
  'Incivility',
  'Off-Topic Posts',
  'Spam or Self-Promotion',
  'Privacy Violations',
  'Copyright Infringement',
  'Illegal Activities',
  'Disputes with Moderators',
  'Multiple Accounts',
  'Inappropriate Language or Tone',
  'Low-Quality Contributions',
  'Violation of Guidelines',
  'Failure to Stay Informed'
];

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
      enum: reportReasons,
      required: true
    },
    description: String,
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