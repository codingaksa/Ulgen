const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
      minlength: [1, "Channel name must be at least 1 character long"],
      maxlength: [50, "Channel name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        role: {
          type: String,
          enum: ["admin", "moderator", "member"],
          default: "member",
        },
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    maxMembers: {
      type: Number,
      default: 10,
      min: [2, "Channel must allow at least 2 members"],
      max: [50, "Channel cannot have more than 50 members"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
channelSchema.index({ server: 1 });
channelSchema.index({ "members.user": 1 });
channelSchema.index({ isActive: 1 });

// Virtual for member count
channelSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

// Method to add member
channelSchema.methods.addMember = function (userId, role = "member") {
  const existingMember = this.members.find(
    (member) => member.user.toString() === userId.toString()
  );

  if (existingMember) {
    return false; // User already in channel
  }

  this.members.push({
    user: userId,
    role: role,
    joinedAt: new Date(),
  });

  return true;
};

// Method to remove member
channelSchema.methods.removeMember = function (userId) {
  this.members = this.members.filter(
    (member) => member.user.toString() !== userId.toString()
  );
};

// Method to check if user is member
channelSchema.methods.isMember = function (userId) {
  return this.members.some(
    (member) => member.user.toString() === userId.toString()
  );
};

// Method to get user role in channel
channelSchema.methods.getUserRole = function (userId) {
  const member = this.members.find(
    (member) => member.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

module.exports = mongoose.model("Channel", channelSchema);
