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

userSchema.pre('deleteOne', async function(next) {
  try {
    const user = await mongoose.model('User').findOne(this.getQuery()).populate('posts').populate('replies');

    if (user.posts && user.posts.length > 0) {
      const postDeletionResult = await mongoose.model('Post').deleteMany({ _id: { $in: user.posts } });
      console.log('User Model Post deletion result:', postDeletionResult);
    }

    if (user.replies && user.replies.length > 0) {
      const replyDeletionResult = await mongoose.model('Reply').deleteMany({ _id: { $in: user.replies } });
      console.log('User Model Reply deletion result:', replyDeletionResult);
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
        const postDeletionResult = await mongoose.model('Post').deleteMany({ _id: { $in: user.posts } });
        console.log('User Model Post deletion result:', postDeletionResult);
      }

      if (user.replies && user.replies.length > 0) {
        const replyDeletionResult = await mongoose.model('Reply').deleteMany({ _id: { $in: user.replies } });
        console.log('User Model Reply deletion result:', replyDeletionResult);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
