// routers/invites.js
const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Invite = require("../models/Invite");
const Server = require("../models/Server");
const Channel = require("../models/Channel");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const { Types } = mongoose;

const isValidId = (v) => {
  const str = String(v);
  // MongoDB ObjectId formatını kontrol et (24 karakter hex)
  if (Types.ObjectId.isValid(str)) return true;
  // Geliştirme aşamasında kısa ID'leri de kabul et
  if (process.env.NODE_ENV === "development" && str.length > 0) return true;
  return false;
};
const toId = (v) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));
const getUid = (req) =>
  String((req?.user && (req.user._id || req.user.id || req.user.userId)) || "");
const hashToken = (t) =>
  crypto.createHash("sha256").update(String(t)).digest("hex");

const resolveClientUrl = () => {
  const direct = process.env.CLIENT_URL || process.env.PUBLIC_CLIENT_URL;
  if (direct && direct.trim()) return direct.trim();
  const list = process.env.CLIENT_URLS;
  if (list && list.includes(",")) {
    const first = list.split(",")[0].trim();
    if (first) return first;
  }
  return "";
};

/* =========================
 * CREATE INVITE (owner only)
 * POST /api/invites
 * body: { serverId, channelId?, inviteType?('server'|'channel'), expiresInMs?, maxUses? (0 = unlimited) }
 * ========================= */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { serverId, channelId, inviteType, expiresInMs, maxUses } =
      req.body || {};
    if (!serverId || !isValidId(serverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid serverId" });
    }
    if (channelId && !isValidId(channelId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid channelId" });
    }

    const server = await Server.findById(serverId).select("owner _id");
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getUid(req);
    const isOwner =
      server.owner?.equals?.(requesterId) ||
      String(server.owner) === requesterId;
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only server owner can create invites",
      });
    }

    if (channelId) {
      const ch = await Channel.findOne({
        _id: toId(channelId),
        server: server._id,
      }).select("_id");
      if (!ch)
        return res.status(404).json({
          success: false,
          message: "Channel not found in this server",
        });
    }

    const token = crypto.randomBytes(24).toString("base64url"); // URL-safe
    const tokenHash = hashToken(token);

    const now = Date.now();
    const ttl = Number.isFinite(expiresInMs)
      ? Math.max(0, Number(expiresInMs))
      : 3 * 24 * 60 * 60 * 1000; // default 3 gün
    const expiresAt = ttl > 0 ? new Date(now + ttl) : null; // null => süresiz
    const remainingUses = Number.isFinite(maxUses)
      ? Math.max(0, Number(maxUses))
      : 1; // 0 => unlimited

    const doc = await Invite.create({
      tokenHash,
      serverId: toId(serverId),
      channelId: channelId ? toId(channelId) : null,
      inviteType: inviteType || (channelId ? "channel" : "server"),
      createdBy: toId(requesterId),
      expiresAt,
      remainingUses,
    });

    const clientUrl = resolveClientUrl();
    const urlHint = clientUrl
      ? `${clientUrl}/invite?token=${encodeURIComponent(token)}`
      : `/invite?token=${encodeURIComponent(token)}`;

    return res.status(201).json({
      success: true,
      token,
      invite: doc.toPublic(),
      urlHint,
    });
  } catch (e) {
    console.error("Create invite error:", e);
    return res
      .status(500)
      .json({ success: false, message: "failed_to_create" });
  }
});

/* =========================
 * LIST INVITES (owner only)
 * GET /api/invites?serverId=...
 * ========================= */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { serverId } = req.query || {};
    if (!serverId || !isValidId(serverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid serverId" });
    }

    const server = await Server.findById(serverId).select("owner _id");
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getUid(req);
    const isOwner =
      server.owner?.equals?.(requesterId) ||
      String(server.owner) === requesterId;
    if (!isOwner) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can list invites" });
    }

    const docs = await Invite.find(
      { serverId: toId(serverId) },
      { tokenHash: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      invites: docs.map((d) => ({
        id: String(d._id),
        inviteType: d.inviteType,
        serverId: String(d.serverId),
        channelId: d.channelId ? String(d.channelId) : null,
        createdAt: d.createdAt
          ? new Date(d.createdAt).getTime()
          : new Date().getTime(),
        expiresAt: d.expiresAt ? new Date(d.expiresAt).getTime() : null,
        remainingUses: d.remainingUses,
      })),
    });
  } catch (e) {
    console.error("List invites error:", e);
    return res.status(500).json({ success: false, message: "failed_to_list" });
  }
});

