// routes/files.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { fileUpload, processFile } = require('../middleware/upload');
const { uploadFile, deleteFile } = require('../controllers/fileController');

// Upload file
router.post('/upload', authenticateToken, fileUpload, processFile, uploadFile);

// Delete file
router.delete('/:filename', authenticateToken, deleteFile);

module.exports = router;
