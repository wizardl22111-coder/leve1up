'use client';

import React, { useState, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4">
        {/* Loading Animation */}
        <div className="mb-8">
          <LoadingAnimation size="large" />
        </div>
        
        {/* Loading Text */}
        {showText && (
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 animate-pulse">
              {loadingText}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageLoader;
