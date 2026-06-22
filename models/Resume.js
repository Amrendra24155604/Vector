const mongoose = require('mongoose');

const bulletSuggestionSchema = new mongoose.Schema({
  original: { type: String },
  improved: { type: String },
  reason: { type: String },
});

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  rawText: { type: String, default: '' },
  atsScore: { type: Number, default: 0, min: 0, max: 100 },
  formattingScore: { type: Number, default: 0, min: 0, max: 100 },
  keywordScore: { type: Number, default: 0, min: 0, max: 100 },
  impactScore: { type: Number, default: 0, min: 0, max: 100 },
  matchedJD: { type: String, default: '' },
  jdMatchScore: { type: Number, default: 0, min: 0, max: 100 },
  bulletSuggestions: [bulletSuggestionSchema],
  skillGaps: [{ type: String }],
  matchedKeywords: [{ type: String }],
  missingKeywords: [{ type: String }],
  summaryFeedback: { type: String, default: '' },
  changesMade: [{
    sectionName: { type: String },
    changeExplanation: { type: String }
  }],
  thingsToLearn: [{
    skill: { type: String },
    importance: { type: String },
    learningResource: { type: String }
  }],
  newResume: {
    templateName: { type: String, default: '' },
    header: { type: String, default: '' },
    summary: { type: String, default: '' },
    sections: [{
      title: { type: String },
      content: { type: String }
    }]
  },
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
