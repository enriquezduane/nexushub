const express = require('express');
const router = express.Router();

const { uploadFile, updateProfilePicture } = require('../controllers/uploadController');

router.post('/', uploadFile, updateProfilePicture);

module.exports = router;
