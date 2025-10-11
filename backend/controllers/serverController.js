const mongoose = require("mongoose");
const Server = require("../models/Server");
const Channel = require("../models/Channel");

// List servers for current user
const listServers = async (req, res) => {
  try {
    const servers = await Server.find({ "members.user": req.user._id }).select(
      "name icon"
    );
    res.json({ success: true, servers });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch servers" });
  }
};

// Create server
const createServer = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Server name is required" });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const server = await Server.create({
      name: name.trim(),
      icon: icon || null,
      owner: new mongoose.Types.ObjectId(req.user._id),
      members: [{ user: req.user._id, role: "owner" }],
    });
    res.status(201).json({ success: true, server });
  } catch (e) {
    console.error("Create server error:", e);
    res.status(500).json({
      success: false,
      message: e.message || "Failed to create server",
    });
  }
};

// List channels in a server
const listChannels = async (req, res) => {
  try {
    const { serverId } = req.params;
    const channels = await Channel.find({ server: serverId }).select(
      "name description"
    );
    res.json({ success: true, channels });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch channels" });
  }
};

// Create channel in a server
const createChannel = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { name, description, type } = req.body;
    const channel = await Channel.create({
      name,
      description: description || "",
      type: type || "text",
      server: serverId,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });
    res.status(201).json({ success: true, channel });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message || "Failed to create channel",
    });
  }
};

// Delete server (owner only)
const deleteServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    const requesterId = String(
      (req.user && (req.user._id || req.user.userId || req.user.id)) || ""
    );
    if (String(server.owner) !== requesterId) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can delete the server" });
    }
    // Remove channels belonging to server
    await Channel.deleteMany({
      server: { $in: [serverId, new mongoose.Types.ObjectId(serverId)] },
    });
    await server.deleteOne();
    res.json({ success: true });
  } catch (e) {
    console.error("Delete server error:", e);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete server" });
  }
};

// Update server (owner only)
const updateServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { name, icon } = req.body;
    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    const requesterId = String(
      (req.user && (req.user._id || req.user.userId)) || ""
    );
    if (String(server.owner) !== requesterId) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can update the server" });
    }
    if (name && name.trim()) server.name = name.trim();
    if (icon !== undefined) server.icon = icon || null;
    await server.save();
    res.json({ success: true, server });
  } catch (e) {
    console.error("Update server error:", e);
    res
      .status(500)
      .json({ success: false, message: "Failed to update server" });
  }
};

// Update channel (rename)
const updateChannel = async (req, res) => {
  try {
    const { serverId, channelId } = req.params;
    const { name, description } = req.body;
    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    const requesterId = String(
      (req.user && (req.user._id || req.user.userId)) || ""
    );
    if (String(server.owner) !== requesterId) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can update channel" });
    }
    const channel = await Channel.findOne({
      _id: channelId,
      server: new mongoose.Types.ObjectId(serverId),
    });
    if (!channel)
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    if (name && name.trim()) channel.name = name.trim();
    if (description !== undefined) channel.description = description || "";
    await channel.save();
    res.json({ success: true, channel });
  } catch (e) {
    console.error("Update channel error:", e);
    res
      .status(500)
      .json({ success: false, message: "Failed to update channel" });
  }
};

// Delete channel
const deleteChannel = async (req, res) => {
  try {
    const { serverId, channelId } = req.params;
    const server = await Server.findById(serverId);
    if (!server)
      return res
        .status(404)
        .json({ success: false, message: "Server not found" });
    const requesterId = String(
      (req.user && (req.user._id || req.user.userId)) || ""
    );
    if (String(server.owner) !== requesterId) {
      return res
        .status(403)
        .json({ success: false, message: "Only owner can delete channel" });
    }
    const ch = await Channel.findOneAndDelete({
      _id: channelId,
      server: new mongoose.Types.ObjectId(serverId),
    });
    if (!ch)
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    res.json({ success: true });
  } catch (e) {
    console.error("Delete channel error:", e);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete channel" });
  }
};
module.exports = {
  listServers,
  createServer,
  listChannels,
  createChannel,
  deleteServer,
  updateServer,
  updateChannel,
  deleteChannel,
};
