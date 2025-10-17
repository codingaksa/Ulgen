// controllers/messageController.js
const Message = require("../models/Message");
const Channel = require("../models/Channel");
const Server = require("../models/Server");

// @desc Get messages for a channel
// @route GET /api/messages/:channelId
// @access Private
const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Kullanıcının bu kanala erişimi var mı kontrol et
    const channel = await Channel.findById(channelId).populate("server");
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Kanal bulunamadı",
      });
    }

    // Kullanıcının bu sunucuda üye olup olmadığını kontrol et
    const server = await Server.findById(channel.server._id);
    const isMember = server.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Bu kanala erişim yetkiniz yok",
      });
    }

    // Mesajları getir
    const messages = await Message.find({
      channelId: channelId,
      deleted: false,
    })
      .populate("userId", "username avatar")
      .populate("mentions", "username")
      .populate("replyTo", "content username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Toplam mesaj sayısını al
    const total = await Message.countDocuments({
      channelId: channelId,
      deleted: false,
    });

    res.json({
      success: true,
      messages: messages.reverse(), // En eski mesajlar önce gelsin
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Mesajlar yüklenirken hata oluştu",
    });
  }
};

// @desc Create a new message
// @route POST /api/messages
// @access Private
const createMessage = async (req, res) => {
  try {
    const { channelId, content, messageType = "text", replyTo } = req.body;

    if (!channelId || !content) {
      return res.status(400).json({
        success: false,
        message: "Kanal ID ve mesaj içeriği gerekli",
      });
    }

    // Kanalı ve sunucuyu kontrol et
    const channel = await Channel.findById(channelId).populate("server");
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Kanal bulunamadı",
      });
    }

    // Kullanıcının bu sunucuda üye olup olmadığını kontrol et
    const server = await Server.findById(channel.server._id);
    const isMember = server.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Bu kanala mesaj gönderme yetkiniz yok",
      });
    }

    // Mesajı oluştur
    const message = new Message({
      channelId,
      serverId: channel.server._id,
      userId: req.user._id,
      username: req.user.username,
      content: content.trim(),
      messageType,
      replyTo: replyTo || null,
    });

    await message.save();

    // Populate ile tam bilgileri al
    const populatedMessage = await Message.findById(message._id)
      .populate("userId", "username avatar")
      .populate("mentions", "username")
      .populate("replyTo", "content username");

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({
      success: false,
      message: "Mesaj gönderilirken hata oluştu",
    });
  }
};

// @desc Edit a message
// @route PUT /api/messages/:messageId
// @access Private
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Mesaj içeriği gerekli",
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mesaj bulunamadı",
      });
    }

    // Sadece mesaj sahibi düzenleyebilir
    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bu mesajı düzenleme yetkiniz yok",
      });
    }

    // Mesajı güncelle
    message.content = content.trim();
    message.edited = true;
    message.editedAt = new Date();

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("userId", "username avatar")
      .populate("mentions", "username")
      .populate("replyTo", "content username");

    res.json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Edit message error:", error);
    res.status(500).json({
      success: false,
      message: "Mesaj düzenlenirken hata oluştu",
    });
  }
};

// @desc Delete a message
// @route DELETE /api/messages/:messageId
// @access Private
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mesaj bulunamadı",
      });
    }

    // Mesaj sahibi veya sunucu admini silebilir
    const channel = await Channel.findById(message.channelId).populate(
      "server"
    );
    const server = await Server.findById(channel.server._id);

    const isOwner = message.userId.toString() === req.user._id.toString();
    const isAdmin = server.members.some(
      (member) =>
        member.user.toString() === req.user._id.toString() &&
        (member.role === "admin" || member.role === "owner")
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Bu mesajı silme yetkiniz yok",
      });
    }

    // Mesajı soft delete yap
    message.deleted = true;
    message.deletedAt = new Date();
    message.content = "Bu mesaj silindi";

    await message.save();

    res.json({
      success: true,
      message: "Mesaj başarıyla silindi",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Mesaj silinirken hata oluştu",
    });
  }
};

