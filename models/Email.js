const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true, trim: true },
  recruiterName: { type: String, default: '' },
  role: { type: String, required: true, trim: true },
  companyContext: { type: String, default: '' },
  tone: {
    type: String,
    enum: ['formal', 'conversational', 'bold'],
    default: 'conversational',
  },
  generatedEmail: { type: String, default: '' },
  generatedLinkedIn: { type: String, default: '' },
  userNotes: { type: String, default: '' },
  wasUsed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Email || mongoose.model('Email', emailSchema);
