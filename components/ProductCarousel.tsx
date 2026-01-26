'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Array<{
    id: number;
    title: string;
    image: string;
    price: number;
    originalPrice?: number;
    currency: string;
    badge?: string;
    badgeColor?: string;
    category: string;
    rating: number;
    link: string;
  }>;
  title?: string;
  className?: string;
  cardSize?: 'small' | 'medium' | 'large';
}

export default function ProductCarousel({ 
  products, 
  title, 
  className = '',
  cardSize = 'medium'
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [products]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 300;
      const scrollAmount = cardWidth + 24; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 300;
      const scrollAmount = cardWidth + 24; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Title */}
      {title && (
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
          {title}
        </h3>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        {products.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-400/90 backdrop-blur-sm border border-primary-300/20 flex items-center justify-center transition-all duration-300 ${
                canScrollLeft 
                  ? 'text-white hover:bg-primary-600/20 hover:border-primary-300/40 hover:scale-110' 
                  : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-400/90 backdrop-blur-sm border border-primary-300/20 flex items-center justify-center transition-all duration-300 ${
                canScrollRight 
                  ? 'text-white hover:bg-primary-600/20 hover:border-primary-300/40 hover:scale-110' 
                  : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Products Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-72 sm:w-80"
            >
              <ProductCard 
                product={product} 
                size={cardSize}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicators */}
      {products.length > 3 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(products.length / 3) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / 3) === index
                  ? 'bg-primary-400 w-6'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 300;
                  const scrollAmount = (cardWidth + 24) * 3 * index;
                  scrollContainerRef.current.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                  });
                }
              }}
              aria-label={`الانتقال إلى المجموعة ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
