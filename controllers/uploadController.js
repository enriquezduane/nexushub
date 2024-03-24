const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

const { handleValidationError } = require('./helper');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profilePictures');
    },
    filename: function (req, file, cb) {
        cb(null, req.user.username + '-' + Date.now() + path.extname(file.originalname));
    }
});

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

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const updateProfilePicture = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(403).json({ message: 'User not logged in!' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded!' });
        }

        const result = await cloudinary.uploader.upload(req.file.path); // Upload file to Cloudinary

        // Delete the uploaded file from the file system
        fs.unlinkSync(req.file.path);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Save the image URL to the user's profilePicture field
        user.profilePicture = result.secure_url;
        await user.save();

        res.status(200).json({ message: 'File uploaded successfully', imageUrl: result.secure_url });
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
