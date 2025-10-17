// controllers/emailController.js
const User = require('../models/User');
const crypto = require('crypto');

// @desc Send email verification
// @route POST /api/email/send-verification
// @access Private
const sendEmailVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'E-posta zaten doğrulanmış'
      });
    }

    // Yeni doğrulama token'ı oluştur
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Burada gerçek uygulamada e-posta gönderilir
    // Şimdilik token'ı response'da döndürelim (geliştirme için)
    console.log(`Email verification token for ${user.email}: ${verificationToken}`);

    res.json({
      success: true,
      message: 'Doğrulama e-postası gönderildi',
      // Geliştirme için token'ı döndürüyoruz
      verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
    });

  } catch (error) {
    console.error('Send email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Doğrulama e-postası gönderilirken hata oluştu'
    });
  }
};

// @desc Verify email
// @route POST /api/email/verify
// @access Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Doğrulama token\'ı gerekli'
      });
    }

    // Token'ı hash'le
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Kullanıcıyı bul
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token'
      });
    }

    // E-postayı doğrula
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'E-posta başarıyla doğrulandı'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'E-posta doğrulanırken hata oluştu'
    });
  }
};

// @desc Resend email verification
// @route POST /api/email/resend-verification
// @access Private
const resendEmailVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'E-posta zaten doğrulanmış'
      });
    }

    // Yeni doğrulama token'ı oluştur
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Burada gerçek uygulamada e-posta gönderilir
    console.log(`Resend email verification token for ${user.email}: ${verificationToken}`);

    res.json({
      success: true,
      message: 'Doğrulama e-postası tekrar gönderildi',
      // Geliştirme için token'ı döndürüyoruz
      verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
    });

  } catch (error) {
    console.error('Resend email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Doğrulama e-postası tekrar gönderilirken hata oluştu'
    });
  }
};

module.exports = {
  sendEmailVerification,
  verifyEmail,
  resendEmailVerification
};
