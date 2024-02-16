const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true 
  },
  boards: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Board' 
    }
  ],
  createdAt: { 
    type: Date, 
    default: () => Date.now(),
  },
  updatedAt: { 
    type: Date, 
    default: () => Date.now() 
  },
});

categorySchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT createdAt
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
