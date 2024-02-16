const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { 
    type: String, 
    required: true, 
    unique: true,
  },
  password: { 
    type: String, 
    default: "password",
  },
  email: { 
    type: String, 
    default: "test@test.com",
    lowercase: true,
  },
  role: { 
    type: String, 
    required: true 
  },
  posts: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post',
      default: []
    }
  ],
  replies: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Reply',
      default: [] 
    }
  ],
  age: { 
    type: Number, 
    default: 18,
  },
  currentServer: { 
    type: String, 
    default: "None" 
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

userSchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT createdAt
});

userSchema.pre('findOneAndDelete', async function(next) {
  try {
      // Remove all posts created by the user
      await this.model('Post').deleteMany({ _id: { $in: this.posts } });
      await this.model('Reply').deleteMany({ _id: { $in: this.replies } });
      console.log("Deleted all posts and replies by user");
      next();
  } catch (error) {
      next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
