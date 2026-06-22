const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, select: false },
  authProvider: { type: String, enum: ['email', 'google'], default: 'email' },
  googleId: { type: String, default: null },
  emailVerified: { type: Boolean, default: false },
  otpHash: { type: String, select: false },
  otpExpiry: { type: Date, default: null },
  university: { type: String, default: '' },
  major: { type: String, default: '' },
  graduationYear: { type: Number, default: null },
  location: { type: String, default: '' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  avatarUrl: { type: String, default: '' },
  resumeScore: { type: Number, default: 0 },
  interviewSessionsCount: { type: Number, default: 0 },
  cumulativeInterviewScore: { type: Number, default: 0 },
  readinessLevel: { type: String, default: '' },
  applicationsCount: { type: Number, default: 0 },
  emailsSentCount: { type: Number, default: 0 },
  isPro: { type: Boolean, default: false },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Hash password before saving (only for email auth)
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
