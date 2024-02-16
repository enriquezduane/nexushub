const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const boardSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true 
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

boardSchema.post('find', function(docs, next) {
  // Convert dates in the documents to Singaporean Standard Time
  docs.forEach(doc => {
      if (doc.createdAt instanceof Date) {
          doc.createdAt = moment(doc.createdAt).format(); // Convert createdAt date
      }
      if (doc.updatedAt instanceof Date) {
          doc.updatedAt = moment(doc.updatedAt).format(); // Convert updatedAt date
      }
      // Convert other date fields if needed
  });
  next();
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
