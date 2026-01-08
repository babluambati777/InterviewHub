const Feedback = require('../models/Feedback');
const Application = require('../models/Application');

// @desc    Submit interview feedback
// @route   POST /api/feedback
// @access  Private (Interviewer only)
const submitFeedback = async (req, res, next) => {
  try {
    const {
      application,
      interview,
      technicalSkills,
      communicationSkills,
      problemSolving,
      cultureFit,
      overallRating,
      comments,
      recommendation
    } = req.body;

    // Check if application exists
    const applicationExists = await Application.findById(application);
    if (!applicationExists) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if feedback already submitted
    const existingFeedback = await Feedback.findOne({
      application: application,
      interviewer: req.user._id
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        message: 'You have already submitted feedback for this application' 
      });
    }

    const feedback = await Feedback.create({
      application,
      interview,
      interviewer: req.user._id,
      technicalSkills,
      communicationSkills,
      problemSolving,
      cultureFit,
      overallRating,
      comments,
      recommendation
    });

    await feedback.populate([
      { path: 'application', populate: { path: 'applicant', select: 'name email' } },
      { path: 'interviewer', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    next(error);
  }
};

// @desc    Get feedback for an application
// @route   GET /api/feedback/application/:applicationId
// @access  Private
const getApplicationFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ 
      application: req.params.applicationId 
    })
      .populate('interviewer', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: feedback.length,
      feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback submitted by interviewer
// @route   GET /api/feedback/my-feedback
// @access  Private (Interviewer only)
const getMyFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ 
      interviewer: req.user._id 
    })
      .populate({
        path: 'application',
        populate: { path: 'applicant', select: 'name email' }
      })
      .sort('-createdAt');

    res.json({
      success: true,
      count: feedback.length,
      feedback
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getApplicationFeedback,
  getMyFeedback
};