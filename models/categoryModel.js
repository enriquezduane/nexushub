const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { 
    type: String, 
    required: true 
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

categorySchema.post('find', function(docs, next) {
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

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
