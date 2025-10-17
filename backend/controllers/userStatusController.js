const User = require("../models/User");

// Kullanıcı durumunu güncelle
const updateUserStatus = async (req, res) => {
  try {
    const { status, customStatus } = req.body;
    const userId = req.user.id;

    // Geçerli durum kontrolü
    const validStatuses = ["online", "away", "dnd", "offline"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz durum. Geçerli durumlar: online, away, dnd, offline",
      });
    }

    // Kullanıcıyı güncelle
    const user = await User.findByIdAndUpdate(
      userId,
      {
        status,
        customStatus: customStatus || null,
        isOnline: status !== "offline",
        lastSeen: new Date(),
      },
      { new: true, select: "username status customStatus isOnline lastSeen" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Kullanıcı durumu güncellendi",
      user: {
        userId: user._id,
        username: user.username,
        status: user.status,
        customStatus: user.customStatus,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error("User status update error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// Çevrimiçi kullanıcıları getir
const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await User.find(
      { isOnline: true },
      "username status customStatus lastSeen"
    ).sort({ lastSeen: -1 });

    const formattedUsers = onlineUsers.map((user) => ({
      userId: user._id,
      username: user.username,
      status: user.status,
      customStatus: user.customStatus,
      lastSeen: user.lastSeen,
    }));

    res.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Get online users error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

// Kullanıcı durumunu getir
const getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(
      userId,
      "username status customStatus isOnline lastSeen"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    res.json({
      success: true,
      user: {
        userId: user._id,
        username: user.username,
        status: user.status,
        customStatus: user.customStatus,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error("Get user status error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};

module.exports = {
  updateUserStatus,
  getOnlineUsers,
  getUserStatus,
};
