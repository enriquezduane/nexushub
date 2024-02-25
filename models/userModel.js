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
    maxlength: 15,
    minlength: 3,
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

userSchema.pre('save', async function(next) {
  try {
    // Check if the user's role needs to be updated based on post count
    if (this.isModified('posts') && this.role !== 'Forum Master') {
      const postCount = this.postCount; // Use the virtual property
      let newRole = this.role; // Default to current role

      // Determine the new role based on post count
      if (postCount >= 2 && postCount < 5) {
        newRole = 'Initiate Acolyte';
      } else if (postCount >= 5 && postCount < 10) {
        newRole = 'Rookie Blacksmith';
      } else if (postCount >= 10 && postCount < 20) {
        newRole = 'Journeyman Wizard';
      } else if (postCount >= 20 && postCount < 40) {
        newRole = 'Veteran Archer';
      } else if (postCount >= 40 && postCount < 75) {
        newRole = 'Elite Knight';
      } else if (postCount >= 75 && postCount < 150) {
        newRole = 'Master Assassin';
      } else if (postCount >= 150) {
        newRole = 'Grandmaster Scholar';
      }

      // Update the user's role if it has changed
      if (newRole !== this.role) {
        this.role = newRole;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
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
