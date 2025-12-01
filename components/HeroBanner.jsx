'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * HeroBanner Component
 * 
 * @param {Object} props
 * @param {string} props.image - Path to banner image
 * @param {string} props.title - Main title text
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.ctaText - Call-to-action button text
 * @param {string} props.ctaHref - Call-to-action button link
 */
export default function HeroBanner({ 
  image, 
  title, 
  subtitle, 
  ctaText, 
  ctaHref 
}) {
  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
        
        {/* Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content Container - RTL Layout (text on the right) */}
      <div className="relative h-full flex items-center justify-end">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg text-right">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              {subtitle}
            </p>
            
            {/* CTA Button */}
            <Link
              href={ctaHref}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              aria-label={`${ctaText} - ${title}`}
            >
              {ctaText}
              <svg 
                className="mr-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Fade-in Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
      
      <div className="absolute inset-0 animate-fade-in" />
    </section>
  );
}
