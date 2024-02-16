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
  createdAt: { 
    type: Date, 
    default: () => Date.now(),
  },
  updatedAt: { 
    type: Date, 
    default: () => Date.now() 
  },
});

replySchema.post('find', function(docs, next) {
  // Convert dates in the documents to Singaporean Standard Time
  docs.forEach(doc => {
      if (doc.createdAt instanceof Date) {
          // Convert createdAt to Singaporean Standard Time
          doc.createdAt = moment(doc.createdAt).tz('Asia/Singapore').toDate(); // Convert to Date object
          console.log('createdAt: ', doc.createdAt);
      }
      if (doc.updatedAt instanceof Date) {
          // Convert updatedAt to Singaporean Standard Time
          doc.updatedAt = moment(doc.updatedAt).tz('Asia/Singapore').toDate(); // Convert to Date object
          console.log('updatedAt: ', doc.updatedAt);
      }
      // Convert other date fields if needed
  });
  next();
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
