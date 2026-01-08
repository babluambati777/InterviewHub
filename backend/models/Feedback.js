// ============================================
// FILE: backend/models/Feedback.js
// ============================================
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  application: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Application', 
    required: true 
  },
  interview: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Interview', 
    required: true 
  },
  interviewer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  technicalSkills: { type: Number, min: 1, max: 10 },
  communicationSkills: { type: Number, min: 1, max: 10 },
  problemSolving: { type: Number, min: 1, max: 10 },
  cultureFit: { type: Number, min: 1, max: 10 },
  overallRating: { type: Number, min: 1, max: 10, required: true },
  comments: { type: String },
  recommendation: { 
    type: String, 
    enum: ['Strongly Recommend', 'Recommend', 'Neutral', 
           'Not Recommend', 'Strongly Not Recommend'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

// ============================================
// FILE: backend/middleware/auth.js
// ============================================
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };