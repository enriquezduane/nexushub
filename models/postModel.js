const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true, 
    unique: true
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
  upvotes: {
    type: Number,
    default: 0,
  },
  replies: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Reply',
      default: []
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

postSchema.virtual('edited').get(function() {
  return this.updatedAt.getTime() !== this.createdAt.getTime();
});

postSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

postSchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT createdAt
});

postSchema.virtual('updatedAtSGT').get(function() { 
  return moment(this.updatedAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT updatedAt
});

postSchema.pre('save', async function(next) {
  try {
    // Check if the document is new (i.e., being created)
    if (this.isNew) {
      // Add the new post object id to the board's posts array
      const board = await mongoose.model('Board').findById(this.refBoard);

      if (board) {
        board.posts.push(this._id);
        await board.save();
      }

      // Add the new post object id to the poster's posts array
      const poster = await mongoose.model('User').findById(this.poster);

      if (poster) {
        poster.posts.push(this._id);
        await poster.save();
      }
    }

    console.log('Post pre save middleware executed');

    next();
  } catch (error) {
    next(error);
  }
});

postSchema.pre('deleteOne', async function (next) {
  try {
    const post = await mongoose.model('Post').findOne(this.getQuery()).populate('refBoard').populate('poster');

    // Remove the deleted post from the associated board's posts array
    const board = await mongoose.model('Board').findById(post.refBoard);
    if (board) {
      board.posts.pull(post._id);
      await board.save();
    }

    // Remove the deleted post from the poster's posts array
    const poster = await mongoose.model('User').findById(post.poster);
    if (poster) {
      poster.posts.pull(post._id);
      await poster.save();
    }

    // Remove the deleted post's replies
    if (post.replies && post.replies.length > 0) {
      const replyDeletionResult = await mongoose.model('Reply').deleteMany({ _id: { $in: post.replies } });
      console.log('Post Model Reply deletion result:', replyDeletionResult);
    }

    console.log('Post pre deleteOne middleware executed');
    next();
  } catch (error) {
    next(error);
  }
});

postSchema.pre('deleteMany', async function (next) {
  try {
    const posts = await mongoose.model('Post').find(this.getQuery()).populate('refBoard').populate('poster');

    for (const post of posts) {
      // Remove the deleted post from the associated board's posts array
      const board = await mongoose.model('Board').findById(post.refBoard);

      if (board) {
        board.posts.pull(post._id);
        await board.save();
      }

      // Remove the deleted post from the poster's posts array
      const poster = await mongoose.model('User').findById(post.poster);

      if (poster) {
        poster.posts.pull(post._id);
        await poster.save();
      }
      
      // Remove the deleted post's replies
      if (post.replies && post.replies.length > 0) {
        const postDeletionResult = await mongoose.model('Reply').deleteMany({ _id: { $in: post.replies } });
        console.log('Post Model Reply deletion result:', postDeletionResult);
      }
    }

    console.log('Post pre deleteMany middleware executed');

    next();
  } catch (error) {
    next(error);
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
