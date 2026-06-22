const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  hint: { type: String, default: '' },
  category: { type: String, default: '' },
  difficulty: { type: String, enum: ['beginner', 'mid', 'senior'], default: 'mid' },
  userAnswer: { type: String, default: '' },
  starScore: { type: Number, default: 0, min: 0, max: 100 },
  clarityScore: { type: Number, default: 0, min: 0, max: 100 },
  confidenceScore: { type: Number, default: 0, min: 0, max: 100 },
  technicalAccuracyScore: { type: Number, default: 0, min: 0, max: 100 },
  aiSuggestion: { type: String, default: '' },
  strengthPoints: [{ type: String }],
  improvementPoints: [{ type: String }],
  sampleCorrectAnswer: { type: String, default: '' },
  hasSituation: { type: Boolean, default: false },
  hasTask: { type: Boolean, default: false },
  hasAction: { type: Boolean, default: false },
  hasResult: { type: Boolean, default: false },
  fillerWordCount: { type: Number, default: 0 },
  answeredAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true, trim: true },
  company: { type: String, default: '' },
  difficulty: { type: String, enum: ['beginner', 'mid', 'senior'], default: 'mid' },
  sessionType: {
    type: String,
    enum: ['behavioral', 'technical', 'mixed', 'system_design', 'case_study'],
    default: 'behavioral',
  },
  questions: [questionSchema],
  overallScore: { type: Number, default: 0, min: 0, max: 100 },
  clarityScore: { type: Number, default: 0, min: 0, max: 100 },
  confidenceScore: { type: Number, default: 0, min: 0, max: 100 },
  starComplianceScore: { type: Number, default: 0, min: 0, max: 100 },
  technicalScore: { type: Number, default: 0, min: 0, max: 100 },
  durationSeconds: { type: Number, default: 0 },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  coachTip: { type: String, default: '' },
  aiReport: { type: String, default: '' },
  readinessLevel: { type: String, default: '' },
  nextSessionFocus: { type: String, default: '' },
  cumulativeScoreAtTime: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
}, { timestamps: true });

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);
