'use client';

import { useState, useEffect } from 'react';
import { Star, User, Quote } from 'lucide-react';
import { getProductReviews, getStoredReviews, type RealisticReview } from '@/lib/realistic-reviews';

interface ProductReviewsProps {
  productId: number;
  reviews?: RealisticReview[];
}

export default function ProductReviews({ productId, reviews: initialReviews = [] }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<RealisticReview[]>(initialReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // استخدام النظام الجديد لجلب التقييمات مع دمج التقييمات المحفوظة محلياً
      const productReviews = await getProductReviews(productId);
      
      setReviews(productReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };



  if (loading) {
    return (
      <section className="py-16 px-4 bg-dark-400 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-600/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-300/5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
            تقييمات العملاء
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-300/10 animate-pulse"
              >
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 px-4 bg-dark-400 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-600/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-300/5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
            تقييمات العملاء
          </h2>
          <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto border border-primary-300/10">
            <Quote size={48} className="mx-auto mb-4 text-primary-300/30" />
            <p className="text-gray-300 text-lg">
              كن أول من يترك تقييماً! 🌟
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-dark-400 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-600/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-300/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
          تقييمات العملاء
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-96 overflow-y-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-300/10 hover:border-primary-300/30 hover:shadow-xl hover:shadow-primary-300/10 transition-all duration-300"
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.customerName}
                      className="w-[70px] h-[70px] rounded-full object-cover border-2 border-primary-300/20"
                    />
                  ) : (
                    <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-primary-300 to-accent-600 flex items-center justify-center text-white">
                      <User size={28} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">
                      {review.customerName}
                    </h3>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {/* التعليق */}
              {review.comment && review.type !== 'stars_only' && (
                <div className="relative">
                  <Quote
                    size={24}
                    className="absolute -top-2 -right-2 text-primary-300/30"
                  />
                  <p className="text-gray-300 leading-relaxed pr-6">
                    {review.comment}
                  </p>
                </div>
              )}

              {/* شارة التحقق */}
              <div className="mt-4 pt-4 border-t border-primary-300/10">
                <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                  ✓ عميل موثّق
                </span>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
