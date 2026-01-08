const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Job = require('../models/Job');

// ... (keep all existing functions)

// @desc    Get applicants for an interview
// @route   GET /api/interviews/:id/applicants
// @access  Private (HR, Interviewer)
const getInterviewApplicants = async (req, res, next) => {
  try {
    console.log('Fetching applicants for interview:', req.params.id);
    
    // First, get the interview to find which job it's for
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    console.log('Interview job:', interview.job);
    
    // Find ALL applications for this job (not just ones linked to interview)
    const applications = await Application.find({ 
      job: interview.job 
    })
      .populate('applicant', 'name email phone')
      .populate('job', 'title')
      .populate('interview', 'date time mode');

    console.log('Found applications for job:', applications.length);

    res.json({
      success: true,
      count: applications.length,
      applications,
      interview: interview
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    next(error);
  }
};


// IMPORTANT: Make sure to export this function
const createInterview = async (req, res, next) => {
  try {
    const { job, interviewers, date, time, mode, meetingLink, location, notes } = req.body;

    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const interview = await Interview.create({
      job,
      scheduledBy: req.user._id,
      interviewers,
      date,
      time,
      mode,
      meetingLink,
      location,
      notes
    });

    await interview.populate([
      { path: 'job', select: 'title company' },
      { path: 'interviewers', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      interview
    });
  } catch (error) {
    next(error);
  }
};

const getAllInterviews = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'HR') {
      query.scheduledBy = req.user._id;
    }
    
    if (req.user.role === 'Interviewer') {
      query.interviewers = req.user._id;
    }

    if (req.user.role === 'Student') {
      const applications = await Application.find({ 
        applicant: req.user._id,
        interview: { $exists: true }
      }).select('interview');
      
      const interviewIds = applications.map(app => app.interview);
      query._id = { $in: interviewIds };
    }

    const interviews = await Interview.find(query)
      .populate('job', 'title company')
      .populate('interviewers', 'name email')
      .populate('scheduledBy', 'name email')
      .sort('-date');

    res.json({
      success: true,
      count: interviews.length,
      interviews
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('job')
      .populate('interviewers', 'name email phone')
      .populate('scheduledBy', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({
      success: true,
      interview
    });
  } catch (error) {
    next(error);
  }
};

const updateInterview = async (req, res, next) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.scheduledBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to update this interview' 
      });
    }

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['job', 'interviewers', 'scheduledBy']);

    res.json({
      success: true,
      message: 'Interview updated successfully',
      interview
    });
  } catch (error) {
    next(error);
  }
};

const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.scheduledBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this interview' 
      });
    }

    await interview.deleteOne();

    res.json({
      success: true,
      message: 'Interview cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ 
      interviewers: req.user._id 
    })
      .populate('job', 'title company')
      .populate('scheduledBy', 'name email')
      .sort('-date');

    res.json({
      success: true,
      count: interviews.length,
      interviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getMyInterviews,
  getInterviewApplicants  
};
