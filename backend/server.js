// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

/* ---------------- CORS / Origins ---------------- */
const corsOriginsRaw =
  process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173";

const allowedOrigins = corsOriginsRaw
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const vercelPreviewRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
const netlifyPreviewRegex = /^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.netlify\.app$/i;
const renderStaticRegex = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i;

function isOriginAllowed(origin) {
  if (!origin) return true; // non-browser veya same-origin
  if (allowedOrigins.includes(origin)) return true;
  if (vercelPreviewRegex.test(origin)) return true;
  if (netlifyPreviewRegex.test(origin)) return true;
  if (renderStaticRegex.test(origin)) return true;
  return false;
}

const corsOptions = {
  origin: (origin, cb) =>
    isOriginAllowed(origin)
      ? cb(null, true)
      : cb(new Error("Not allowed by CORS")),
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

/* ---------------- App Middleware ---------------- */
app.set("trust proxy", 1); // rate-limit ve gerçek IP için gerekli (proxy/CDN arkasında)

app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

app.use(cors(corsOptions));

// Güvenlik başlıkları (API için minimal CSP)
app.use(
  helmet({
    contentSecurityPolicy: false, // API'de genellikle gereksiz; frontend kendi CSP'sini uygular
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Sıkıştırma
app.use(compression());

// Body parsers
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static dosya servisi (upload edilen dosyalar için)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- Database ---------------- */
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ulgen";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exitCode = 1;
  });

mongoose.connection.on("error", (err) =>
  console.error("❌ MongoDB runtime error:", err)
);
mongoose.connection.on("disconnected", () =>
  console.warn("⚠️ MongoDB disconnected")
);

/* ---------------- Rate Limits ---------------- */
// Global (tüm API): 15 dakikada 1000 istek (CDN arkası için makul)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// Auth özel: 15 dakikada 20 istek (brute force’a karşı daha sıkı)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth requests, please try again later.",
  },
});

app.use("/api", globalLimiter);

