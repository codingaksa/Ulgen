// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username cannot exceed 20 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true, // normalize
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,}$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    avatar: { type: String, default: null },

    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },

    channels: [{ type: Schema.Types.ObjectId, ref: 'Channel', default: [] }],

    // Email verification
    isEmailVerified: { type: Boolean, default: false },
    // SHA-256 HASH saklanır
    emailVerificationToken: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },

    // Password reset (SHA-256 HASH saklanır)
    passwordResetToken: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        // Gizli alanları çıkar
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      versionKey: false
    }
  }
);

/* ---------- Virtuals ---------- */
userSchema.virtual('id').get(function () {
  return this._id.toString();
});

/* ---------- Normalization ---------- */
userSchema.pre('validate', function normalize(next) {
  if (typeof this.username === 'string') this.username = this.username.trim();
  if (typeof this.email === 'string') this.email = this.email.trim().toLowerCase();
  next();
});

/* ---------- Hooks ---------- */
// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* ---------- Methods ---------- */
// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token (returns RAW hex, stores HASH)
userSchema.methods.generateEmailVerificationToken = function () {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  this.emailVerificationToken = hash;
  this.emailVerificationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün
  return raw; // e-postada bu gönderilir
};

// Generate password reset token (returns RAW hex, stores HASH)
userSchema.methods.generatePasswordResetToken = function () {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  this.passwordResetToken = hash;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 dk
  return raw;
};

module.exports = mongoose.model('User', userSchema);
