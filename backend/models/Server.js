const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  icon: { type: String, default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

serverSchema.index({ owner: 1 });
serverSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Server', serverSchema);


