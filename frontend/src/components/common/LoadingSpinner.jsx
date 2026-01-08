const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="spinner mb-4"></div>
      <p className="text-white font-medium animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;