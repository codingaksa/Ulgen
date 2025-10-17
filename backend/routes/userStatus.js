const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  updateUserStatus,
  getOnlineUsers,
  getUserStatus,
} = require("../controllers/userStatusController");

// Kullanıcı durumunu güncelle
router.put("/status", authenticateToken, updateUserStatus);

// Çevrimiçi kullanıcıları getir
router.get("/online", authenticateToken, getOnlineUsers);

// Belirli bir kullanıcının durumunu getir
router.get("/status/:userId", authenticateToken, getUserStatus);

module.exports = router;
