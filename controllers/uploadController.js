const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');

const { handleValidationError } = require('./helper');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/profilePictures')
    },
    filename: function (req, file, cb) {
      cb(null, req.user.username + '-' + Date.now() + path.extname(file.originalname)); 
    }
})

// Define file filter function to restrict file types
const fileFilter = (req, file, cb) => {
    // Allowed mime types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      // Accept file
      cb(null, true);
    } else {
      // Reject file
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
    }
};
  
// Define multer upload middleware with restrictions
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB max file size
    }
});

function uploadFile(req, res, next) {
  // Use the multer instance to handle file upload
  upload.single('image')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: err.message });
      }
      // No errors occurred during file upload.
      next(); // Call the next middleware or route handler
  });
}

const updateProfilePicture = async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(403).json({ message: 'User not logged in!' });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
      }
  
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }

      if (user.profilePicture !== 'images/jejeling.gif') {
        // Construct the file path of the old profile picture
        const oldProfilePicturePath = path.join(__dirname, '..', 'public', user.profilePicture);

        // Check if the old profile picture file exists
        if (fs.existsSync(oldProfilePicturePath)) {
            // Delete the old profile picture file
            fs.unlinkSync(oldProfilePicturePath);
        }
    }

      // get file path and save to user
      user.profilePicture = req.file.path.substring(req.file.path.indexOf('public/') + 7);

      await user.save();
        
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (err) {
      console.error('Error uploading file:', err);
      const { status, message } = handleValidationError(err);
      return res.status(status).json({ message });
    }
}

module.exports = {
    uploadFile,
    updateProfilePicture,
}