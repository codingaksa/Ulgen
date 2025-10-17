// middleware/upload.js
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Upload klasörünü oluştur
const uploadDir = path.join(__dirname, "../uploads/avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer konfigürasyonu
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Sadece resim dosyalarına izin ver
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Sadece resim dosyaları yüklenebilir!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Resim işleme middleware'i
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const filename = `avatar-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Resmi işle: 200x200 boyutunda, WebP formatında
    await sharp(req.file.buffer)
      .resize(200, 200, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    // Dosya yolunu req'e ekle
    req.processedImage = {
      filename: filename,
      path: filepath,
      url: `/uploads/avatars/${filename}`,
    };

    next();
  } catch (error) {
    console.error("Resim işleme hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Resim işlenirken hata oluştu",
    });
  }
};

module.exports = {
  upload: upload.single("avatar"),
  processImage,
};
