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

userSchema.post('find', function(docs, next) {
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

const User = mongoose.model('User', userSchema);

module.exports = User;