// @desc Add reaction to a message
// @route POST /api/messages/:messageId/reactions
// @access Private
const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: "Emoji gerekli",
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mesaj bulunamadı",
      });
    }

    // Kullanıcının bu kanala erişimi var mı kontrol et
    const channel = await Channel.findById(message.channelId).populate(
      "server"
    );
    const server = await Server.findById(channel.server._id);
    const isMember = server.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Bu kanala erişim yetkiniz yok",
      });
    }

    // Aynı emoji'yi daha önce eklemiş mi kontrol et
    const existingReaction = message.reactions.find(
      (reaction) =>
        reaction.emoji === emoji &&
        reaction.userId.toString() === req.user._id.toString()
    );

    if (existingReaction) {
      return res.status(400).json({
        success: false,
        message: "Bu emoji'yi zaten eklemişsiniz",
      });
    }

    // Reaction ekle
    message.reactions.push({
      emoji,
      userId: req.user._id,
      username: req.user.username,
    });

    await message.save();

    res.json({
      success: true,
      message: "Reaction eklendi",
      reactions: message.reactions,
    });
  } catch (error) {
    console.error("Add reaction error:", error);
    res.status(500).json({
      success: false,
      message: "Reaction eklenirken hata oluştu",
    });
  }
};

// @desc Remove reaction from a message
// @route DELETE /api/messages/:messageId/reactions/:reactionId
// @access Private
const removeReaction = async (req, res) => {
  try {
    const { messageId, reactionId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mesaj bulunamadı",
      });
    }

    // Reaction'ı bul
    const reactionIndex = message.reactions.findIndex(
      (reaction) =>
        reaction._id.toString() === reactionId &&
        reaction.userId.toString() === req.user._id.toString()
    );

    if (reactionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Reaction bulunamadı",
      });
    }

    // Reaction'ı sil
    message.reactions.splice(reactionIndex, 1);
    await message.save();

    res.json({
      success: true,
      message: "Reaction silindi",
      reactions: message.reactions,
    });
  } catch (error) {
    console.error("Remove reaction error:", error);
    res.status(500).json({
      success: false,
      message: "Reaction silinirken hata oluştu",
    });
  }
};

// @desc Search messages
// @route GET /api/messages/search
// @access Private
const searchMessages = async (req, res) => {
  try {
    const { q, channelId, serverId, userId, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Arama terimi gerekli",
      });
    }

    // Arama kriterleri
    const searchCriteria = {
      content: { $regex: q, $options: "i" },
      deleted: false,
    };

    // Kanal ID varsa ekle
    if (channelId) {
      searchCriteria.channelId = channelId;
    }

    // Sunucu ID varsa ekle
    if (serverId) {
      searchCriteria.serverId = serverId;
    }

    // Kullanıcı ID varsa ekle
    if (userId) {
      searchCriteria.userId = userId;
    }

    // Kullanıcının erişebileceği kanalları kontrol et
    if (channelId) {
      const channel = await Channel.findById(channelId).populate("server");
      if (channel) {
        const server = await Server.findById(channel.server._id);
        const isMember = server.members.some(
          (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
          return res.status(403).json({
            success: false,
            message: "Bu kanala erişim yetkiniz yok",
          });
        }
      }
    }

    // Mesajları ara
    const messages = await Message.find(searchCriteria)
      .populate("userId", "username avatar")
      .populate("mentions", "username")
      .populate("replyTo", "content username")
      .populate("channelId", "name")
      .populate("serverId", "name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      messages,
      query: q,
    });
  } catch (error) {
    console.error("Search messages error:", error);
    res.status(500).json({
      success: false,
      message: "Mesaj arama sırasında hata oluştu",
    });
  }
};

// @desc Get message by ID
// @route GET /api/messages/:messageId
// @access Private
const getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId)
      .populate("userId", "username avatar")
      .populate("mentions", "username")
      .populate("replyTo", "content username")
      .populate("channelId", "name")
      .populate("serverId", "name");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mesaj bulunamadı",
      });
    }

    // Kullanıcının bu kanala erişimi var mı kontrol et
    const channel = await Channel.findById(message.channelId).populate(
      "server"
    );
    const server = await Server.findById(channel.server._id);
    const isMember = server.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Bu kanala erişim yetkiniz yok",
      });
    }

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Get message by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Mesaj yüklenirken hata oluştu",
    });
  }
};

module.exports = {
  getMessages,
  createMessage,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  searchMessages,
  getMessageById,
};
