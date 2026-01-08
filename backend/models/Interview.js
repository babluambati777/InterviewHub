// ============================================
// FILE: backend/models/Interview.js
// ============================================
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  scheduledBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  interviewers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  date: { type: Date, required: true },
  time: { type: String, required: true },
  mode: { 
    type: String, 
    enum: ['In-person', 'Video Call', 'Phone'], 
    required: true 
  },
  meetingLink: { type: String },
  location: { type: String },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'], 
    default: 'Scheduled' 
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
