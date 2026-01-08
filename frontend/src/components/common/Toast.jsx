import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-pink-600',
    warning: 'from-yellow-500 to-orange-600',
    info: 'from-blue-500 to-purple-600'
  };

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slideInRight">
      <div className="toast flex items-center gap-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${colors[type]} rounded-full flex items-center justify-center text-white text-xl`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;