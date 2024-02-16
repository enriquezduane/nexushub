const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const replySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true 
  },
  refPost: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true
  },
  poster: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reply: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: () => Date.now(),
  },
  updatedAt: { 
    type: Date, 
    default: () => Date.now() 
  },
});

replySchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT createdAt
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
