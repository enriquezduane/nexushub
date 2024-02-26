const express = require('express');
const multer = require('multer');
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage });

// Route for handling file uploads
router.post('/', upload.single('image'), (req, res) => {
  // Handle the uploaded file here
  console.log(req.file)
  res.send('File uploaded successfully');
});

module.exports = router;
