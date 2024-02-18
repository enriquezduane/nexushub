const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true,
    unique: true,
  },
  boards: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Board' 
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

categorySchema.virtual('createdAtSGT').get(function() {
  return moment(this.createdAt).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); // Format SGT createdAt
});

categorySchema.virtual('boardCount').get(function() {
  return this.boards.length;
});

categorySchema.pre('deleteOne', async function(next) {
  try {
    const category = await mongoose.model('Category').findOne(this.getQuery()).populate('boards');

    // Remove the category's boards
    if (category.boards && category.boards.length > 0) {
      const boardDeletionResult = await mongoose.model('Board').deleteMany({ _id: { $in: category.boards } });
      console.log('Category Model Board deletion result:', boardDeletionResult);
    }

    console.log('Category pre deleteOne middleware executed');
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.pre('deleteMany', async function(next) {
  try {
    const categories = await mongoose.model('Category').find(this.getQuery()).populate('boards');

    for (const category of categories) {
      // Remove the category's boards
      if (category.boards && category.boards.length > 0) {
        const boardDeletionResult = await mongoose.model('Board').deleteMany({ _id: { $in: category.boards } });
        console.log('Category Model Board deletion result:', boardDeletionResult);
      }
    }

    console.log('Category pre deleteMany middleware executed');
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
