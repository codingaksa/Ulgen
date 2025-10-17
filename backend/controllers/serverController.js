// controllers/serverController.js
const mongoose = require("mongoose");
const Server = require("../models/Server");
const Channel = require("../models/Channel");

const { Types } = mongoose;
const toId = (v) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));
const isValidId = (v) => {
  const str = String(v);
  // MongoDB ObjectId formatını kontrol et (24 karakter hex)
  if (Types.ObjectId.isValid(str)) return true;
  // Geliştirme aşamasında kısa ID'leri de kabul et
  if (process.env.NODE_ENV === "development" && str.length > 0) return true;
  return false;
};
const getRequesterId = (req) => {
  const v = req?.user && (req.user._id || req.user.userId || req.user.id);
  return v ? String(v) : "";
};
const isOwner = (server, userId) =>
  server?.owner &&
  (server.owner.equals?.(userId) || String(server.owner) === String(userId));

/* ================== Servers ================== */

// @desc    List servers for current user
// @route   GET /api/servers
// @access  Private
const listServers = async (req, res) => {
  try {
    const requesterId = getRequesterId(req);
    if (!isValidId(requesterId)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const servers = await Server.find({ "members.user": toId(requesterId) })
      .select("name icon owner")
      .lean();

    // id’leri düz string’e çevirerek API’yi stabilize edelim
    const data = servers.map((s) => ({
      id: String(s._id),
      name: s.name,
      icon: s.icon || null,
      owner: String(s.owner),
    }));

    return res.json({ success: true, servers: data });
  } catch (e) {
    console.error("List servers error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch servers" });
  }
};

// @desc    Create server
// @route   POST /api/servers
// @access  Private
const createServer = async (req, res) => {
  try {
    const requesterId = getRequesterId(req);
    if (!isValidId(requesterId)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, icon } = req.body || {};
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Server name is required" });
    }

    const server = await Server.create({
      name: name.trim(),
      icon: icon || null,
      owner: toId(requesterId),
      members: [{ user: toId(requesterId), role: "owner" }],
    });

    console.log(
      `Server created: ${server.name} by user: ${requesterId} with owner role`
    );

    return res.status(201).json({
      success: true,
      server: {
        id: String(server._id),
        name: server.name,
        icon: server.icon,
        owner: String(server.owner),
      },
    });
  } catch (e) {
    console.error("Create server error:", e);
    return res.status(500).json({
      success: false,
      message: e.message || "Failed to create server",
    });
  }
};

// @desc    Update server (owner only)
// @route   PUT /api/servers/:serverId
// @access  Private
const updateServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    if (!isValidId(serverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid server id" });
    }

    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getRequesterId(req);
    if (!isOwner(server, requesterId)) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can update the server" });
    }

    const { name, icon } = req.body || {};
    if (typeof name === "string" && name.trim()) server.name = name.trim();
    if (icon !== undefined) server.icon = icon || null;

    await server.save();
    return res.json({
      success: true,
      server: {
        id: String(server._id),
        name: server.name,
        icon: server.icon,
        owner: String(server.owner),
      },
    });
  } catch (e) {
    console.error("Update server error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update server" });
  }
};

// @desc    Delete server (owner only)
// @route   DELETE /api/servers/:serverId
// @access  Private
const deleteServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    if (!isValidId(serverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid server id" });
    }

    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getRequesterId(req);
    const isServerMember = server.members?.some(
      (m) => String(m.user) === String(requesterId)
    );

    // Geliştirme ortamında üyeler de sunucuyu silebilir
    const canDelete =
      isOwner(server, requesterId) ||
      (isServerMember && process.env.NODE_ENV === "development");

    if (!canDelete) {
      console.log(
        `User ${requesterId} cannot delete server ${serverId}. IsOwner: ${isOwner(
          server,
          requesterId
        )}, IsMember: ${isServerMember}`
      );
      return res
        .status(403)
        .json({ success: false, message: "Only owner can delete the server" });
    }

    console.log(
      `User ${requesterId} deleting server ${serverId}. IsOwner: ${isOwner(
        server,
        requesterId
      )}, IsMember: ${isServerMember}`
    );

    // Sunucu kanallarını kaldır (soft delete istemiyorsan full delete)
    await Channel.deleteMany({ server: server._id });
    await server.deleteOne();

    return res.json({ success: true });
  } catch (e) {
    console.error("Delete server error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete server" });
  }
};

/* ========= Channels in a Server ========= */

// @desc    List channels in a server (only for members)
// @route   GET /api/servers/:serverId/channels
// @access  Private
const listChannels = async (req, res) => {
  try {
    const { serverId } = req.params;
    if (!isValidId(serverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid server id" });
    }

    const requesterId = getRequesterId(req);
    const server = await Server.findById(serverId).select("_id owner members");
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const isMember = server.members?.some(
      (m) => String(m.user) === String(requesterId)
    );

    // Eğer kullanıcı sunucuda üye değilse, geliştirme aşamasında otomatik ekle
    if (!isMember && process.env.NODE_ENV === "development") {
      server.members = server.members || [];
      server.members.push({ user: toId(requesterId), role: "member" });
      await server.save();
    } else if (!isMember) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const channels = await Channel.find({
      server: serverId,
      isActive: { $ne: false },
    })
      .select("name description type")
      .lean();

    const data = channels.map((c) => ({
      id: String(c._id),
      name: c.name,
      description: c.description || "",
      type: c.type,
    }));

    return res.json({ success: true, channels: data });
  } catch (e) {
    console.error("List channels error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch channels" });
  }
};

