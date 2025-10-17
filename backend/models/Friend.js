// models/Friend.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const friendSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requester is required"],
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
    acceptedAt: {
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

// Indexes
friendSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendSchema.index({ recipient: 1, status: 1 });
friendSchema.index({ requester: 1, status: 1 });

// Virtual for friend ID
friendSchema.virtual("id").get(function () {
  return this._id.toString();
});

// Pre-save middleware to prevent self-friending
friendSchema.pre("save", function (next) {
  if (this.requester.toString() === this.recipient.toString()) {
    const error = new Error("Kendinizi arkadaş olarak ekleyemezsiniz");
    return next(error);
  }
  next();
});

module.exports = mongoose.model("Friend", friendSchema);