/* =========================
 * REVOKE INVITE (owner only)
 * DELETE /api/invites/:id
 * ========================= */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid invite id" });

    const inv = await Invite.findById(id);
    if (!inv)
      return res
        .status(404)
        .json({ success: false, message: "Invite not found" });

    const server = await Server.findById(inv.serverId).select("owner _id");
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getUid(req);
    const isOwner =
      server.owner?.equals?.(requesterId) ||
      String(server.owner) === requesterId;
    if (!isOwner) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can revoke invites" });
    }

    await inv.deleteOne();
    return res.json({ success: true });
  } catch (e) {
    console.error("Revoke invite error:", e);
    return res
      .status(500)
      .json({ success: false, message: "failed_to_revoke" });
  }
});

/* =========================
 * VERIFY INVITE (public)
 * GET /api/invites/:token
 * (sadece geçerlilik bilgisi döner; tüketmez)
 * ========================= */
router.get("/:token", async (req, res) => {
  try {
    const token = String(req.params.token || "");
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Token required" });

    const tokenHash = hashToken(token);
    const inv = await Invite.findOne({ tokenHash }).lean();
    if (!inv) return res.json({ success: true, valid: false });

    const now = Date.now();
    const notExpired =
      !inv.expiresAt || now < new Date(inv.expiresAt).getTime();
    const usable = inv.remainingUses === 0 || inv.remainingUses > 0;
    const valid = notExpired && usable;

    return res.json({
      success: true,
      valid,
      inviteType: valid ? inv.inviteType : undefined,
      serverId: valid ? String(inv.serverId) : undefined,
      channelId: valid && inv.channelId ? String(inv.channelId) : null,
      remainingUses: inv.remainingUses,
      expiresAt: inv.expiresAt ? new Date(inv.expiresAt).getTime() : null,
    });
  } catch (e) {
    console.error("Verify invite error:", e);
    return res
      .status(500)
      .json({ success: false, message: "failed_to_verify" });
  }
});

/* =========================
 * CONSUME INVITE (auth required)
 * POST /api/invites/:token/consume
 * - Kullanım hakkını atomik azaltır (unlimited: azaltmaz)
 * - server/channel üyeliği ekler
 * ========================= */
router.post("/:token/consume", authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const token = String(req.params.token || "");
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Token required" });

    const userId = getUid(req);
    if (!isValidId(userId))
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const tokenHash = hashToken(token);
    const now = new Date();

    await session.withTransaction(async () => {
      // ⚠️ ÖNEMLİ: iki ayrı $or yerine $and ile grupla
      const query = {
        tokenHash,
        $and: [
          { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
          { $or: [{ remainingUses: 0 }, { remainingUses: { $gt: 0 } }] },
        ],
      };

      // 1) Geçerli daveti bul ve (limited ise) 1 düşür (pipeline update)
      const invite = await Invite.findOneAndUpdate(
        query,
        [
          {
            $set: {
              remainingUses: {
                $cond: [
                  { $eq: ["$remainingUses", 0] },
                  0,
                  { $subtract: ["$remainingUses", 1] },
                ],
              },
              updatedAt: now,
            },
          },
        ],
        { new: true, session }
      );

      if (!invite) {
        throw new Error("INVALID_INVITE");
      }

      // 2) Server üyeliği ekle (yoksa)
      const server = await Server.findById(invite.serverId).session(session);
      if (!server) throw new Error("SERVER_NOT_FOUND");

      const alreadyServer = server.members?.some(
        (m) => String(m.user) === String(userId)
      );
      if (!alreadyServer) {
        server.members.push({ user: toId(userId), role: "member" });
        await server.save({ session });
      }

      // 3) Channel davetiyesi ise ilgili kanala da ekle (yoksa)
      if (invite.inviteType === "channel" && invite.channelId) {
        const channel = await Channel.findOne({
          _id: invite.channelId,
          server: invite.serverId,
        }).session(session);
        if (!channel) throw new Error("CHANNEL_NOT_FOUND");

        if (!channel.isMember(userId)) {
          channel.addMember(userId, "member"); // kapasite/aktiflik kontrolü model metodu yapıyor
          await channel.save({ session });
        }
      }

      // 4) Eğer kullanım hakkı sıfıra inmişse davetiyeyi sil (clean-up)
      // Not: unlimited (0) hiç düşmedi; buraya sadece limited ve 0'a inen gelir
      if (invite.remainingUses === 0) {
        await Invite.deleteOne({ _id: invite._id }, { session });
      }

      res.json({
        success: true,
        scope: invite.inviteType,
        serverId: String(invite.serverId),
        channelId: invite.channelId ? String(invite.channelId) : null,
      });
    });
  } catch (e) {
    console.error("Consume invite error:", e);
    if (e.message === "INVALID_INVITE") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired invite" });
    }
    if (e.message === "SERVER_NOT_FOUND" || e.message === "CHANNEL_NOT_FOUND") {
      return res.status(404).json({ success: false, message: e.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "failed_to_consume" });
  } finally {
    await session.endSession();
  }
});

module.exports = router;