// @desc    Create channel in a server (owner only by default)
// @route   POST /api/servers/:serverId/channels
// @access  Private
const createChannel = async (req, res) => {
  try {
    const { serverId } = req.params;
    if (!isValidId(serverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid server id" });
    }

    const requesterId = getRequesterId(req);
    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    // Yetki: owner veya admin kanal oluşturabilir
    const creatorRole = server.getUserRole?.(requesterId);
    const isServerOwner = isOwner(server, requesterId);
    const isServerAdmin = creatorRole === "admin";
    const isServerMember = server.members?.some(
      (m) => String(m.user) === String(requesterId)
    );

    // Eğer kullanıcı sunucuda üye değilse, geliştirme aşamasında otomatik ekle
    if (!isServerMember && process.env.NODE_ENV === "development") {
      server.members = server.members || [];
      server.members.push({ user: toId(requesterId), role: "admin" }); // Admin olarak ekle
      await server.save();
      console.log(
        `User ${requesterId} added as admin to server ${serverId} in development mode`
      );
    }

    const canCreate =
      isServerOwner ||
      isServerAdmin ||
      (isServerMember && process.env.NODE_ENV === "development");
    if (!canCreate) {
      console.log(
        `User ${requesterId} cannot create channel in server ${serverId}. Role: ${creatorRole}, IsOwner: ${isServerOwner}, IsAdmin: ${isServerAdmin}`
      );
      return res.status(403).json({
        success: false,
        message: "Only owner or admin can create channels",
      });
    }

    console.log(
      `User ${requesterId} creating channel in server ${serverId}. Role: ${creatorRole}, IsOwner: ${isServerOwner}, IsAdmin: ${isServerAdmin}`
    );

    const { name, description, type } = req.body || {};
    console.log(
      `Creating channel with data: name=${name}, description=${description}, type=${type}`
    );

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Channel name is required" });
    }

    // Sunucudaki tüm üyeleri kanala ekle (owner => admin; diğerleri => member), tekilleştir
    const uniq = new Set();
    const members = [];
    for (const m of server.members || []) {
      const key = String(m.user);
      if (uniq.has(key)) continue;
      uniq.add(key);
      // Sunucu sahibi ve adminler kanalda da admin; diğerleri member
      const elevated = m.role === "owner" || m.role === "admin";
      members.push({
        user: toId(m.user),
        role: elevated ? "admin" : "member",
      });
    }

    const channel = await Channel.create({
      name: name.trim(),
      description: description || "",
      type: type || "text",
      server: server._id,
      owner: toId(requesterId),
      members,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      channel: {
        id: String(channel._id),
        name: channel.name,
        description: channel.description || "",
        type: channel.type,
        server: String(channel.server),
      },
    });
  } catch (e) {
    console.error("Create channel error:", e);
    return res.status(500).json({
      success: false,
      message: e.message || "Failed to create channel",
    });
  }
};

// @desc    Update channel (rename/description) (owner only of server)
// @route   PUT /api/servers/:serverId/channels/:channelId
// @access  Private
const updateChannel = async (req, res) => {
  try {
    const { serverId, channelId } = req.params;
    if (!isValidId(serverId) || !isValidId(channelId)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getRequesterId(req);
    const updaterRole = server.getUserRole?.(requesterId);
    const isServerMember = server.members?.some(
      (m) => String(m.user) === String(requesterId)
    );

    // Eğer kullanıcı sunucuda üye değilse, geliştirme aşamasında otomatik ekle
    if (!isServerMember && process.env.NODE_ENV === "development") {
      server.members = server.members || [];
      server.members.push({ user: toId(requesterId), role: "admin" });
      await server.save();
      console.log(
        `User ${requesterId} added as admin to server ${serverId} for channel update`
      );
    }

    const canUpdate =
      isOwner(server, requesterId) ||
      updaterRole === "admin" ||
      (isServerMember && process.env.NODE_ENV === "development");
    if (!canUpdate) {
      console.log(
        `User ${requesterId} cannot update channel ${channelId}. Role: ${updaterRole}, IsOwner: ${isOwner(
          server,
          requesterId
        )}`
      );
      return res.status(403).json({
        success: false,
        message: "Only owner or admin can update channel",
      });
    }

    console.log(
      `User ${requesterId} updating channel ${channelId}. Role: ${updaterRole}, IsOwner: ${isOwner(
        server,
        requesterId
      )}`
    );

    const channel = await Channel.findOne({
      _id: channelId,
      server: server._id,
    });
    if (!channel)
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });

    const { name, description } = req.body || {};
    if (typeof name === "string" && name.trim()) channel.name = name.trim();
    if (description !== undefined) channel.description = description || "";

    await channel.save();
    return res.json({
      success: true,
      channel: {
        id: String(channel._id),
        name: channel.name,
        description: channel.description || "",
        type: channel.type,
        server: String(channel.server),
      },
    });
  } catch (e) {
    console.error("Update channel error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update channel" });
  }
};

