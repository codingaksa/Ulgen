// controllers/authController.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const {
  sendEmailVerification,
  sendPasswordReset,
} = require("../services/emailService");

// Generate JWT
const generateToken = (userId) =>
  jwt.sign({ userId: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// @desc Register
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { username }],
    }).select("_id email username");
    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          existing.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    const user = await User.create({ username, email, password });

    // Email verify token (DB'ye hash, mailde RAW)
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    try {
      await sendEmailVerification(user.email, user.username, verificationToken);
    } catch (e) {
      // Kayıt başarılı; mail hatası kayıt akışını bozmasın
      console.error("Email sending failed:", e);
    }

    return res.status(201).json({
      success: true,
      message: "User registered. Please verify your email.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Registration failed" });
  }
};

// @desc Login
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Geçici olarak e-posta doğrulama zorunluluğunu kaldırdık (test için)
    // if (!user.isEmailVerified) {
    //   return res.status(401).json({
    //     success: false,
    //     message:
    //       "E-posta adresinizi doğrulamanız gerekiyor. Lütfen e-posta kutunuzu kontrol edin.",
    //     requiresVerification: true,
    //   });
    // }

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

// @desc Get current user
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("channels");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        channels: user.channels,
      },
    });
  } catch (err) {
    console.error("Get me error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get user data" });
  }
};

// @desc Logout
// @route POST /api/auth/logout
// @access Private
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date(),
    });
    return res.json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// @desc Update profile
// @route PUT /api/auth/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updateData = {};

    // Mevcut kullanıcı çek (username karşılaştırması için)
    const current = await User.findById(req.user._id).select("username");
    if (!current)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (
      typeof username === "string" &&
      username.trim() &&
      username.trim() !== current.username
    ) {
      const exists = await User.findOne({ username: username.trim() }).select(
        "_id"
      );
      if (exists)
        return res
          .status(400)
          .json({ success: false, message: "Username already taken" });
      updateData.username = username.trim();
    }

    if (typeof avatar === "string" && avatar.trim())
      updateData.avatar = avatar.trim();

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Profile update failed" });
  }
};

// @desc Verify email (GET)
// @route GET /api/auth/verify-email?token=...
// @access Public
const verifyEmail = async (req, res) => {
  try {
    const raw = String(req.query.token || "");
    if (!raw) {
      return res
        .status(400)
        .json({ success: false, message: "Doğrulama token'ı bulunamadı" });
    }

    const hashed = crypto.createHash("sha256").update(raw).digest("hex");

    // süre kontrolü: emailVerificationExpires > now
    const user = await User.findOne({
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      const maybe = await User.findOne({ emailVerificationToken: hashed })
        .select("_id emailVerificationExpires isEmailVerified")
        .lean();
      return res.status(400).json({
        success: false,
        message: maybe
          ? "Doğrulama linki süresi dolmuş. Lütfen yeni bir doğrulama e-postası talep edin."
          : "Geçersiz doğrulama token'ı",
      });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "E-posta adresi zaten doğrulanmış" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // İstersen redirect:
    // return res.redirect(302, `${process.env.CLIENT_URL}/verify-email/success`);
    return res.json({
      success: true,
      message:
        "E-posta adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz.",
    });
  } catch (err) {
    console.error("Email verification error:", err);
    return res
      .status(500)
      .json({ success: false, message: "E-posta doğrulama işlemi başarısız" });
  }
};

// @desc Resend verification
// @route POST /api/auth/resend-verification
// @access Public
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified" });
    }

    const token = user.generateEmailVerificationToken();
    await user.save();

    await sendEmailVerification(user.email, user.username, token);

    return res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to resend verification email" });
  }
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    await sendPasswordReset(user.email, user.username, resetToken);

    return res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
};

// @desc Reset password
// @route POST /api/auth/reset-password
// @access Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Token and password are required" });
    }

    const hashed = crypto
      .createHash("sha256")
      .update(String(token))
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Password reset failed" });
  }
};

// @desc Change password
// @route PUT /api/auth/change-password
// @access Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const ok = await user.comparePassword(currentPassword);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Password change failed" });
  }
};

// @desc Delete account
// @route DELETE /api/auth/delete-account
// @access Private
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Account deletion failed" });
  }
};

module.exports = {
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
};
