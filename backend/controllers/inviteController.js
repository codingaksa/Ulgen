// controllers/inviteController.js
const mongoose = require("mongoose");
const crypto = require("crypto");
const Invite = require("../models/Invite");
const Server = require("../models/Server");
const Channel = require("../models/Channel");
const { createInvite } = require("../services/inviteService");

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
const getRequesterId = (req) =>
  String((req?.user && (req.user._id || req.user.userId || req.user.id)) || "");
const isOwner = (server, uid) =>
  server?.owner &&
  (server.owner.equals?.(uid) || String(server.owner) === String(uid));

/**
 * POST /api/invites
 * body: { serverId, channelId?, inviteType? ('server'|'channel'), remainingUses?, expires?{minutes|hours|days} }
 * Only server owner
 */
const createInviteController = async (req, res) => {
  try {
    const requesterId = getRequesterId(req);
    const { serverId, channelId, inviteType, remainingUses, expires } =
      req.body || {};

    if (!isValidId(serverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid serverId" });
    }
    if (channelId && !isValidId(channelId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid channelId" });
    }

    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    if (!isOwner(server, requesterId)) {
      return res.status(403).json({
        success: false,
        message: "Only server owner can create invites",
      });
    }

    if (channelId) {
      const ch = await Channel.findOne({
        _id: channelId,
        server: server._id,
      }).select("_id");
      if (!ch)
        return res.status(404).json({
          success: false,
          message: "Channel not found in this server",
        });
    }

    const { rawToken, invite, url } = await createInvite({
      serverId: toId(serverId),
      channelId: channelId ? toId(channelId) : null,
      inviteType: inviteType || (channelId ? "channel" : "server"),
      remainingUses: typeof remainingUses === "number" ? remainingUses : 1,
      expires: expires || { days: 7 },
      createdBy: toId(requesterId),
    });

    return res.status(201).json({
      success: true,
      invite: invite.toPublic(),
      token: rawToken, // UI’de göstermek istiyorsan kullan
      url,
    });
  } catch (err) {
    console.error("Create invite error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create invite" });
  }
};

/**
 * GET /api/invites/info?token=RAW
 * Geçerlilik, scope, kalan kullanım bilgisi
 */
const getInviteInfo = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });

    const tokenHash = crypto
      .createHash("sha256")
      .update(String(token))
      .digest("hex");
    const invite = await Invite.findOne({ tokenHash }).lean();
    if (!invite)
      return res
        .status(404)
        .json({ success: false, message: "Invite not found" });

    const now = new Date();
    const notExpired = !invite.expiresAt || invite.expiresAt > now;
    const usable = invite.remainingUses === 0 || invite.remainingUses > 0;

    return res.json({
      success: true,
      invite: {
        id: String(invite._id),
        inviteType: invite.inviteType,
        serverId: String(invite.serverId),
        channelId: invite.channelId ? String(invite.channelId) : null,
        expiresAt: invite.expiresAt
          ? new Date(invite.expiresAt).toISOString()
          : null,
        remainingUses: invite.remainingUses,
        isExpired: !notExpired,
        canBeRedeemed: notExpired && usable,
      },
    });
  } catch (err) {
    console.error("Get invite info error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get invite info" });
  }
};

/**
 * POST /api/invites/redeem?token=RAW
 * Kullanıcıyı server/channel’a üye yapar (role: member).
 * Not: Invite.redeemByTokenRaw atomik kullanım düşürme yapar (unlimited=0 ise düşmez).
 */
const redeemInvite = async (req, res) => {
  try {
    const requesterId = getRequesterId(req);
    if (!isValidId(requesterId)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { token } = req.query;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });

    // 1) Atomik redeem (kullanım hakkı)
    const invite = await Invite.redeemByTokenRaw(token, {
      returnPublic: false,
    });
    if (!invite) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired invite" });
    }

    // 2) Server üyeliği (her iki tipte de garanti edelim)
    const server = await Server.findById(invite.serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const alreadyServer = server.members?.some(
      (m) => String(m.user) === String(requesterId)
    );
    if (!alreadyServer) {
      server.members.push({ user: toId(requesterId), role: "member" });
      await server.save();
    }

    // 3) Channel davetiyesi ise kanala da ekle
    if (invite.inviteType === "channel" && invite.channelId) {
      const channel = await Channel.findOne({
        _id: invite.channelId,
        server: invite.serverId,
      });
      if (!channel)
        return res
          .status(404)
          .json({ success: false, message: "Channel not found" });

      if (!channel.isMember(requesterId)) {
        try {
          channel.addMember(requesterId, "member"); // kapasite/aktiflik hatalarını method fırlatır
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: e.message || "Cannot join channel",
          });
        }
        await channel.save();
      }

      return res.json({
        success: true,
        message: "Joined to channel",
        scope: "channel",
        serverId: String(server._id),
        channelId: String(channel._id),
        remainingUses: invite.remainingUses,
      });
    }

    // 4) Server davetiyesi
    return res.json({
      success: true,
      message: "Joined to server",
      scope: "server",
      serverId: String(server._id),
      channelId: null,
      remainingUses: invite.remainingUses,
    });
  } catch (err) {
    console.error("Redeem invite error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to redeem invite" });
  }
};

/**
 * DELETE /api/invites/:id  (owner)
 * Davetiyeyi iptal (sil)
 */
const revokeInvite = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid invite id" });

    const invite = await Invite.findById(id);
    if (!invite)
      return res
        .status(404)
        .json({ success: false, message: "Invite not found" });

    const server = await Server.findById(invite.serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getRequesterId(req);
    if (!isOwner(server, requesterId)) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can revoke invites" });
    }

    await invite.deleteOne();
    return res.json({ success: true, message: "Invite revoked" });
  } catch (err) {
    console.error("Revoke invite error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to revoke invite" });
  }
};

module.exports = {
  createInviteController,
  getInviteInfo,
  redeemInvite,
  revokeInvite,
};