// @desc    Delete channel (owner only of server)
// @route   DELETE /api/servers/:serverId/channels/:channelId
// @access  Private
const deleteChannel = async (req, res) => {
  try {
    const { serverId, channelId } = req.params;
    console.log(
      `Delete channel request - serverId: ${serverId}, channelId: ${channelId}`
    );

    if (!isValidId(serverId) || !isValidId(channelId)) {
      console.log(
        `Invalid IDs - serverId valid: ${isValidId(
          serverId
        )}, channelId valid: ${isValidId(channelId)}`
      );
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getRequesterId(req);
    const deleterRole = server.getUserRole?.(requesterId);
    const isServerMember = server.members?.some(
      (m) => String(m.user) === String(requesterId)
    );

    // Eğer kullanıcı sunucuda üye değilse, geliştirme aşamasında otomatik ekle
    if (!isServerMember && process.env.NODE_ENV === "development") {
      server.members = server.members || [];
      server.members.push({ user: toId(requesterId), role: "admin" });
      await server.save();
      console.log(
        `User ${requesterId} added as admin to server ${serverId} for channel deletion`
      );
    }

    const canDelete =
      isOwner(server, requesterId) ||
      deleterRole === "admin" ||
      (isServerMember && process.env.NODE_ENV === "development");
    if (!canDelete) {
      console.log(
        `User ${requesterId} cannot delete channel ${channelId}. Role: ${deleterRole}, IsOwner: ${isOwner(
          server,
          requesterId
        )}`
      );
      return res.status(403).json({
        success: false,
        message: "Only owner or admin can delete channel",
      });
    }

    console.log(
      `User ${requesterId} deleting channel ${channelId}. Role: ${deleterRole}, IsOwner: ${isOwner(
        server,
        requesterId
      )}`
    );

    // Önce channel'ın var olup olmadığını kontrol et
    const existingChannel = await Channel.findOne({
      _id: channelId,
      server: server._id,
    });

    if (!existingChannel) {
      console.log(`Channel not found: ${channelId} in server: ${server._id}`);
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }

    // Channel'ı sil
    const ch = await Channel.findOneAndDelete({
      _id: channelId,
      server: server._id,
    });

    console.log(`Channel deleted successfully: ${channelId}`);
    return res.json({ success: true });
  } catch (e) {
    console.error("Delete channel error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete channel" });
  }
};

// @desc    Set member role (owner only)
// @route   PUT /api/servers/:serverId/members/:userId/role
// @access  Private (owner)
const setMemberRole = async (req, res) => {
  try {
    const { serverId, userId } = req.params;
    const { role } = req.body || {};
    if (!isValidId(serverId) || !isValidId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }
    if (!["admin", "member"].includes(String(role))) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    const requesterId = getRequesterId(req);
    if (!isOwner(server, requesterId)) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can change roles" });
    }
    try {
      server.setMemberRole(userId, role);
      await server.save();
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, message: e.message || "Failed to set role" });
    }
    return res.json({ success: true });
  } catch (e) {
    console.error("Set member role error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Failed to set role" });
  }
};

/* ============ Migration helper ============ */

// @desc    Add all server members to all channels
// @route   POST /api/servers/:serverId/sync-channel-members
// @access  Private (owner)
const syncChannelMembers = async (req, res) => {
  try {
    const { serverId } = req.params;
    if (!isValidId(serverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid server id" });
    }

    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });

    const requesterId = getRequesterId(req);
    if (!isOwner(server, requesterId)) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can sync members" });
    }

    const channels = await Channel.find({ server: server._id });

    let updatedChannels = 0;
    for (const channel of channels) {
      let changed = false;
      const seen = new Set(channel.members.map((m) => String(m.user)));

      for (const m of server.members || []) {
        const key = String(m.user);
        if (seen.has(key)) continue;
        seen.add(key);
        channel.addMember?.(m.user, m.role === "owner" ? "admin" : "member");
        changed = true;
      }

      if (changed) {
        await channel.save();
        updatedChannels++;
      }
    }

    return res.json({
      success: true,
      message: `Updated ${updatedChannels} channels with all server members`,
      updatedChannels,
      totalChannels: channels.length,
    });
  } catch (e) {
    console.error("Sync channel members error:", e);
    return res.status(500).json({
      success: false,
      message: e.message || "Failed to sync channel members",
    });
  }
};

module.exports = {
  listServers,
  createServer,
  listChannels,
  createChannel,
  syncChannelMembers,
  deleteServer,
  updateServer,
  updateChannel,
  deleteChannel,
  setMemberRole,
};
