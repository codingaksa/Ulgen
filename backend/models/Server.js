// models/Server.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const toId = (v) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));
const sameId = (a, b) => String(a) === String(b);

const memberSub = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const serverSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Server name is required'],
      trim: true,
      maxlength: [60, 'Server name cannot exceed 60 characters']
    },
    icon: { type: String, default: null },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: { type: [memberSub], default: [] }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false }
  }
);

/* ---------- Indexes ---------- */
// Üye-odaklı sorgular
serverSchema.index({ 'members.user': 1 });
// Sık kullanılan aramalar: aynı sahibin sunucularında isim
serverSchema.index({ owner: 1, name: 1 });

/* ---------- Virtuals ---------- */
serverSchema.virtual('memberCount').get(function () {
  return this.members.length;
});
serverSchema.virtual('id').get(function () {
  return this._id.toString();
});

/* ---------- Normalization ---------- */
serverSchema.pre('validate', function normalize(next) {
  if (typeof this.name === 'string') this.name = this.name.trim();
  next();
});

/* ---------- Instance Methods ---------- */
serverSchema.methods.isMember = function (userId) {
  const uid = toId(userId);
  return this.members.some((m) => sameId(m.user, uid));
};

serverSchema.methods.getUserRole = function (userId) {
  const uid = toId(userId);
  const m = this.members.find((m) => sameId(m.user, uid));
  return m ? m.role : null;
};

serverSchema.methods.addMember = function (userId, role = 'member') {
  const uid = toId(userId);
  if (this.isMember(uid)) return false;
  this.members.push({ user: uid, role, joinedAt: new Date() });
  return true;
};

serverSchema.methods.removeMember = function (userId) {
  const uid = toId(userId);
  if (sameId(this.owner, uid)) {
    throw new Error('Owner cannot be removed from server members');
  }
  const before = this.members.length;
  this.members = this.members.filter((m) => !sameId(m.user, uid));
  return this.members.length !== before;
};

serverSchema.methods.setMemberRole = function (userId, role) {
  if (!['owner', 'admin', 'member'].includes(role)) {
    throw new Error('Invalid role');
  }
  const uid = toId(userId);
  const i = this.members.findIndex((m) => sameId(m.user, uid));
  if (i === -1) throw new Error('User is not a member of this server');

  // Sahibi aşağıya düşürmeyelim
  if (sameId(this.owner, uid) && role !== 'owner') {
    throw new Error('Owner role cannot be downgraded');
  }

  this.members[i].role = role;
  return true;
};

/* ---------- Hooks ---------- */
// Owner her zaman üyeler arasında ve rolü 'owner' olmalı; duplicate temizliği
serverSchema.pre('save', function ensureOwner(next) {
  try {
    const o = toId(this.owner);
    const idx = this.members.findIndex((m) => sameId(m.user, o));

    if (idx === -1) {
      this.members.unshift({ user: o, role: 'owner', joinedAt: new Date() });
    } else {
      this.members[idx].role = 'owner';
    }

    // Duplicates: aynı kullanıcıdan tek kayıt kalsın (ilk gördüğümüz)
    const seen = new Set();
    this.members = this.members.filter((m) => {
      const key = String(m.user);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Server', serverSchema);
