// controllers/channelController.js
const mongoose = require('mongoose');
const Channel = require('../models/Channel');
const User = require('../models/User');

const { Types } = mongoose;
const isValidId = (v) => Types.ObjectId.isValid(String(v));
const toId = (v) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));

// Tekrarlı populate şablonu
const channelPopulate = [
  { path: 'owner', select: 'username avatar' },
  { path: 'members.user', select: 'username avatar isOnline' }
];

/* -------------------- List -------------------- */
// @desc    Get all channels for user
// @route   GET /api/channels
// @access  Private
const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({
      isActive: true,
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
    })
      .populate(channelPopulate)
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({ success: true, channels });
  } catch (error) {
    console.error('Get channels error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get channels' });
  }
};

/* -------------------- Read -------------------- */
// @desc    Get single channel
// @route   GET /api/channels/:id
// @access  Private
const getChannel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid channel id' });

    const channel = await Channel.findById(id).populate(channelPopulate);
    if (!channel || !channel.isActive) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    const isOwner = channel.owner?.equals?.(req.user._id) || String(channel.owner) === String(req.user._id);
    if (!isOwner && !channel.isMember(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied to this channel' });
    }

    return res.json({ success: true, channel });
  } catch (error) {
    console.error('Get channel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get channel' });
  }
};

/* -------------------- Create -------------------- */
// @desc    Create new channel
// @route   POST /api/channels
// @access  Private
const createChannel = async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Channel name is required' });
    }

    const channel = await Channel.create({
      name: name.trim(),
      description: typeof description === 'string' ? description : '',
      owner: req.user._id,
      isPrivate: Boolean(isPrivate),
      maxMembers: Number(maxMembers) > 0 ? Number(maxMembers) : 10,
      isActive: true
    });

    // Owner'ı admin olarak ekle (model hook/logic ile uyumlu)
    if (!channel.isMember(req.user._id)) {
      channel.addMember(req.user._id, 'admin');
      await channel.save();
    }

    // Kullanıcıya kanalı ekle (client hızlı listelesin)
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { channels: channel._id } });

    await channel.populate(channelPopulate);

    return res.status(201).json({
      success: true,
      message: 'Channel created successfully',
      channel
    });
  } catch (error) {
    console.error('Create channel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create channel' });
  }
};

/* -------------------- Update -------------------- */
// @desc    Update channel
// @route   PUT /api/channels/:id
// @access  Private
const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid channel id' });

    const { name, description, isPrivate, maxMembers } = req.body;

    const channel = await Channel.findById(id);
    if (!channel || !channel.isActive) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    // Yetki: owner veya admin
    const isOwner = channel.owner?.equals?.(req.user._id) || String(channel.owner) === String(req.user._id);
    let role = null;
    if (!isOwner) {
      role = channel.getUserRole ? channel.getUserRole(req.user._id) : null;
      if (role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only channel owner or admin can update channel' });
      }
    }

    const updateData = {};
    if (typeof name === 'string' && name.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (typeof isPrivate === 'boolean') updateData.isPrivate = isPrivate;

    if (maxMembers !== undefined) {
      const m = Number(maxMembers);
      if (!Number.isFinite(m) || m < 2 || m > 50) {
        return res.status(400).json({ success: false, message: 'maxMembers must be between 2 and 50' });
      }
      if (channel.members.length > m) {
        return res
          .status(400)
          .json({ success: false, message: 'maxMembers cannot be less than current member count' });
      }
      updateData.maxMembers = m;
    }

    const updatedChannel = await Channel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate(channelPopulate);

    return res.json({
      success: true,
      message: 'Channel updated successfully',
      channel: updatedChannel
    });
  } catch (error) {
    console.error('Update channel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update channel' });
  }
};

/* -------------------- Delete (soft) -------------------- */
// @desc    Delete channel (soft delete)
// @route   DELETE /api/channels/:id
// @access  Private
const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid channel id' });

    const channel = await Channel.findById(id);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    const isOwner = channel.owner?.equals?.(req.user._id) || String(channel.owner) === String(req.user._id);
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Only channel owner can delete channel' });
    }

    if (!channel.isActive) {
      return res.json({ success: true, message: 'Channel already deleted' });
    }

    channel.isActive = false;
    await channel.save();

    // Tüm üyelerden kanalı kaldır
    await User.updateMany({ channels: channel._id }, { $pull: { channels: channel._id } });

    return res.json({ success: true, message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Delete channel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete channel' });
  }
};

/* -------------------- Join -------------------- */
// @desc    Join channel
// @route   POST /api/channels/:id/join
// @access  Private
const joinChannel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid channel id' });

    const channel = await Channel.findById(id);
    if (!channel || !channel.isActive) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    if (channel.isMember(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this channel' });
    }

    if (channel.members.length >= channel.maxMembers) {
      return res.status(400).json({ success: false, message: 'Channel is full' });
    }

    try {
      channel.addMember(req.user._id); // default role: member
      await channel.save();
    } catch (e) {
      // model içi kapasite/aktiflik hataları
      return res.status(400).json({ success: false, message: e.message || 'Cannot join channel' });
    }

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { channels: channel._id } });
    await channel.populate(channelPopulate);

    return res.json({ success: true, message: 'Successfully joined channel', channel });
  } catch (error) {
    console.error('Join channel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to join channel' });
  }
};

/* -------------------- Leave -------------------- */
// @desc    Leave channel
// @route   POST /api/channels/:id/leave
// @access  Private
const leaveChannel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ success: false, message: 'Invalid channel id' });

    const channel = await Channel.findById(id);
    if (!channel || !channel.isActive) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    if (!channel.isMember(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are not a member of this channel' });
    }

    const isOwner = channel.owner?.equals?.(req.user._id) || String(channel.owner) === String(req.user._id);
    if (isOwner) {
      return res.status(400).json({
        success: false,
        message: 'Channel owner cannot leave. Transfer ownership or delete channel instead.'
      });
    }

    channel.removeMember(req.user._id);
    await channel.save();

    await User.findByIdAndUpdate(req.user._id, { $pull: { channels: channel._id } });

    return res.json({ success: true, message: 'Successfully left channel' });
  } catch (error) {
    console.error('Leave channel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to leave channel' });
  }
};

module.exports = {
  getChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  joinChannel,
  leaveChannel
};
