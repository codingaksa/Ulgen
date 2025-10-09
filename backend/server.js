const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = createServer(app);

// Socket.IO setup
const corsOriginsRaw =
  process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = corsOriginsRaw
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ulgen")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/channels", require("./routes/channels"));
app.use("/api/servers", require("./routes/servers"));
app.use("/api/invites", require("./routes/invites"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Ulgen Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// Socket.IO connection handling
// Basic in-memory room-user map for presence (dev only)
const roomUsers = new Map(); // roomId -> Map(socketId -> { username, isMuted, isDeafened, isSpeaking })

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Join voice channel
  socket.on("join-channel", (channelId) => {
    try {
      if (!channelId) return;
      socket.join(channelId);
      if (!roomUsers.has(channelId)) roomUsers.set(channelId, new Map());
      // user-joined (username will be supplied by presence-update later)
      socket.to(channelId).emit("user-joined", { userId: socket.id });
    } catch {}
  });

  // Leave voice channel
  socket.on("leave-channel", (channelId) => {
    try {
      if (!channelId) return;
      socket.leave(channelId);
      socket.to(channelId).emit("user-left", { userId: socket.id });
      const map = roomUsers.get(channelId);
      if (map) map.delete(socket.id);
    } catch {}
  });

  // Presence update
  socket.on("presence-update", (payload) => {
    try {
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
    } catch {}
  });

  // Voice data transmission
  socket.on("voice-data", (data) => {
    try {
      const { channelId, audioData, sampleRate } = data || {};
      if (!channelId) return;
      socket.to(channelId).emit("voice-data", {
        userId: socket.id,
        audioData,
        sampleRate,
      });
    } catch {}
  });

  // User disconnect
  socket.on("disconnect", () => {
    try {
      for (const [roomId, map] of roomUsers.entries()) {
        if (map.has(socket.id)) {
          map.delete(socket.id);
          socket.to(roomId).emit("user-left", { userId: socket.id });
        }
      }
    } catch {}
    console.log("🔌 User disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});
