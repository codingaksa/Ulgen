const express = require('express');
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
  updateStatus
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);
router.put('/status', authenticateToken, updateStatus);
router.delete('/delete-account', authenticateToken, deleteAccount);

module.exports = router;
