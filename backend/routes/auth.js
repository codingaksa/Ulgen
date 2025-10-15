// routes/auth.js
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount,
  // updateStatus,
} = require("../controllers/authController");

const { authenticateToken } = require("../middleware/auth");

/* ================== Public Auth ================== */

// Kayıt & Giriş
router.post("/register", register);
router.post("/login", login);

// E-posta doğrulama akışı
router.get("/verify-email", verifyEmail); // ?token=...
router.post("/resend-verification", resendVerification);

// Şifre sıfırlama akışı
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* ================== Private (Token gerekli) ================== */

router.get("/me", authenticateToken, getMe);
router.post("/logout", authenticateToken, logout);

router.put("/profile", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);

// router.put('/status', authenticateToken, updateStatus); // Controller eklenirse aç

router.delete("/delete-account", authenticateToken, deleteAccount);

module.exports = router;
