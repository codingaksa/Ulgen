const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, unique: true, index: true, required: true },
    serverId: { type: String, required: true },
    channelId: { type: String }, // Optional: for channel-specific invites
    inviteType: {
      type: String,
      enum: ["server", "channel"],
      default: "server",
    },
    createdAt: { type: Date, default: () => new Date(), index: true },
    expiresAt: { type: Date },
    // 0 => unlimited uses
    remainingUses: { type: Number, default: 1 },
  },
  { collection: "invites" }
);

// TTL index for expiresAt
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Invite", inviteSchema);
