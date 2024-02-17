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
  upvotes: {
    type: Number,
    default: 0,
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

replySchema.virtual('updatedAtSGT').get(function() {
  return moment(this.updatedAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT updatedAt
});

replySchema.pre('save', async function(next) {
  try {
    // Check if the document is new (i.e., being created)
    if (this.isNew) {
      // Add the new reply object id to the post's replies array
      const post = await mongoose.model('Post').findById(this.refPost);

      if (post) {
        post.replies.push(this._id);
        await post.save();
      }

      // Add the new reply object id to the poster's replies array
      const poster = await mongoose.model('User').findById(this.poster);

      if (poster) {
        poster.replies.push(this._id);
        await poster.save();
      }
    } 
    
    console.log('Reply pre-save middleware executed');
    next();
  } catch (error) {
    next(error);
  }
});

replySchema.pre('deleteOne', async function(next) {
  try {
    const reply = await mongoose.model('Reply').findOne(this.getQuery()).populate('refPost').populate('poster');

    // Remove the deleted reply from the associated post's replies array
    const post = await mongoose.model('Post').findById(reply.refPost);
    if (post) {
      post.replies.pull(reply._id);
      await post.save();
    }

    // Remove the deleted reply from the poster's posts array
    const poster = await mongoose.model('User').findById(reply.poster);
    if (poster) {
      poster.posts.pull(reply._id);
      await poster.save();
    }

    console.log('Reply pre deleteOne middleware executed');

    next();
  } catch (error) {
    next(error);
  }
});

replySchema.pre('deleteMany', async function(next) {
  try {
    const replies = await mongoose.model('Reply').find(this.getQuery()).populate('refPost').populate('poster');

    for (const reply of replies) {
      // Remove the deleted reply from the associated post's replies array
      const post = await mongoose.model('Post').findById(reply.refPost);
      if (post) {
        post.replies.pull(reply._id);
        await post.save();
      }

      // Remove the deleted reply from the poster's posts array
      const poster = await mongoose.model('User').findById(reply.poster);
      if (poster) {
        poster.replies.pull(reply._id);
        await poster.save();
      }
    }
    
    console.log('Reply pre deleteMany middleware executed');

    next();
  } catch (error) {
    next(error);
  }
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
