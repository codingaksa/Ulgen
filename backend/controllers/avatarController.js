// controllers/avatarController.js
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// @desc Upload avatar
// @route POST /api/avatar/upload
// @access Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.processedImage) {
      return res.status(400).json({
        success: false,
        message: "Resim dosyası bulunamadı",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Eski avatar'ı sil (eğer varsa)
    if (user.avatar && user.avatar.startsWith("/uploads/avatars/")) {
      const oldAvatarPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Yeni avatar'ı kaydet
    user.avatar = req.processedImage.url;
    await user.save();

    res.json({
      success: true,
      message: "Avatar başarıyla yüklendi",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({
      success: false,
      message: "Avatar yüklenirken hata oluştu",
    });
  }
};

// @desc Delete avatar
// @route DELETE /api/avatar/delete
// @access Private
const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Mevcut avatar'ı sil
    if (user.avatar && user.avatar.startsWith("/uploads/avatars/")) {
      const avatarPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Avatar'ı null yap
    user.avatar = null;
    await user.save();

    res.json({
      success: true,
      message: "Avatar başarıyla silindi",
    });
  } catch (error) {
    console.error("Avatar delete error:", error);
    res.status(500).json({
      success: false,
      message: "Avatar silinirken hata oluştu",
    });
  }
};

module.exports = {
  uploadAvatar,
  deleteAvatar,
};
