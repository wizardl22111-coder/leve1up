'use client';

import React from 'react';

interface LoadingAnimationProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32', 
    large: 'w-48 h-48'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          width="100%"
          height="100%"
          viewBox="-5 -5 40 40"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>

          <circle fill="#4b0082" r="0.1" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#5c00a3" r="0.15" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.05s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#6d00c4" r="0.2" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.1s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#7e00e5" r="0.25" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.15s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#8f00ff" r="0.3" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.2s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#00b7eb" r="0.35" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.25s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#00d4ff" r="0.4" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.3s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#00f0ff" r="0.45" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.35s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#e0ffff" r="0.5" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.4s"
              dur="3.5s"
            ></animateMotion>
          </circle>
          <circle fill="#ffffff" r="0.55" filter="url(#glow)">
            <animateMotion
              path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
              repeatCount="indefinite"
              begin="-0.45s"
              dur="3.5s"
            ></animateMotion>
          </circle>

          <circle fill="#00f0ff" r="0.3" filter="url(#glow)">
            <animateMotion
              path="M 0.4 11.6 C 2.1 3.3 28 7 23.8 17.8 C 21.9 22.9 14.2 30.5 9.9 27.3 C 1.4 20.9 17.5 -1.4 23.8 0.5 C 31.5 2.9 25.2 20.5 12.6 18.7 C 10 18.3 -0.4 15.9 0.4 11.6 Z"
              repeatCount="indefinite"
              begin="-0.1s"
              dur="4s"
            ></animateMotion>
          </circle>
          <circle fill="#66f8ff" r="0.35" filter="url(#glow)">
            <animateMotion
              path="M 0.4 11.6 C 2.1 3.3 28 7 23.8 17.8 C 21.9 22.9 14.2 30.5 9.9 27.3 C 1.4 20.9 17.5 -1.4 23.8 0.5 C 31.5 2.9 25.2 20.5 12.6 18.7 C 10 18.3 -0.4 15.9 0.4 11.6 Z"
              repeatCount="indefinite"
              begin="-0.15s"
              dur="4s"
            ></animateMotion>
          </circle>
          <circle fill="#99fbff" r="0.4" filter="url(#glow)">
            <animateMotion
              path="M 0.4 11.6 C 2.1 3.3 28 7 23.8 17.8 C 21.9 22.9 14.2 30.5 9.9 27.3 C 1.4 20.9 17.5 -1.4 23.8 0.5 C 31.5 2.9 25.2 20.5 12.6 18.7 C 10 18.3 -0.4 15.9 0.4 11.6 Z"
              repeatCount="indefinite"
              begin="-0.2s"
              dur="4s"
            ></animateMotion>
          </circle>
          <circle fill="#ccfdff" r="0.45" filter="url(#glow)">
            <animateMotion
              path="M 0.4 11.6 C 2.1 3.3 28 7 23.8 17.8 C 21.9 22.9 14.2 30.5 9.9 27.3 C 1.4 20.9 17.5 -1.4 23.8 0.5 C 31.5 2.9 25.2 20.5 12.6 18.7 C 10 18.3 -0.4 15.9 0.4 11.6 Z"
              repeatCount="indefinite"
              begin="-0.25s"
              dur="4s"
            ></animateMotion>
          </circle>
          <circle fill="#ffffff" r="0.5" filter="url(#glow)">
            <animateMotion
              path="M 0.4 11.6 C 2.1 3.3 28 7 23.8 17.8 C 21.9 22.9 14.2 30.5 9.9 27.3 C 1.4 20.9 17.5 -1.4 23.8 0.5 C 31.5 2.9 25.2 20.5 12.6 18.7 C 10 18.3 -0.4 15.9 0.4 11.6 Z"
              repeatCount="indefinite"
              begin="-0.3s"
              dur="4s"
            ></animateMotion>
          </circle>
        </svg>
      </div>
    </div>
  );
};

export default LoadingAnimation;
