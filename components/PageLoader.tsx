'use client';

import React, { useState, useEffect } from 'react';

interface PageLoaderProps {
  children: React.ReactNode;
  delay?: number; // بالميلي ثانية، افتراضي 2000 (2 ثانية)
  showText?: boolean;
  loadingText?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  children, 
  delay = 2000,
  showText = true,
  loadingText = "جاري التحميل..."
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
        {/* Loading Text */}
        {showText && (
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {loadingText}
            </h2>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default PageLoader;
