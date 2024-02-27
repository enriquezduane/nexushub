const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const reportReasons = [
  'Disrespectful Behavior',
  'Hate Speech or Offensive Content',
  'Off-Topic Posts',
  'Spam or Self-Promotion',
  'Privacy Violations',
  'Copyright Infringement',
  'Illegal Activities',
  'Multiple Accounts',
  'Inappropriate Language or Tone',
  'Violation of Guidelines',
  'Other'
];

const reportSchema = new mongoose.Schema({
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify the user reporting the item.']
    },
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please specify the item being reported.']
    },
    itemType: {
      type: String,
      enum: ['Post', 'Reply', 'User'], // Adjust as needed
      required: [true, 'Please specify the type of item being reported.']
    },
    reason: {
      type: String,
      enum: reportReasons,
      required: [true, 'Please select a reason for reporting.']
    },
    description: {
      type: String,
      default: 'No description provided.',
      maxlength: [500, 'Description cannot exceed 500 characters.'] 
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
    reportHandledAt: Date // Timestamp indicating when the report was handled (resolved or dismissed)
});

reportSchema.path('reporter').validate(async function(value) {
  const existingReport = await this.constructor.findOne({ reporter: value, reportedItem: this.reportedItem });
  return !existingReport;
}, 'You have already reported this item.');

reportSchema.virtual('createdAtSGT').get(function() {
    return moment(this.createdAt).tz('Asia/Singapore').format('MMM YYYY hh:mm A'); // Format SGT createdAt
});
  
module.exports = mongoose.model('Report', reportSchema);  