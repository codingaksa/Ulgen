// routes/messages.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getMessages,
  createMessage,
  editMessage,
  deleteMessage,
} = require("../controllers/messageController");

// Get messages for a channel
router.get("/:channelId", authenticateToken, getMessages);

// Create a new message
router.post("/", authenticateToken, createMessage);

// Edit a message
router.put("/:messageId", authenticateToken, editMessage);

// Delete a message
router.delete("/:messageId", authenticateToken, deleteMessage);

module.exports = router;
