const mongoose = require("mongoose");

const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      trim: true,
      maxlength: [50, "Role name cannot exceed 50 characters"],
    },
    serverId: {
      type: Schema.Types.ObjectId,
      ref: "Server",
      required: true,
    },
    color: {
      type: String,
      default: "#99AAB5", // Discord default color
      match: [/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"],
    },
    permissions: {
      // Server permissions
      manageServer: { type: Boolean, default: false },
      manageRoles: { type: Boolean, default: false },
      manageChannels: { type: Boolean, default: false },
      manageMembers: { type: Boolean, default: false },
      viewAuditLog: { type: Boolean, default: false },
      
      // Channel permissions
      viewChannels: { type: Boolean, default: true },
      sendMessages: { type: Boolean, default: true },
      manageMessages: { type: Boolean, default: false },
      embedLinks: { type: Boolean, default: true },
      attachFiles: { type: Boolean, default: true },
      readMessageHistory: { type: Boolean, default: true },
      mentionEveryone: { type: Boolean, default: false },
      useExternalEmojis: { type: Boolean, default: true },
      addReactions: { type: Boolean, default: true },
      
      // Voice permissions
      connect: { type: Boolean, default: true },
      speak: { type: Boolean, default: true },
      muteMembers: { type: Boolean, default: false },
      deafenMembers: { type: Boolean, default: false },
      moveMembers: { type: Boolean, default: false },
      useVoiceActivation: { type: Boolean, default: true },
      prioritySpeaker: { type: Boolean, default: false },
      
      // Advanced permissions
      administrator: { type: Boolean, default: false },
      createInstantInvite: { type: Boolean, default: true },
      changeNickname: { type: Boolean, default: true },
      manageNicknames: { type: Boolean, default: false },
      kickMembers: { type: Boolean, default: false },
      banMembers: { type: Boolean, default: false },
    },
    position: {
      type: Number,
      default: 0,
    },
    mentionable: {
      type: Boolean,
      default: true,
    },
    hoist: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    toObject: {
      virtuals: true,
      versionKey: false,
    },
  }
);

// Indexes
roleSchema.index({ serverId: 1, position: -1 });
roleSchema.index({ serverId: 1, name: 1 }, { unique: true });

// Virtuals
roleSchema.virtual("id").get(function () {
  return this._id.toString();
});

// Methods
roleSchema.methods.hasPermission = function(permission) {
  if (this.permissions.administrator) {
    return true;
  }
  return this.permissions[permission] === true;
};

roleSchema.methods.canManageRole = function(targetRole) {
  if (this.permissions.administrator) {
    return true;
  }
  if (!this.permissions.manageRoles) {
    return false;
  }
  return this.position > targetRole.position;
};

module.exports = mongoose.model("Role", roleSchema);
