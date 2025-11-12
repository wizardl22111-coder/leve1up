'use client';

import { Star, Quote, CheckCircle, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import testimonials from '@/data/testimonials.json';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

interface Review {
  id: string;
  productId: number;
  authorName: string;
  rating: number;
  reviewBody: string;
  createdAt: string;
  approved: boolean;
}

export default function TestimonialsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [realReviews, setRealReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب التقييمات الحقيقية من قاعدة البيانات
  useEffect(() => {
    fetchRealReviews();
  }, []);

  const fetchRealReviews = async () => {
    try {
      const response = await fetch('/api/reviews/all');
      const data = await response.json();
      
      if (data.success && data.reviews) {
        // أخذ أحدث 10 تقييمات معتمدة
        const approvedReviews = data.reviews
          .filter((review: Review) => review.approved)
          .sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
        
        setRealReviews(approvedReviews);
      }
    } catch (error) {
      console.error('❌ Error fetching real reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // دمج التقييمات الحقيقية مع التقييمات الثابتة
  const allTestimonials = [
    ...realReviews.map(review => ({
      id: review.id,
      name: review.authorName,
      rating: review.rating,
      text: review.reviewBody, // استخدام text بدلاً من comment
      timeAgo: new Date(review.createdAt).toLocaleDateString('ar-SA'),
      verified: true,
      productId: review.productId,
      avatar: null // لا توجد صور للمراجعين الحقيقيين
    })),
    ...testimonials.slice(0, Math.max(0, 10 - realReviews.length)) // ملء الباقي بالتقييمات الثابتة
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-dark-400 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-600/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-300/5 rounded-full filter blur-3xl"></div>
      
      <div className="container-mobile relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-4 py-2 rounded-full mb-4 border border-primary-300/30">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold">تقييمات حقيقية</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
            آراء{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
              عملائنا
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            ماذا يقول عملاؤنا عن خدماتنا وجودة منتجاتنا
          </p>
        </div>

        {/* Scrollable Container with Navigation Buttons */}
        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-primary-300/20 backdrop-blur-sm border border-primary-300/30 text-primary-300 hover:bg-primary-300/30 transition-all"
            aria-label="التقييم السابق"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-primary-300/20 backdrop-blur-sm border border-primary-300/30 text-primary-300 hover:bg-primary-300/30 transition-all"
            aria-label="التقييم التالي"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scrollable Testimonials */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] snap-start"
                >
                  <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-primary-300/10 h-full flex flex-col animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-8 h-8 bg-gray-600 rounded"></div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-gray-600 rounded"></div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 flex-grow">
                      <div className="h-4 bg-gray-600 rounded w-full"></div>
                      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <div className="pt-4 border-t border-primary-300/10">
                      <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              allTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] snap-start"
                >
                  <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 hover:shadow-xl hover:shadow-primary-300/10 transition-all duration-300 h-full flex flex-col">
                    {/* Quote Icon and Stars */}
                    <div className="flex justify-between items-start mb-4">
                      <Quote className="w-8 h-8 text-primary-300/30 transition-colors" />
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              i < Math.floor(testimonial.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 leading-relaxed flex-grow">
                      "{testimonial.text}"
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-2 pt-4 border-t border-primary-300/10 mt-auto">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm sm:text-base font-bold text-white truncate">
                            {testimonial.name}
                          </p>
                          {testimonial.verified && (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          )}
                        </div>
                        {testimonial.verified && (
                          <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                            <ShoppingBag className="w-3 h-3" />
                            عميل حقيقي
                          </p>
                        )}
                        {testimonial.productId && (
                          <p className="text-xs text-blue-400 mt-0.5">منتج #{testimonial.productId}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {testimonial.timeAgo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <p className="text-center text-xs text-gray-500 mt-4 md:hidden">
          ← مرر لرؤية المزيد →
        </p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
