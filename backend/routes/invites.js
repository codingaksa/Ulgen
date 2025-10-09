const express = require("express");
const crypto = require("crypto");
const Invite = require("../models/Invite");
const Server = require("../models/Server");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Create invite
router.post("/", authenticateToken, async (req, res) => {
  const { serverId, expiresInMs, maxUses } = req.body || {};
  if (!serverId) return res.status(400).json({ error: "serverId required" });
  try {
    // Ensure requester is member (preferably owner) of server
    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ error: "server_not_found" });
    const requesterId = String(
      (req.user && (req.user._id || req.user.id)) || ""
    );
    const isOwner = String(server.owner) === requesterId;
    const isMember = server.members.some((m) => String(m.user) === requesterId);
    if (!isOwner && !isMember)
      return res.status(403).json({ error: "forbidden" });

    const token = crypto.randomBytes(24).toString("base64url");
    const tokenHash = hashToken(token);
    const now = Date.now();
    const expiresAt = new Date(
      now +
        (Number.isFinite(expiresInMs)
          ? Math.max(0, Number(expiresInMs))
          : 3 * 24 * 60 * 60 * 1000)
    );
    const remainingUses = Number.isFinite(maxUses)
      ? Math.max(0, Number(maxUses))
      : 1;

    await Invite.create({
      tokenHash,
      serverId,
      createdAt: new Date(now),
      expiresAt,
      remainingUses,
    });
    return res.json({
      token,
      expiresAt: expiresAt.getTime(),
      maxUses: remainingUses,
    });
  } catch (e) {
    return res.status(500).json({ error: "failed_to_create" });
  }
});

// List invites
router.get("/", authenticateToken, async (req, res) => {
  const { serverId } = req.query || {};
  if (!serverId || typeof serverId !== "string")
    return res.status(400).json({ error: "serverId required" });
  try {
    const docs = await Invite.find({ serverId }, { tokenHash: 0 })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({
      invites: docs.map((d) => ({
        id: d._id,
        serverId: d.serverId,
        createdAt: new Date(d.createdAt).getTime(),
        expiresAt: d.expiresAt ? new Date(d.expiresAt).getTime() : null,
        remainingUses: d.remainingUses,
      })),
    });
  } catch (e) {
    return res.status(500).json({ error: "failed_to_list" });
  }
});

// Revoke invite by id
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const del = await Invite.deleteOne({ _id: id });
    return res.json({ ok: del.deletedCount > 0 });
  } catch (e) {
    return res.status(500).json({ error: "failed_to_revoke" });
  }
});

// Verify invite (does not consume)
router.get("/:token", async (req, res) => {
  const token = req.params.token;
  const tokenHash = hashToken(token);
  try {
    const inv = await Invite.findOne({ tokenHash }).lean();
    if (!inv) return res.json({ valid: false });
    const now = Date.now();
    const valid =
      now < new Date(inv.expiresAt).getTime() &&
      (inv.remainingUses === 0 || inv.remainingUses > 0);
    return res.json({
      valid,
      serverId: valid ? inv.serverId : undefined,
      remainingUses: inv.remainingUses,
      expiresAt: new Date(inv.expiresAt).getTime(),
    });
  } catch {
    return res.status(500).json({ error: "failed_to_verify" });
  }
});

// Consume invite (atomic): also auto-join server
router.post("/:token/consume", authenticateToken, async (req, res) => {
  const token = req.params.token;
  const tokenHash = hashToken(token);
  try {
    const now = new Date();
    const updated = await Invite.findOneAndUpdate(
      {
        tokenHash,
        expiresAt: { $gt: now },
        $or: [{ remainingUses: 0 }, { remainingUses: { $gt: 0 } }],
      },
      { $inc: { remainingUses: 0 } }, // we will decrement manually after joining if finite
      { new: true }
    );
    if (!updated) return res.json({ valid: false });

    // Ensure membership
    const server = await Server.findById(updated.serverId);
    if (!server) return res.json({ valid: false });
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ valid: false });
    const already = server.members.some(
      (m) => String(m.user) === String(userId)
    );
    if (!already) server.members.push({ user: userId, role: "member" });
    await server.save();

    // Decrement remainingUses if finite, and delete if reached 0
    if (
      typeof updated.remainingUses === "number" &&
      updated.remainingUses > 0
    ) {
      const next = updated.remainingUses - 1;
      if (next <= 0) await Invite.deleteOne({ _id: updated._id });
      else
        await Invite.updateOne(
          { _id: updated._id },
          { $set: { remainingUses: next } }
        );
    }

    return res.json({ valid: true, serverId: updated.serverId });
  } catch (e) {
    return res.status(500).json({ error: "failed_to_consume" });
  }
});

module.exports = router;
