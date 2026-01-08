// ============================================
// FILE: frontend/src/components/student/MyApplications.jsx (COMPLETE)
// ============================================
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getResumeUrl, getStatusColor, getStatusIcon } from '../../utils/helpers';

const MyApplications = ({ onUpdate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/applications/my-applications');
      setApplications(data.applications);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
        <div className="animate-bounce">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
        <p className="mt-2 text-gray-500">Start by browsing and applying to jobs</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">
          Your Applications 
          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {applications.length}
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {applications.map((application, index) => (
          <div
            key={application._id}
            className="border rounded-xl p-6 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {application.job?.company?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {application.job?.title}
                    </h3>
                    <p className="text-gray-600">{application.job?.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 text-sm rounded-full border font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)} {application.status}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedApp(selectedApp === application._id ? null : application._id)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                {selectedApp === application._id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {selectedApp === application._id && (
              <div className="mt-6 pt-6 border-t animate-slideDown">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Job Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Type:</span> <span className="font-medium">{application.job?.type}</span></p>
                      {application.job?.location && (
                        <p><span className="text-gray-600">Location:</span> <span className="font-medium">{application.job.location}</span></p>
                      )}
                      {application.job?.salary?.min && (
                        <p>
                          <span className="text-gray-600">Salary:</span>{' '}
                          <span className="font-medium text-green-600">
                            ${application.job.salary.min.toLocaleString()} - ${application.job.salary.max.toLocaleString()}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {application.interview && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                      <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Interview Scheduled! 🎉
                      </h4>
                      
                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Date</p>
                          <p className="font-bold text-gray-900 text-sm">
                            {new Date(application.interview.date).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Time</p>
                          <p className="font-bold text-gray-900 text-sm">{application.interview.time}</p>
                        </div>
                      </div>

                      {/* Mode */}
                      <div className="bg-white p-3 rounded-lg mb-3">
                        <p className="text-xs text-gray-600 mb-1">Interview Mode</p>
                        <p className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                          {application.interview.mode === 'Video Call' && '📹'}
                          {application.interview.mode === 'In-person' && '🏢'}
                          {application.interview.mode === 'Phone' && '📞'}
                          {application.interview.mode}
                        </p>
                      </div>

                      {/* Location or Meeting Link */}
                      {application.interview.mode === 'In-person' && application.interview.location && (
                        <div className="bg-white p-3 rounded-lg mb-3">
                          <p className="text-xs text-gray-600 mb-1">Location</p>
                          <p className="font-bold text-gray-900 text-sm">📍 {application.interview.location}</p>
                        </div>
                      )}

                      {application.interview.meetingLink && (
                        <div className="mb-3">
                          <a
                            href={application.interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg font-semibold text-sm"
                          >
                            🎥 Join Interview Meeting
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Full Interview Details Section */}
                {application.interview && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 mb-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Complete Interview Information
                    </h4>

                    {/* Interviewers */}
                    {application.interview.interviewers && application.interview.interviewers.length > 0 && (
                      <div className="bg-white p-5 rounded-lg mb-4">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Your Interviewers
                        </h5>
                        <div className="space-y-3">
                          {application.interview.interviewers.map((interviewer, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">
                                  {interviewer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{interviewer.name}</p>
                                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  {interviewer.email}
                                </div>
                                {interviewer.phone && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {interviewer.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {application.interview.notes && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Important Notes
                        </h5>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{application.interview.notes}</p>
                      </div>
                    )}

                    {/* Preparation Tips */}
                    <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg mt-4">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Interview Preparation Tips
                      </h5>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">✓</span>
                          <span>Review the job description and requirements thoroughly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">✓</span>
                          <span>Research about {application.job?.company} and their products/services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">✓</span>
                          <span>Prepare questions to ask the interviewers</span>
                        </li>
                        {application.interview.mode === 'Video Call' && (
                          <>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">✓</span>
                              <span>Test your internet connection, camera, and microphone</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">✓</span>
                              <span>Join 5 minutes early to handle any technical issues</span>
                            </li>
                          </>
                        )}
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">✓</span>
                          <span>Dress professionally and ensure a quiet environment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">✓</span>
                          <span>Prepare examples of your past work and achievements</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {application.coverLetter && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Your Cover Letter
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                <div>
                  <a
                    href={getResumeUrl(application.resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Submitted Resume
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;