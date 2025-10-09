const Channel = require('../models/Channel');
const User = require('../models/User');

// @desc    Get all channels for user
// @route   GET /api/channels
// @access  Private
const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ],
      isActive: true
    })
    .populate('owner', 'username avatar')
    .populate('members.user', 'username avatar isOnline')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      channels
    });
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get channels',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single channel
// @route   GET /api/channels/:id
// @access  Private
const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('members.user', 'username avatar isOnline');

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    // Check if user has access to this channel
    if (channel.owner._id.toString() !== req.user._id.toString() && 
        !channel.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this channel'
      });
    }

    res.json({
      success: true,
      channel
    });
  } catch (error) {
    console.error('Get channel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get channel',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Create new channel
// @route   POST /api/channels
// @access  Private
const createChannel = async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers } = req.body;

    // Create channel
    const channel = await Channel.create({
      name,
      description,
      owner: req.user._id,
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 10
    });

    // Add owner as admin member
    channel.addMember(req.user._id, 'admin');
    await channel.save();

    // Add channel to user's channels
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { channels: channel._id }
    });

    // Populate the created channel
    await channel.populate('owner', 'username avatar');
    await channel.populate('members.user', 'username avatar isOnline');

    res.status(201).json({
      success: true,
      message: 'Channel created successfully',
      channel
    });
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create channel',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update channel
// @route   PUT /api/channels/:id
// @access  Private
const updateChannel = async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers } = req.body;
    
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    // Check if user is owner or admin
    if (channel.owner._id.toString() !== req.user._id.toString()) {
      const userRole = channel.getUserRole(req.user._id);
      if (userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only channel owner or admin can update channel'
        });
      }
    }

    // Update channel
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;
    if (maxMembers) updateData.maxMembers = maxMembers;

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('owner', 'username avatar')
    .populate('members.user', 'username avatar isOnline');

    res.json({
      success: true,
      message: 'Channel updated successfully',
      channel: updatedChannel
    });
  } catch (error) {
    console.error('Update channel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update channel',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete channel
// @route   DELETE /api/channels/:id
// @access  Private
const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    // Check if user is owner
    if (channel.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only channel owner can delete channel'
      });
    }

    // Soft delete - mark as inactive
    channel.isActive = false;
    await channel.save();

    // Remove channel from all users' channels
    await User.updateMany(
      { channels: channel._id },
      { $pull: { channels: channel._id } }
    );

    res.json({
      success: true,
      message: 'Channel deleted successfully'
    });
  } catch (error) {
    console.error('Delete channel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete channel',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Join channel
// @route   POST /api/channels/:id/join
// @access  Private
const joinChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    if (!channel.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Channel is not active'
      });
    }

    // Check if user is already a member
    if (channel.isMember(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this channel'
      });
    }

    // Check if channel is full
    if (channel.members.length >= channel.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Channel is full'
      });
    }

    // Add user to channel
    channel.addMember(req.user._id);
    await channel.save();

    // Add channel to user's channels
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { channels: channel._id }
    });

    // Populate the updated channel
    await channel.populate('owner', 'username avatar');
    await channel.populate('members.user', 'username avatar isOnline');

    res.json({
      success: true,
      message: 'Successfully joined channel',
      channel
    });
  } catch (error) {
    console.error('Join channel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join channel',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Leave channel
// @route   POST /api/channels/:id/leave
// @access  Private
const leaveChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    // Check if user is a member
    if (!channel.isMember(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this channel'
      });
    }

    // Check if user is owner
    if (channel.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Channel owner cannot leave. Transfer ownership or delete channel instead.'
      });
    }

    // Remove user from channel
    channel.removeMember(req.user._id);
    await channel.save();

    // Remove channel from user's channels
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { channels: channel._id }
    });

    res.json({
      success: true,
      message: 'Successfully left channel'
    });
  } catch (error) {
    console.error('Leave channel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave channel',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
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
