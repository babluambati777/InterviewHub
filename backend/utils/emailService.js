const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP settings
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
  }
});

// Send OTP for email verification
const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - InterviewHub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #3B82F6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #3B82F6; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to InterviewHub! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for registering with InterviewHub. To complete your registration, please verify your email address.</p>
            
            <p>Your One-Time Password (OTP) is:</p>
            <div class="otp-box">${otp}</div>
            
            <p><strong>This OTP will expire in 10 minutes.</strong></p>
            
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2026 InterviewHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Send application confirmation email
const sendApplicationConfirmation = async (applicant, job, application) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: applicant.email,
    subject: `Application Received - ${job.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .info-box { background: white; border-left: 4px solid #3B82F6; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .status-badge { display: inline-block; background: #3B82F6; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Application Received!</h1>
          </div>
          <div class="content">
            <h2>Hi ${applicant.name},</h2>
            <p>Your application has been successfully submitted!</p>
            
            <div class="info-box">
              <h3>Job Details</h3>
              <p><strong>Position:</strong> ${job.title}</p>
              <p><strong>Company:</strong> ${job.company}</p>
              <p><strong>Location:</strong> ${job.location || 'Not specified'}</p>
              <p><strong>Type:</strong> ${job.type}</p>
              <p><strong>Applied On:</strong> ${new Date(application.appliedAt).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            
            <div class="info-box">
              <h3>Application Status</h3>
              <p><span class="status-badge">${application.status}</span></p>
              <p>We'll notify you when there are updates on your application.</p>
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>Our HR team will review your application</li>
              <li>If shortlisted, you'll receive an interview invitation</li>
              <li>Check your dashboard regularly for updates</li>
            </ul>
            
            <p>Best of luck! 🍀</p>
          </div>
          <div class="footer">
            <p>© 2026 InterviewHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Application confirmation sent to:', applicant.email);
    return true;
  } catch (error) {
    console.error('Error sending application email:', error);
    return false;
  }
};

// Send interview scheduled email
const sendInterviewScheduledEmail = async (applicant, job, interview, interviewers) => {
  const interviewersList = interviewers.map(i => 
    `<li><strong>${i.name}</strong> - ${i.email}</li>`
  ).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: applicant.email,
    subject: `Interview Scheduled - ${job.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .highlight-box { background: linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 100%); border: 2px solid #8B5CF6; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
          .info-box { background: white; border-left: 4px solid #8B5CF6; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .date-time { font-size: 24px; font-weight: bold; color: #8B5CF6; margin: 10px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Interview Scheduled!</h1>
          </div>
          <div class="content">
            <h2>Congratulations ${applicant.name}! 🎉</h2>
            <p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been shortlisted!</p>
            
            <div class="highlight-box">
              <h3>📆 Interview Details</h3>
              <div class="date-time">
                ${new Date(interview.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div class="date-time">⏰ ${interview.time}</div>
              <p><strong>Mode:</strong> ${interview.mode}</p>
              ${interview.location ? `<p><strong>Location:</strong> ${interview.location}</p>` : ''}
            </div>
            
            ${interview.meetingLink ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${interview.meetingLink}" class="button">Join Interview Meeting</a>
              </div>
            ` : ''}
            
            <div class="info-box">
              <h3>👥 Your Interviewers</h3>
              <ul>
                ${interviewersList}
              </ul>
            </div>
            
            ${interview.notes ? `
              <div class="info-box">
                <h3>📝 Additional Notes</h3>
                <p>${interview.notes}</p>
              </div>
            ` : ''}
            
            <div class="info-box">
              <h3>💡 Preparation Tips</h3>
              <ul>
                <li>Review the job description and requirements</li>
                <li>Research about ${job.company}</li>
                <li>Prepare questions to ask the interviewers</li>
                <li>Test your internet connection and camera (for video calls)</li>
                <li>Join 5 minutes early</li>
                <li>Dress professionally</li>
              </ul>
            </div>
            
            <p>Good luck! We're excited to meet you! 🚀</p>
          </div>
          <div class="footer">
            <p>© 2026 InterviewHub. All rights reserved.</p>
            <p>If you need to reschedule, please contact us immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Interview scheduled email sent to:', applicant.email);
    return true;
  } catch (error) {
    console.error('Error sending interview email:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendApplicationConfirmation,
  sendInterviewScheduledEmail
};