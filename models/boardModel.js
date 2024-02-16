const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const boardSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  innerDescription: { 
    type: String, 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true
  },
  posts: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post' 
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

boardSchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT createdAt
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
