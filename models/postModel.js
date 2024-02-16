const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true 
  },
  refBoard: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Board', 
    required: true 
  },
  poster: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  replies: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Reply' 
    }
  ],
  views: { 
    type: Number, 
    default: 0 
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

postSchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT createdAt
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
