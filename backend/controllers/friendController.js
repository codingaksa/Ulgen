// controllers/friendController.js
const Friend = require("../models/Friend");
const User = require("../models/User");

// @desc Send friend request
// @route POST /api/friends/request
// @access Private
const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: "Alıcı ID gerekli",
      });
    }

    if (requesterId.toString() === recipientId) {
      return res.status(400).json({
        success: false,
        message: "Kendinizi arkadaş olarak ekleyemezsiniz",
      });
    }

    // Alıcı kullanıcı var mı kontrol et
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Zaten arkadaşlık isteği var mı kontrol et
    const existingRequest = await Friend.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({
          success: false,
          message: "Zaten bekleyen bir arkadaşlık isteği var",
        });
      } else if (existingRequest.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "Bu kullanıcı zaten arkadaşınız",
        });
      } else if (existingRequest.status === "blocked") {
        return res.status(400).json({
          success: false,
          message: "Bu kullanıcı engellenmiş",
        });
      }
    }

    // Arkadaşlık isteği oluştur
    const friendRequest = new Friend({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    await friendRequest.save();

    // Populate ile tam bilgileri al
    const populatedRequest = await Friend.findById(friendRequest._id)
      .populate("requester", "username avatar")
      .populate("recipient", "username avatar");

    res.status(201).json({
      success: true,
      message: "Arkadaşlık isteği gönderildi",
      friendRequest: populatedRequest,
    });
  } catch (error) {
    console.error("Send friend request error:", error);
    res.status(500).json({
      success: false,
      message: "Arkadaşlık isteği gönderilirken hata oluştu",
    });
  }
};

// @desc Accept friend request
// @route PUT /api/friends/accept/:requestId
// @access Private
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const friendRequest = await Friend.findById(requestId)
      .populate("requester", "username avatar")
      .populate("recipient", "username avatar");

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Arkadaşlık isteği bulunamadı",
      });
    }

    // Sadece alıcı kabul edebilir
    if (friendRequest.recipient._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bu isteği kabul etme yetkiniz yok",
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Bu istek zaten işlenmiş",
      });
    }

    // İsteği kabul et
    friendRequest.status = "accepted";
    friendRequest.acceptedAt = new Date();
    await friendRequest.save();

    res.json({
      success: true,
      message: "Arkadaşlık isteği kabul edildi",
      friendRequest,
    });
  } catch (error) {
    console.error("Accept friend request error:", error);
    res.status(500).json({
      success: false,
      message: "Arkadaşlık isteği kabul edilirken hata oluştu",
    });
  }
};

// @desc Reject friend request
// @route DELETE /api/friends/reject/:requestId
// @access Private
const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Arkadaşlık isteği bulunamadı",
      });
    }

    // Sadece alıcı reddedebilir
    if (friendRequest.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bu isteği reddetme yetkiniz yok",
      });
    }

    // İsteği sil
    await Friend.findByIdAndDelete(requestId);

    res.json({
      success: true,
      message: "Arkadaşlık isteği reddedildi",
    });
  } catch (error) {
    console.error("Reject friend request error:", error);
    res.status(500).json({
      success: false,
      message: "Arkadaşlık isteği reddedilirken hata oluştu",
    });
  }
};

// @desc Remove friend
// @route DELETE /api/friends/remove/:friendId
// @access Private
const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const friendship = await Friend.findOne({
      _id: friendId,
      status: "accepted",
      $or: [{ requester: userId }, { recipient: userId }],
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: "Arkadaşlık bulunamadı",
      });
    }

    // Arkadaşlığı sil
    await Friend.findByIdAndDelete(friendId);

    res.json({
      success: true,
      message: "Arkadaşlık kaldırıldı",
    });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(500).json({
      success: false,
      message: "Arkadaşlık kaldırılırken hata oluştu",
    });
  }
};

// @desc Get friend requests
// @route GET /api/friends/requests
// @access Private
const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friend.find({
      recipient: userId,
      status: "pending",
    })
      .populate("requester", "username avatar email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get friend requests error:", error);
    res.status(500).json({
      success: false,
      message: "Arkadaşlık istekleri yüklenirken hata oluştu",
    });
  }
};

// @desc Get friends list
// @route GET /api/friends
// @access Private
const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await Friend.find({
      status: "accepted",
      $or: [{ requester: userId }, { recipient: userId }],
    })
      .populate("requester", "username avatar email isOnline lastSeen")
      .populate("recipient", "username avatar email isOnline lastSeen")
      .sort({ acceptedAt: -1 });

    // Arkadaşları formatla (kullanıcının kendisi değil, diğer kişiyi al)
    const formattedFriends = friends.map((friendship) => {
      const friend =
        friendship.requester._id.toString() === userId.toString()
          ? friendship.recipient
          : friendship.requester;

      return {
        _id: friendship._id,
        friend: friend,
        acceptedAt: friendship.acceptedAt,
      };
    });

    res.json({
      success: true,
      friends: formattedFriends,
    });
  } catch (error) {
    console.error("Get friends error:", error);
    res.status(500).json({
      success: false,
      message: "Arkadaş listesi yüklenirken hata oluştu",
    });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendRequests,
  getFriends,
};
