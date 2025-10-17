// routes/email.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  sendEmailVerification,
  verifyEmail,
  resendEmailVerification
} = require('../controllers/emailController');

// Send email verification
router.post('/send-verification', authenticateToken, sendEmailVerification);

// Verify email
router.post('/verify', verifyEmail);

// Resend email verification
router.post('/resend-verification', authenticateToken, resendEmailVerification);

module.exports = router;
