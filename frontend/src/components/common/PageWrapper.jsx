import { useEffect } from 'react';

const PageWrapper = ({ children, title, description }) => {
  useEffect(() => {
    // Add entrance animation
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-8 scroll-reveal">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 text-shadow">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-white text-opacity-90 font-medium">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;