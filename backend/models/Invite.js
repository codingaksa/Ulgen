// models/Invite.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema, Types } = mongoose;
const toId = (v) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));

const inviteSchema = new Schema(
  {
    // SHA-256(tokenRaw) -> tokenHash. Raw token asla DB'ye yazılmaz.
    tokenHash: { type: String, unique: true, index: true, required: true },

    // Kapsam: Sunucu zorunlu, kanal opsiyonel (channel varsa scope channel’dır)
    serverId: { type: Schema.Types.ObjectId, ref: 'Server', required: true, index: true },
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel', default: null, index: true },

    inviteType: {
      type: String,
      enum: ['server', 'channel'],
      default: 'server',
    },

    // Kim oluşturdu? (opsiyonel ama audit için faydalı)
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    // Geçerlilik
    expiresAt: { type: Date, default: null }, // null => süresiz

    /**
     * 0 => sınırsız kullanım
     * >0 => kalan kullanım hakkı
     */
    remainingUses: { type: Number, default: 1, min: 0 },
  },
  {
    collection: 'invites',
    timestamps: true, // createdAt / updatedAt
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
  }
);

// TTL index: expiresAt geldiğinde belge otomatik silinir (expiresAt=null ise çalışmaz).
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/* ----------------- Instance helpers ----------------- */
inviteSchema.methods.isExpired = function (now = new Date()) {
  return this.expiresAt instanceof Date && this.expiresAt.getTime() <= now.getTime();
};

inviteSchema.methods.hasUsesLeft = function () {
  return this.remainingUses === 0 || this.remainingUses > 0;
};

inviteSchema.methods.canBeRedeemed = function (now = new Date()) {
  return !this.isExpired(now) && this.hasUsesLeft();
};

// Hassas alanları gizleyip stabil string id'lerle döndür
inviteSchema.methods.toPublic = function () {
  const obj = this.toObject();
  return {
    id: String(obj._id),
    inviteType: obj.inviteType,
    serverId: obj.serverId ? String(obj.serverId) : null,
    channelId: obj.channelId ? String(obj.channelId) : null,
    createdBy: obj.createdBy ? String(obj.createdBy) : null,
    expiresAt: obj.expiresAt ? new Date(obj.expiresAt).toISOString() : null,
    remainingUses: obj.remainingUses,
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : null,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : null,
  };
};

/* ----------------- Statics ----------------- */
/**
 * Raw token ile redeem:
 *  - tokenRaw -> sha256 hex
 *  - expire ve kullanım hakkı koşullarını atomik kontrol et
 *  - unlimited (remainingUses=0) ise decrement yapma
 *  - limited (>0) ise 1 azalt
 * Başarılıysa invite döner; bulunamazsa null döner.
 */
inviteSchema.statics.redeemByTokenRaw = async function (tokenRaw, { returnPublic = true } = {}) {
  const tokenHash = crypto.createHash('sha256').update(String(tokenRaw)).digest('hex');
  return this.redeemByTokenHash(tokenHash, { returnPublic });
};

/**
 * tokenHash ile atomik redeem (Mongo 4.2+ pipeline updates).
 */
inviteSchema.statics.redeemByTokenHash = async function (tokenHash, { returnPublic = true } = {}) {
  const now = new Date();

  // Koşullar:
  // - tokenHash eşleşir
  // - expiresAt yok veya gelecekte
  // - remainingUses == 0 (unlimited) veya > 0 (limited)
  const query = {
    tokenHash,
    $and: [
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      { $or: [{ remainingUses: 0 }, { remainingUses: { $gt: 0 } }] },
    ],
  };

  const update = [
    {
      $set: {
        remainingUses: {
          $cond: [{ $eq: ['$remainingUses', 0] }, 0, { $subtract: ['$remainingUses', 1] }],
        },
        updatedAt: now,
      },
    },
  ];

  const options = { new: true };
  const doc = await this.findOneAndUpdate(query, update, options);
  if (!doc) return null;

  return returnPublic ? doc.toPublic() : doc;
};

module.exports = mongoose.model('Invite', inviteSchema);
