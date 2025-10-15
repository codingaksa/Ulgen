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

// Basit (dev-only) presence
const roomUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 connected:", socket.id);

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

  socket.on("disconnect", () => {
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
