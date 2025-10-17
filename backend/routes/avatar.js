// routes/avatar.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { upload, processImage } = require("../middleware/upload");
const {
  uploadAvatar,
  deleteAvatar,
} = require("../controllers/avatarController");

// Avatar upload
router.post("/upload", authenticateToken, upload, processImage, uploadAvatar);

// Avatar delete
router.delete("/delete", authenticateToken, deleteAvatar);

module.exports = router;
