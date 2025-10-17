// controllers/fileController.js
const Message = require('../models/Message');
const Channel = require('../models/Channel');
const Server = require('../models/Server');
const fs = require('fs');
const path = require('path');

// @desc Upload file to message
// @route POST /api/files/upload
// @access Private
const uploadFile = async (req, res) => {
  try {
    if (!req.processedFile) {
      return res.status(400).json({
        success: false,
        message: 'Dosya bulunamadı'
      });
    }

    const { channelId, messageType = 'file' } = req.body;

    if (!channelId) {
      // Dosyayı sil çünkü mesaj gönderilmeyecek
      if (req.processedFile.path && fs.existsSync(req.processedFile.path)) {
        fs.unlinkSync(req.processedFile.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Kanal ID gerekli'
      });
    }

    // Kanalı ve sunucuyu kontrol et
    const channel = await Channel.findById(channelId).populate('server');
    if (!channel) {
      // Dosyayı sil
      if (req.processedFile.path && fs.existsSync(req.processedFile.path)) {
        fs.unlinkSync(req.processedFile.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Kanal bulunamadı'
      });
    }

    // Kullanıcının bu sunucuda üye olup olmadığını kontrol et
    const server = await Server.findById(channel.server._id);
    const isMember = server.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      // Dosyayı sil
      if (req.processedFile.path && fs.existsSync(req.processedFile.path)) {
        fs.unlinkSync(req.processedFile.path);
      }
      return res.status(403).json({
        success: false,
        message: 'Bu kanala dosya gönderme yetkiniz yok'
      });
    }

    // Dosya bilgilerini döndür
    res.json({
      success: true,
      file: {
        filename: req.processedFile.filename,
        originalName: req.processedFile.originalName,
        url: req.processedFile.url,
        mimeType: req.processedFile.mimeType,
        size: req.processedFile.size
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    
    // Hata durumunda dosyayı sil
    if (req.processedFile && req.processedFile.path && fs.existsSync(req.processedFile.path)) {
      try {
        fs.unlinkSync(req.processedFile.path);
      } catch (deleteError) {
        console.error('Error deleting file:', deleteError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Dosya yüklenirken hata oluştu'
    });
  }
};

// @desc Delete file
// @route DELETE /api/files/:filename
// @access Private
const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Dosya adı gerekli'
      });
    }

    // Dosya yollarını kontrol et
    const possiblePaths = [
      path.join(__dirname, '../uploads/files', filename),
      path.join(__dirname, '../uploads/images', filename),
      path.join(__dirname, '../uploads/avatars', filename)
    ];

    let fileDeleted = false;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        fileDeleted = true;
        break;
      }
    }

    if (!fileDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Dosya bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Dosya başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Dosya silinirken hata oluştu'
    });
  }
};

module.exports = {
  uploadFile,
  deleteFile
};
