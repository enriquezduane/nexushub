const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const boardSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true,
    unique: true,
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

boardSchema.virtual('totalReplyCount').get(function() {
  let totalReplies = 0;

  for (const post of this.posts) {
    totalReplies += post.replies.length;
  }

  return totalReplies;
});

boardSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

boardSchema.virtual('lastPost').get(function() { 
  return this.posts[this.posts.length - 1];
});

boardSchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT createdAt
});

boardSchema.virtual('href').get(function() {
  return `/forum/${this._id}`;
});

boardSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      // Add the board to the associated category's boards array
      const category = await mongoose.model('Category').findById(this.category);

      if (category) {
        category.boards.push(this._id);
        await category.save();
      }
    } 

    next();
  } catch (error) {
    next(error);
  }
});

boardSchema.pre('deleteOne', async function(next) {
  try {
    const board = await mongoose.model('Board').findOne(this.getQuery()).populate('category').populate('posts');

    // Remove the deleted board from the associated category's boards array
    const category = await mongoose.model('Category').findById(board.category);

    if (category) {
      category.boards.pull(board._id);
      await category.save();
    }

    // Remove the board's posts
    if (board.posts && board.posts.length > 0) {
      await mongoose.model('Post').deleteMany({ _id: { $in: board.posts } });
    }

    next();
  } catch (error) {
    next(error);
  }
});

boardSchema.pre('deleteMany', async function(next) {
  try {
    const boards = await mongoose.model('Board').find(this.getQuery()).populate('category').populate('posts');

    for (const board of boards) {
      // Remove the deleted board from the associated category's boards array
      const category = await mongoose.model('Category').findById(board.category);

      if (category) {
        category.boards.pull(board._id);
        await category.save();
      }

      // Remove the boards' posts
      if (board.posts && board.posts.length > 0) {
        await mongoose.model('Post').deleteMany({ _id: { $in: board.posts } });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
