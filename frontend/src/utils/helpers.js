export const getResumeUrl = (resumePath) => {
  if (!resumePath) return '';
  
  // If it's already a full URL, return it
  if (resumePath.startsWith('http://') || resumePath.startsWith('https://')) {
    return resumePath;
  }
  
  // Get base URL from environment or default to localhost
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  // Ensure the path starts with /
  const path = resumePath.startsWith('/') ? resumePath : `/${resumePath}`;
  
  return `${baseUrl}${path}`;
};

export const getStatusColor = (status) => {
  const colors = {
    'Applied': 'bg-blue-100 text-blue-800 border-blue-200',
    'Under Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Interview Scheduled': 'bg-purple-100 text-purple-800 border-purple-200',
    'Selected': 'bg-green-100 text-green-800 border-green-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200',
    'On Hold': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getStatusIcon = (status) => {
  const icons = {
    'Applied': '📄',
    'Under Review': '🔍',
    'Interview Scheduled': '📅',
    'Selected': '✅',
    'Rejected': '❌',
    'On Hold': '⏸️'
  };
  return icons[status] || '📄';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date, time) => {
  const dateStr = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  return `${dateStr} at ${time}`;
};