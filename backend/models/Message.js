// models/Message.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
      required: [true, "Channel ID is required"],
    },
    serverId: {
      type: Schema.Types.ObjectId,
      ref: "Server",
      required: [true, "Server ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        url: String,
      },
    ],
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    reactions: [
      {
        emoji: {
          type: String,
          required: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
    },
  }
);

// Indexes for better performance
messageSchema.index({ channelId: 1, createdAt: -1 });
messageSchema.index({ serverId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });

// Virtual for formatted timestamp
messageSchema.virtual("formattedTime").get(function () {
  return this.createdAt.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Virtual for formatted date
messageSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

module.exports = mongoose.model("Message", messageSchema);
