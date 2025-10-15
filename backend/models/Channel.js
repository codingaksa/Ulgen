// models/Channel.js
const mongoose = require('mongoose');

const { Schema, Types } = mongoose;
const toId = (v) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));
const sameId = (a, b) => String(a) === String(b);

const memberSub = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' }
  },
  { _id: false }
);

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Channel name is required'],
      trim: true,
      minlength: [1, 'Channel name must be at least 1 character long'],
      maxlength: [50, 'Channel name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: ''
    },
    type: {
      type: String,
      enum: ['text', 'voice'],
      default: 'text'
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
      required: true,
      index: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: { type: [memberSub], default: [] },
    isPrivate: { type: Boolean, default: false },
    maxMembers: {
      type: Number,
      default: 10,
      min: [2, 'Channel must allow at least 2 members'],
      max: [50, 'Channel cannot have more than 50 members']
    },
    isActive: { type: Boolean, default: true, index: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false }
  }
);

/* ---------- Indexes ---------- */
// Aktif kanallar içinde isim benzersiz olsun; soft-delete (isActive=false) izin verir
channelSchema.index(
  { server: 1, name: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);
// Üyelik sorguları için
channelSchema.index({ 'members.user': 1 });

/* ---------- Virtuals ---------- */
channelSchema.virtual('memberCount').get(function () {
  return this.members.length;
});
channelSchema.virtual('id').get(function () {
  return this._id.toString();
});

/* ---------- Hooks ---------- */
// name otomatik trim/normalize (güvenlik için)
channelSchema.pre('validate', function normalizeName(next) {
  if (typeof this.name === 'string') this.name = this.name.trim();
  if (typeof this.description === 'string') this.description = this.description.trim();
  next();
});

// Owner her zaman üyeler arasında en az admin rolüyle yer almalı
channelSchema.pre('save', function ensureOwnerInMembers(next) {
  try {
    const o = toId(this.owner);
    const idx = this.members.findIndex((m) => sameId(m.user, o));
    if (idx === -1) {
      this.members.unshift({ user: o, role: 'admin', joinedAt: new Date() });
    } else if (this.members[idx].role !== 'admin') {
      this.members[idx].role = 'admin';
    }
    if (this.members.length > this.maxMembers) {
      return next(new Error('maxMembers cannot be less than current member count'));
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

/* ---------- Helpers ---------- */
function findMemberIndex(doc, userId) {
  const uid = toId(userId);
  return doc.members.findIndex((m) => sameId(m.user, uid));
}

/* ---------- Instance Methods ---------- */
channelSchema.methods.isMember = function (userId) {
  return findMemberIndex(this, userId) !== -1;
};

channelSchema.methods.getUserRole = function (userId) {
  const i = findMemberIndex(this, userId);
  return i === -1 ? null : this.members[i].role;
};

channelSchema.methods.addMember = function (userId, role = 'member') {
  if (!this.isActive) throw new Error('Channel is not active');
  if (this.members.length >= this.maxMembers) throw new Error('Channel is full');

  const uid = toId(userId);
  if (this.isMember(uid)) return false;

  this.members.push({ user: uid, role, joinedAt: new Date() });
  return true;
};

channelSchema.methods.removeMember = function (userId) {
  const uid = toId(userId);
  if (sameId(this.owner, uid)) {
    throw new Error('Owner cannot be removed from channel members');
  }
  const before = this.members.length;
  this.members = this.members.filter((m) => !sameId(m.user, uid));
  return this.members.length !== before;
};

channelSchema.methods.setMemberRole = function (userId, role) {
  if (!['admin', 'moderator', 'member'].includes(role)) {
    throw new Error('Invalid role');
  }
  const i = findMemberIndex(this, userId);
  if (i === -1) throw new Error('User is not a member of this channel');
  this.members[i].role = role;
  return true;
};

module.exports = mongoose.model('Channel', channelSchema);
