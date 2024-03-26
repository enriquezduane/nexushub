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
      itemType: {
          type: String,
          enum: ['Post', 'Reply'], // Define the possible types
          required: [true, 'Please specify the type of item being reported.']
      },
      item: { 
          type: mongoose.Schema.Types.ObjectId,
          required: [true, 'Please specify the item being reported.'],
          refPath: 'reportedItem.itemType' // Reference either 'Post' or 'Reply'
      }
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
      enum: ['Pending', 'Resolved', 'Dismissed'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
    reportHandledAt: Date // Timestamp indicating when the report was handled (resolved or dismissed)
});

// prevent duplicate reports from the same user to the same item
reportSchema.path('reporter').validate(async function(value) {
  // Check if the report is being updated
  if (this.isNew || this.isModified('reporter') || this.isModified('reportedItem')) {
    const existingReport = await this.constructor.findOne({ reporter: value, reportedItem: this.reportedItem });
    return !existingReport;
  }
  
  // If the report is not being updated, validation passes
  return true;
}, 'You have already reported this item.');

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;  