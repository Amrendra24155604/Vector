const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Saved',
  },
  appliedDate: { type: Date, default: null },
  interviewDate: { type: Date, default: null },
  offerDate: { type: Date, default: null },
  link: { type: String, default: '' },
  notes: { type: String, default: '' },
  matchScore: { type: Number, default: 0, min: 0, max: 100 },
  salary: { type: String, default: '' },
  source: { type: String, enum: ['LinkedIn', 'Glassdoor', 'Indeed', 'Manual', 'Other'], default: 'Manual' },
  tags: [{ type: String }],
  contactName: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  logo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
