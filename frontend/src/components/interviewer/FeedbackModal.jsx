// ============================================
// FILE: frontend/src/components/interviewer/FeedbackModal.jsx
// ============================================
import { useState } from 'react';
import api from '../../services/api';

const FeedbackModal = ({ application, interviewId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    technicalSkills: 5,
    communicationSkills: 5,
    problemSolving: 5,
    cultureFit: 5,
    overallRating: 5,
    comments: '',
    recommendation: 'Neutral'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/feedback', {
        application: application._id,
        interview: interviewId,
        ...formData
      });
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Interview Feedback</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Candidate</p>
            <p className="font-semibold">{application.applicant?.name}</p>
            <p className="text-sm text-gray-600">{application.applicant?.email}</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Scales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Skills (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.technicalSkills}
                onChange={(e) => setFormData({ ...formData, technicalSkills: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span className="font-semibold text-blue-600">{formData.technicalSkills}</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Skills (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.communicationSkills}
                onChange={(e) => setFormData({ ...formData, communicationSkills: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span className="font-semibold text-blue-600">{formData.communicationSkills}</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Solving (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.problemSolving}
                onChange={(e) => setFormData({ ...formData, problemSolving: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span className="font-semibold text-blue-600">{formData.problemSolving}</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Culture Fit (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.cultureFit}
                onChange={(e) => setFormData({ ...formData, cultureFit: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span className="font-semibold text-blue-600">{formData.cultureFit}</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating (1-10) *
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.overallRating}
                onChange={(e) => setFormData({ ...formData, overallRating: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span className="font-semibold text-blue-600">{formData.overallRating}</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendation *
              </label>
              <select
                required
                value={formData.recommendation}
                onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Strongly Recommend">Strongly Recommend</option>
                <option value="Recommend">Recommend</option>
                <option value="Neutral">Neutral</option>
                <option value="Not Recommend">Not Recommend</option>
                <option value="Strongly Not Recommend">Strongly Not Recommend</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                rows="4"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Provide detailed feedback about the candidate's performance..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;