/* ---------------- Routes ---------------- */
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/channels", require("./routes/channels"));
app.use("/api/servers", require("./routes/servers"));
app.use("/api/invites", require("./routes/invites"));
app.use("/api/avatar", require("./routes/avatar"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/friends", require("./routes/friends"));
app.use("/api/user-status", require("./routes/userStatus"));
app.use("/api/roles", require("./routes/roles"));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    message: "Ulgen Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

/* ---------------- Socket.IO ---------------- */
const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) =>
      isOriginAllowed(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS")),
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Basit (dev-only) presence
const roomUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 connected:", socket.id, "user:", socket.userId);

  socket.on("join-channel", (channelId) => {
    if (!channelId) return;
    socket.join(channelId);
    if (!roomUsers.has(channelId)) roomUsers.set(channelId, new Map());
    socket.to(channelId).emit("user-joined", { userId: socket.id });
  });

  socket.on("leave-channel", (channelId) => {
    if (!channelId) return;
    socket.leave(channelId);
    socket.to(channelId).emit("user-left", { userId: socket.id });
    const map = roomUsers.get(channelId);
    if (map) map.delete(socket.id);
    if (map && map.size === 0) roomUsers.delete(channelId);
  });

  // Read-only room state for UI sidebars without joining the voice room
  // Client calls with an acknowledgement callback: socket.emit('get-room-state', channelId, (state) => { ... })
  socket.on("get-room-state", (channelId, ack) => {
    try {
      if (typeof ack !== "function") return;
      if (!channelId) return ack({ users: [] });
      const map = roomUsers.get(channelId);
      const users = map
        ? Array.from(map.entries()).map(([sid, data]) => ({
            userId: sid,
            username: data?.username,
            isMuted: !!data?.isMuted,
            isDeafened: !!data?.isDeafened,
            isSpeaking: !!data?.isSpeaking,
          }))
        : [];
      ack({ users });
    } catch (e) {
      try {
        if (typeof ack === "function") ack({ users: [] });
      } catch {}
    }
  });

  socket.on("presence-update", (payload) => {
    const { channelId, username, isMuted, isDeafened, isSpeaking } =
      payload || {};
    if (!channelId) return;
    if (!roomUsers.has(channelId)) roomUsers.set(channelId, new Map());
    const map = roomUsers.get(channelId);
    map.set(socket.id, { username, isMuted, isDeafened, isSpeaking });
    socket.to(channelId).emit("presence-update", {
      userId: socket.id,
      username,
      isMuted,
      isDeafened,
      isSpeaking,
    });
  });

  socket.on("voice-data", (data) => {
    const { channelId, audioData, sampleRate } = data || {};
    if (!channelId) return;
    socket.to(channelId).emit("voice-data", {
      userId: socket.id,
      audioData,
      sampleRate,
    });
  });

  // Mesajlaşma sistemi
  socket.on("send-message", async (data) => {
    const { channelId, message, username, userId } = data || {};
    if (!channelId || !message || !username) return;

    try {
      // Veritabanına mesajı kaydet
      const Message = require("./models/Message");
      const Channel = require("./models/Channel");

      // Kanal bilgilerini al
      const channel = await Channel.findById(channelId).populate("server");
      if (!channel) return;

      // Mesajı veritabanına kaydet
      const savedMessage = new Message({
        channelId,
        serverId: channel.server._id,
        userId: userId || socket.id,
        username,
        content: message.trim(),
        messageType: "text",
      });

      await savedMessage.save();

      // Populate ile tam bilgileri al
      const populatedMessage = await Message.findById(
        savedMessage._id
      ).populate("userId", "username avatar");

      const messageData = {
        id: populatedMessage._id.toString(),
        userId: populatedMessage.userId._id.toString(),
        username: populatedMessage.username,
        content: populatedMessage.content,
        timestamp: populatedMessage.formattedTime,
        avatar: populatedMessage.userId.avatar,
      };

      // Tüm kanal üyelerine mesajı gönder
      socket.to(channelId).emit("new-message", messageData);
      // Gönderen kişiye de mesajı geri gönder (kendi mesajını görmesi için)
      socket.emit("new-message", messageData);
    } catch (error) {
      console.error("Message save error:", error);
      // Hata durumunda eski yöntemle devam et
      const messageData = {
        id: Date.now().toString(),
        userId: userId || socket.id,
        username,
        content: message,
        timestamp: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.to(channelId).emit("new-message", messageData);
      socket.emit("new-message", messageData);
    }
  });

  // Kanal üyelerini al
  socket.on("get-channel-members", (channelId, ack) => {
    try {
      if (typeof ack !== "function") return;
      if (!channelId) return ack({ members: [] });

      const map = roomUsers.get(channelId);
      const members = map
        ? Array.from(map.entries()).map(([sid, data]) => ({
            userId: sid,
            username: data?.username || `Kullanıcı ${sid.slice(0, 4)}`,
            isOnline: true,
            lastSeen: new Date().toISOString(),
          }))
        : [];

      ack({ members });
    } catch (e) {
      try {
        if (typeof ack === "function") ack({ members: [] });
      } catch {}
    }
  });

  // Sunucu üyelerini al (gerçek kullanıcılar)
  socket.on("get-server-members", async (serverId, ack) => {
    try {
      if (typeof ack !== "function") return;
      if (!serverId) return ack({ members: [] });

      const Server = require("./models/Server");
      const server = await Server.findById(serverId).populate(
        "members.user",
        "username email avatar isOnline lastSeen"
      );

      if (!server) return ack({ members: [] });

      const members = server.members
        .filter((member) => member.user && member.user._id) // null user'ları filtrele
        .map((member) => ({
          userId: member.user._id.toString(),
          username: member.user.username,
          email: member.user.email,
          avatar: member.user.avatar,
          role: member.role,
          isOnline: member.user.isOnline,
          lastSeen: member.user.lastSeen,
          joinedAt: member.joinedAt,
        }));

      ack({ members });
    } catch (e) {
      console.error("Error getting server members:", e);
      try {
        if (typeof ack === "function") ack({ members: [] });
      } catch {}
    }
  });

  // Arkadaş ekleme sistemi
  socket.on("send-friend-request", async (data, ack) => {
    try {
      if (typeof ack !== "function") return;
      const { fromUserId, toUserId, fromUsername } = data || {};

      if (!fromUserId || !toUserId || !fromUsername) {
        return ack({ success: false, message: "Eksik bilgi" });
      }

      // Gerçek uygulamada burada veritabanına arkadaşlık isteği kaydedilir
      // Şimdilik sadece hedef kullanıcıya bildirim gönderelim

      // Hedef kullanıcının socket'ini bul (gerçek uygulamada kullanıcı ID'si ile eşleştirme yapılır)
      const targetSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.id === toUserId
      ); // Bu geçici, gerçek uygulamada kullanıcı ID mapping'i olmalı

      if (targetSocket) {
        targetSocket.emit("friend-request-received", {
          fromUserId,
          fromUsername,
          timestamp: new Date().toISOString(),
        });
      }

      ack({ success: true, message: "Arkadaşlık isteği gönderildi" });
    } catch (e) {
      console.error("Error sending friend request:", e);
      try {
        if (typeof ack === "function")
          ack({ success: false, message: "Hata oluştu" });
      } catch {}
    }
  });

  // Gerçek zamanlı ayarlar sistemi
  socket.on("update-user-settings", (data) => {
    const { userId, username, settings, channelId } = data || {};
    if (!userId || !username || !settings) return;

    // Aynı kanaldaki tüm kullanıcılara ayar güncellemesini bildir
    if (channelId) {
      socket.to(channelId).emit("user-settings-updated", {
        userId,
        username,
        settings,
        timestamp: new Date().toISOString(),
      });
    }

    // Kullanıcının kendi ayarlarını da güncelle
    socket.emit("user-settings-updated", {
      userId,
      username,
      settings,
      timestamp: new Date().toISOString(),
    });
  });

  // Kullanıcı durumu güncelleme (online/away/dnd/offline)
  socket.on("update-user-status", (data) => {
    const { userId, username, status, channelId } = data || {};
    if (!userId || !username || !status) return;

    // Aynı kanaldaki tüm kullanıcılara durum güncellemesini bildir
    if (channelId) {
      socket.to(channelId).emit("user-status-updated", {
        userId,
        username,
        status,
        timestamp: new Date().toISOString(),
      });
    }

    // Kullanıcının kendi durumunu da güncelle
    socket.emit("user-status-updated", {
      userId,
      username,
      status,
      timestamp: new Date().toISOString(),
    });
  });

  // Ses/video ayarları güncelleme
  socket.on("update-audio-video-settings", (data) => {
    const { userId, username, audioSettings, videoSettings, channelId } =
      data || {};
    if (!userId || !username) return;

    const settings = {
      audio: audioSettings || {},
      video: videoSettings || {},
    };

    // Aynı kanaldaki tüm kullanıcılara ayar güncellemesini bildir
    if (channelId) {
      socket.to(channelId).emit("audio-video-settings-updated", {
        userId,
        username,
        settings,
        timestamp: new Date().toISOString(),
      });
    }

    // Kullanıcının kendi ayarlarını da güncelle
    socket.emit("audio-video-settings-updated", {
      userId,
      username,
      settings,
      timestamp: new Date().toISOString(),
    });
  });

  // User Status Events
  socket.on("set-status", async (data) => {
    try {
      const { status, customStatus } = data || {};
      const userId = socket.userId; // JWT'den gelen user ID
      
      if (!userId) return;

      const User = require("./models/User");
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

      if (user) {
        // Tüm kullanıcılara durum güncellemesini bildir
        socket.broadcast.emit("user-status-updated", {
          userId: user._id,
          username: user.username,
          status: user.status,
          customStatus: user.customStatus,
          lastSeen: user.lastSeen,
        });
      }
    } catch (error) {
      console.error("Set status error:", error);
    }
  });

  socket.on("get-online-users", async () => {
    try {
      const User = require("./models/User");
      const onlineUsers = await User.find(
        { isOnline: true },
        "username status customStatus lastSeen"
      ).sort({ lastSeen: -1 });

      const formattedUsers = onlineUsers.map(user => ({
        userId: user._id,
        username: user.username,
        status: user.status,
        customStatus: user.customStatus,
        lastSeen: user.lastSeen,
      }));

      socket.emit("online-users", formattedUsers);
    } catch (error) {
      console.error("Get online users error:", error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      // Kullanıcıyı offline yap
      const userId = socket.userId;
      if (userId) {
        const User = require("./models/User");
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          status: "offline",
          lastSeen: new Date(),
        });

        // Diğer kullanıcılara bildir
        socket.broadcast.emit("user-offline", userId);
      }
    } catch (error) {
      console.error("Disconnect status update error:", error);
    }

    for (const [roomId, map] of roomUsers.entries()) {
      if (map.has(socket.id)) {
        map.delete(socket.id);
        socket.to(roomId).emit("user-left", { userId: socket.id });
      }
      if (map.size === 0) roomUsers.delete(roomId);
    }
    console.log("🔌 disconnected:", socket.id);
  });
});

/* ---------------- Error & 404 ---------------- */
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err.stack || err);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? String(err.message || err)
        : "Internal server error",
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ---------------- Server start & Graceful shutdown ---------------- */
const PORT = Number(process.env.PORT || 5000);

const listener = httpServer.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log("📡 Socket.IO up");
  console.log(`🌐 NODE_ENV: ${process.env.NODE_ENV || "development"}`);
});

async function shutdown(signal) {
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
  try {
    await new Promise((resolve) => listener.close(resolve));
    await mongoose.connection.close();
    io.close();
    console.log("✅ Clean shutdown complete.");
    process.exit(0);
  } catch (e) {
    console.error("❌ Error during shutdown:", e);
    process.exit(1);
  }
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = { app, io };
