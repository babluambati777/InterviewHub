// ============================================
// FILE: backend/models/Application.js
// ============================================
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  interview: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Interview' 
  },
  applicant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  resume: { type: String, required: true },
  coverLetter: { type: String },
  status: { 
    type: String, 
    enum: ['Applied', 'Under Review', 'Interview Scheduled', 
           'Selected', 'Rejected', 'On Hold'],
    default: 'Applied'
  },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
