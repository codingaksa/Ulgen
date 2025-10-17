// routes/friends.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendRequests,
  getFriends,
} = require("../controllers/friendController");

// Get friends list
router.get("/", authenticateToken, getFriends);

// Get friend requests
router.get("/requests", authenticateToken, getFriendRequests);

// Send friend request
router.post("/request", authenticateToken, sendFriendRequest);

// Accept friend request
router.put("/accept/:requestId", authenticateToken, acceptFriendRequest);

// Reject friend request
router.delete("/reject/:requestId", authenticateToken, rejectFriendRequest);

// Remove friend
router.delete("/remove/:friendId", authenticateToken, removeFriend);

module.exports = router;
