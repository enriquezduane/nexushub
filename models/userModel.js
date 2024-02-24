const mongoose = require('mongoose');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');

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
    required: true,
  },
  email: { 
    type: String, 
    default: "test@test.com",
    lowercase: true,
  },
  role: { 
    type: String, 
    default: "Novice Adventurer",
    required: true 
  },
  description: {
    type: String,
    default: "No description."
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
  upvoted: [
    {
      itemType: {
        type: String,
        enum: ['Post', 'Reply'], 
        required: true
      },
      item: { 
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'upvoted.itemType', 
        required: true
      }
    }
  ],
  downvoted: [
    {
      itemType: {
        type: String,
        enum: ['Post', 'Reply'], // Define the possible types
        required: true
      },
      item: { 
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'downvoted.itemType', // Reference either 'Post' or 'Reply'
        required: true
      }
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

userSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

userSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

userSchema.virtual('roleClass').get(function() {
  return this.role.toLowerCase().replace(" ", "-");
});

userSchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM YYYY hh:mm A'); // Format SGT createdAt
});

userSchema.virtual('joinDateMonth').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM YYYY'); // Format SGT createdAt
});

userSchema.virtual('href').get(function() {
  return `/user/${this._id}`;
});

userSchema.pre('deleteOne', async function(next) {
  try {
    const user = await mongoose.model('User').findOne(this.getQuery()).populate('posts').populate('replies');

    if (user.posts && user.posts.length > 0) {
      await mongoose.model('Post').deleteMany({ _id: { $in: user.posts } });
    }

    if (user.replies && user.replies.length > 0) {
      await mongoose.model('Reply').deleteMany({ _id: { $in: user.replies } });
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('deleteMany', async function(next) {
  try {
    const users = await mongoose.model('User').find(this.getQuery()).populate('posts').populate('replies');

    for (const user of users) {
      if (user.posts && user.posts.length > 0) {
        await mongoose.model('Post').deleteMany({ _id: { $in: user.posts } });
      }

      if (user.replies && user.replies.length > 0) {
        await mongoose.model('Reply').deleteMany({ _id: { $in: user.replies } });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
