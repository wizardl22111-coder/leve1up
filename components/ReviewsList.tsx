'use client';

import { useState, useEffect } from 'react';
import { Star, User, Calendar, CheckCircle, ThumbsUp, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  verified: boolean;
  helpful: number;
}

interface ReviewsListProps {
  productId: number;
  className?: string;
  showTitle?: boolean;
  maxReviews?: number;
}

export default function ReviewsList({ 
  productId, 
  className = '',
  showTitle = true,
  maxReviews 
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/reviews?productId=${productId}`);
      const data = await response.json();

      if (data.success) {
        let reviewsData = data.reviews || [];
        
        // تطبيق الحد الأقصى إذا تم تحديده
        if (maxReviews && reviewsData.length > maxReviews) {
          reviewsData = reviewsData.slice(0, maxReviews);
        }
        
        setReviews(reviewsData);
      } else {
        setError(data.message || 'حدث خطأ أثناء جلب التقييمات');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'تاريخ غير محدد';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return 'ممتاز';
      case 4: return 'جيد جداً';
      case 3: return 'جيد';
      case 2: return 'مقبول';
      case 1: return 'ضعيف';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-xl font-bold text-white mb-6">آراء العملاء</h3>
        )}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-xl font-bold text-white mb-6">آراء العملاء</h3>
        )}
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={fetchReviews}
            className="text-primary-400 hover:text-primary-300 text-sm underline"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-xl font-bold text-white mb-6">آراء العملاء</h3>
        )}
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">لا توجد تقييمات بعد</p>
          <p className="text-gray-500 text-sm">كن أول من يقيم هذا المنتج!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">آراء العملاء</h3>
          <span className="text-gray-400 text-sm">
            {reviews.length} تقييم{reviews.length > 1 ? 'ات' : ''}
          </span>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-700 last:border-b-0 pb-6 last:pb-0"
          >
            {/* معلومات المراجع */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{review.authorName}</h4>
                    {review.verified && (
                      <div className="flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>مشترٍ موثق</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-gray-400 text-sm">
                      {getRatingText(review.rating)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(review.createdAt)}</span>
              </div>
            </div>

            {/* عنوان التقييم */}
            <h5 className="font-semibold text-white mb-2">{review.title}</h5>

            {/* محتوى التقييم */}
            <p className="text-gray-300 leading-relaxed mb-4">{review.body}</p>

            {/* أزرار التفاعل */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors text-sm">
                <ThumbsUp className="w-4 h-4" />
                <span>مفيد ({review.helpful || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* رابط عرض المزيد إذا كان هناك حد أقصى */}
      {maxReviews && reviews.length === maxReviews && (
        <div className="text-center mt-6 pt-6 border-t border-gray-700">
          <button className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            عرض جميع التقييمات
          </button>
        </div>
      )}
    </div>
  );
}
