const Application = require('../models/Application');
const Job = require('../models/Job');
const Interview = require('../models/Interview');
const path = require('path');
const { sendApplicationConfirmation, sendInterviewScheduledEmail } = require('../utils/emailService');

// @desc    Submit job application
// @route   POST /api/applications
// @access  Private (Student only)
const createApplication = async (req, res, next) => {
  try {
    const { job, coverLetter } = req.body;

    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: 'You have already applied for this job' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        message: 'Please upload a resume' 
      });
    }

    const resumePath = `/uploads/resumes/${req.file.filename}`;

    const application = await Application.create({
      job,
      applicant: req.user._id,
      resume: resumePath,
      coverLetter
    });

    await application.populate([
      { path: 'job', select: 'title company location type' },
      { path: 'applicant', select: 'name email' }
    ]);

    // Send confirmation email
    try {
      await sendApplicationConfirmation(
        req.user, 
        jobExists, 
        application
      );
      console.log('Application confirmation email sent');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Check your email for confirmation!',
      application
    });
  } catch (error) {
    console.error('Application error:', error);
    next(error);
  }
};

// @desc    Get student's applications
// @route   GET /api/applications/my-applications
// @access  Private (Student only)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ 
      applicant: req.user._id 
    })
      .populate('job', 'title company location type')
      .populate({
        path: 'interview',
        select: 'date time mode meetingLink location notes',
        populate: {
          path: 'interviewers',
          select: 'name email phone'
        }
      })
      .sort('-appliedAt');

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (HR only)
const getJobApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = { job: req.params.jobId };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('applicant', 'name email phone')
      .populate('interview', 'date time mode')
      .sort('-appliedAt');

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email phone')
      .populate({
        path: 'interview',
        populate: {
          path: 'interviewers',
          select: 'name email phone'
        }
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (HR only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, interview } = req.body;

    console.log('Updating application status:', { status, interview });

    // First, get the application with all details
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('job', 'title company location type');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update the application
    application.status = status;
    if (interview) {
      application.interview = interview;
    }
    await application.save();

    // If status is "Interview Scheduled" and interview is provided, send email
    if (status === 'Interview Scheduled' && interview) {
      try {
        console.log('Fetching interview details for email...');
        
        const interviewDetails = await Interview.findById(interview)
          .populate('interviewers', 'name email phone');

        if (interviewDetails) {
          console.log('Sending interview scheduled email to:', application.applicant.email);
          
          await sendInterviewScheduledEmail(
            application.applicant,
            application.job,
            interviewDetails,
            interviewDetails.interviewers
          );

          console.log('✅ Interview scheduled email sent successfully!');
        }
      } catch (emailError) {
        console.error('❌ Failed to send interview email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    // Populate for response
    await application.populate({
      path: 'interview',
      populate: {
        path: 'interviewers',
        select: 'name email phone'
      }
    });

    res.json({
      success: true,
      message: status === 'Interview Scheduled' 
        ? 'Interview scheduled! Email notification sent to candidate.' 
        : 'Application status updated',
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    next(error);
  }
};

// @desc    Assign interview to application
// @route   PUT /api/applications/:id/assign-interview
// @access  Private (HR only)
const assignInterview = async (req, res, next) => {
  try {
    const { interview } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('job', 'title company location type');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application
    application.interview = interview;
    application.status = 'Interview Scheduled';
    await application.save();

    // Send interview scheduled email
    try {
      const interviewDetails = await Interview.findById(interview)
        .populate('interviewers', 'name email phone');
      
      if (interviewDetails) {
        await sendInterviewScheduledEmail(
          application.applicant,
          application.job,
          interviewDetails,
          interviewDetails.interviewers
        );
        console.log('✅ Interview assigned and email sent!');
      }
    } catch (emailError) {
      console.error('❌ Failed to send interview email:', emailError);
    }

    await application.populate({
      path: 'interview',
      populate: {
        path: 'interviewers',
        select: 'name email phone'
      }
    });

    res.json({
      success: true,
      message: 'Interview assigned successfully! Email notification sent to candidate.',
      application
    });
  } catch (error) {
    console.error('Error assigning interview:', error);
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getJobApplications,
  getApplicationById,
  updateApplicationStatus,
  assignInterview
};