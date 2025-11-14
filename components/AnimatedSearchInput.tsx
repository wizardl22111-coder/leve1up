'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface AnimatedSearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  className?: string;
}

const AnimatedSearchInput: React.FC<AnimatedSearchInputProps> = ({
  placeholder = "البحث في المنتجات...",
  onSearch,
  onFilter,
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterClick = () => {
    if (onFilter) {
      onFilter();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background Grid */}
      <div className="animated-search-grid"></div>
      
      {/* Main Container */}
      <div 
        id="search-container" 
        className="animated-search-container"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Glow Effects */}
        <div className="animated-search-glow"></div>
        <div className="animated-search-dark-border"></div>
        <div className="animated-search-white"></div>
        <div className="animated-search-border"></div>

        {/* Input Container */}
        <div className="animated-search-main">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="animated-search-input"
            dir="rtl"
          />
          
          {/* Input Mask */}
          {!isFocused && !searchQuery && (
            <div className="animated-search-input-mask"></div>
          )}
          
          {/* Pink Mask */}
          <div className="animated-search-pink-mask"></div>
          
          {/* Filter Button */}
          <div className="animated-search-filter-border"></div>
          <button
            onClick={handleFilterClick}
            className="animated-search-filter-icon"
            type="button"
            aria-label="فلترة النتائج"
          >
            <Filter size={20} className="text-gray-300" />
          </button>
          
          {/* Search Icon */}
          <div className="animated-search-icon">
            <Search size={20} className="text-primary-400" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .animated-search-grid {
          height: 800px;
          width: 800px;
          background-image: linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px);
          background-size: 1rem 1rem;
          background-position: center center;
          position: absolute;
          z-index: -1;
          filter: blur(1px);
          opacity: 0.3;
        }

        .animated-search-container {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .animated-search-glow,
        .animated-search-border,
        .animated-search-dark-border,
        .animated-search-white {
          max-height: 70px;
          max-width: 314px;
          height: 100%;
          width: 100%;
          position: absolute;
          overflow: hidden;
          z-index: -1;
          border-radius: 12px;
          filter: blur(3px);
        }

        .animated-search-input {
          background-color: #0f172a;
          border: none;
          width: 301px;
          height: 56px;
          border-radius: 10px;
          color: white;
          padding-inline: 59px;
          font-size: 18px;
          font-family: inherit;
        }

        .animated-search-input::placeholder {
          color: #64748b;
        }

        .animated-search-input:focus {
          outline: none;
        }

        .animated-search-container:focus-within .animated-search-input-mask {
          display: none;
        }

        .animated-search-input-mask {
          pointer-events: none;
          width: 100px;
          height: 20px;
          position: absolute;
          background: linear-gradient(90deg, transparent, #0f172a);
          top: 18px;
          right: 70px;
        }

        .animated-search-pink-mask {
          pointer-events: none;
          width: 30px;
          height: 20px;
          position: absolute;
          background: #e11d48;
          top: 10px;
          right: 5px;
          filter: blur(20px);
          opacity: 0.8;
          transition: all 2s;
        }

        .animated-search-container:hover .animated-search-pink-mask {
          opacity: 0;
        }

        .animated-search-white {
          max-height: 63px;
          max-width: 307px;
          border-radius: 10px;
          filter: blur(2px);
        }

        .animated-search-white::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(83deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.4);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0) 0%,
            #3b82f6,
            rgba(0, 0, 0, 0) 8%,
            rgba(0, 0, 0, 0) 50%,
            #e11d48,
            rgba(0, 0, 0, 0) 58%
          );
          transition: all 2s;
        }

        .animated-search-border {
          max-height: 59px;
          max-width: 303px;
          border-radius: 11px;
          filter: blur(0.5px);
        }

        .animated-search-border::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(70deg);
          position: absolute;
          width: 600px;
          height: 600px;
          filter: brightness(1.3);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #1e293b,
            #2563eb 5%,
            #1e293b 14%,
            #1e293b 50%,
            #dc2626 60%,
            #1e293b 64%
          );
          transition: all 2s;
        }

        .animated-search-dark-border {
          max-height: 65px;
          max-width: 312px;
        }

        .animated-search-dark-border::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(82deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #1e40af,
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            #991b1b,
            rgba(0, 0, 0, 0) 60%
          );
          transition: all 2s;
        }

        .animated-search-container:hover .animated-search-dark-border::before {
          transform: translate(-50%, -50%) rotate(-98deg);
        }

        .animated-search-container:hover .animated-search-glow::before {
          transform: translate(-50%, -50%) rotate(-120deg);
        }

        .animated-search-container:hover .animated-search-white::before {
          transform: translate(-50%, -50%) rotate(-97deg);
        }

        .animated-search-container:hover .animated-search-border::before {
          transform: translate(-50%, -50%) rotate(-110deg);
        }

        .animated-search-container:focus-within .animated-search-dark-border::before {
          transform: translate(-50%, -50%) rotate(442deg);
          transition: all 4s;
        }

        .animated-search-container:focus-within .animated-search-glow::before {
          transform: translate(-50%, -50%) rotate(420deg);
          transition: all 4s;
        }

        .animated-search-container:focus-within .animated-search-white::before {
          transform: translate(-50%, -50%) rotate(443deg);
          transition: all 4s;
        }

        .animated-search-container:focus-within .animated-search-border::before {
          transform: translate(-50%, -50%) rotate(430deg);
          transition: all 4s;
        }

        .animated-search-glow {
          overflow: hidden;
          filter: blur(30px);
          opacity: 0.4;
          max-height: 130px;
          max-width: 354px;
        }

        .animated-search-glow:before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(60deg);
          position: absolute;
          width: 999px;
          height: 999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #000,
            #2563eb 5%,
            #000 38%,
            #000 50%,
            #dc2626 60%,
            #000 87%
          );
          transition: all 2s;
        }

        .animated-search-filter-icon {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          max-height: 40px;
          max-width: 38px;
          height: 100%;
          width: 100%;
          isolation: isolate;
          overflow: hidden;
          border-radius: 10px;
          background: linear-gradient(180deg, #1e293b, #0f172a, #1e40af);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .animated-search-filter-icon:hover {
          background: linear-gradient(180deg, #334155, #1e293b, #2563eb);
          transform: scale(1.05);
        }

        .animated-search-filter-border {
          height: 42px;
          width: 40px;
          position: absolute;
          overflow: hidden;
          top: 7px;
          left: 7px;
          border-radius: 10px;
        }

        .animated-search-filter-border::before {
          content: "";
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.35);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #475569,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0) 50%,
            #475569,
            rgba(0, 0, 0, 0) 100%
          );
          animation: rotate 4s linear infinite;
        }

        .animated-search-main {
          position: relative;
        }

        .animated-search-icon {
          position: absolute;
          right: 20px;
          top: 15px;
          z-index: 1;
        }

        @keyframes rotate {
          100% {
            transform: translate(-50%, -50%) rotate(450deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedSearchInput;
