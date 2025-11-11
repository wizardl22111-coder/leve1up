'use client';

import { useState, useEffect } from 'react';
import { Star, BarChart3, Users, TrendingUp } from 'lucide-react';

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface ReviewSummaryProps {
  productId: number;
  className?: string;
  showTitle?: boolean;
}

export default function ReviewSummary({ 
  productId, 
  className = '',
  showTitle = true 
}: ReviewSummaryProps) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, [productId]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب التقييمات من الملف المحلي
      const response = await fetch('/data/reviews.json');
      const allReviews = await response.json();
      
      // جلب بيانات المنتجات لمطابقة الأسماء
      const productsResponse = await fetch('/data/products.json');
      const products = await productsResponse.json();
      
      // العثور على المنتج الحالي
      const currentProduct = products.find((p: any) => 
        p.product_id === productId || p.id === productId
      );
      
      if (!currentProduct) {
        setError('لم يتم العثور على المنتج');
        return;
      }
      
      // تصفية التقييمات للمنتج الحالي
      const productReviews = allReviews.filter((review: any) => 
        review.product === currentProduct.product_name
      );
      
      if (productReviews.length === 0) {
        setSummary({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
        return;
      }
      
      // حساب الإحصائيات
      const totalReviews = productReviews.length;
      const totalRating = productReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;
      
      // حساب توزيع التقييمات
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      productReviews.forEach((review: any) => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });
      
      setSummary({
        totalReviews,
        averageRating,
        ratingDistribution
      });
      
    } catch (error) {
      console.error('Error fetching review summary:', error);
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star <= rating
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const getPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const getRatingLabel = (rating: number) => {
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
          <h3 className="text-xl font-bold text-white mb-6">ملخص التقييمات</h3>
        )}
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-600 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-1/4"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 bg-gray-600 rounded w-12"></div>
                <div className="flex-1 h-2 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-xl font-bold text-white mb-6">ملخص التقييمات</h3>
        )}
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={fetchSummary}
            className="text-primary-400 hover:text-primary-300 text-sm underline"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!summary || summary.totalReviews === 0) {
    return (
      <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-xl font-bold text-white mb-6">ملخص التقييمات</h3>
        )}
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">لا توجد تقييمات بعد</p>
          <p className="text-gray-500 text-sm">كن أول من يقيم هذا المنتج!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
      {showTitle && (
        <h3 className="text-xl font-bold text-white mb-6">ملخص التقييمات</h3>
      )}

      {/* التقييم العام */}
      <div className="flex items-center gap-6 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {summary.averageRating.toFixed(1)}
          </div>
          {renderStars(summary.averageRating, 'lg')}
          <div className="text-gray-400 text-sm mt-2">
            من 5.0
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Users className="w-5 h-5" />
            <span className="font-medium">
              {summary.totalReviews} تقييم{summary.totalReviews > 1 ? 'ات' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">
              {getPercentage(summary.ratingDistribution[4] + summary.ratingDistribution[5], summary.totalReviews)}% 
              من العملاء راضون
            </span>
          </div>
        </div>
      </div>

      {/* توزيع التقييمات */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution];
          const percentage = getPercentage(count, summary.totalReviews);
          
          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-20">
                <span className="text-gray-300 text-sm font-medium">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              
              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="w-12 text-right">
                <span className="text-gray-400 text-sm">{count}</span>
              </div>
              
              <div className="w-10 text-right">
                <span className="text-gray-500 text-xs">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* إحصائيات إضافية */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-dark-300 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary-400 mb-1">
              {getPercentage(summary.ratingDistribution[5], summary.totalReviews)}%
            </div>
            <div className="text-gray-400 text-sm">تقييم ممتاز</div>
          </div>
          
          <div className="bg-dark-300 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {getPercentage(
                summary.ratingDistribution[4] + summary.ratingDistribution[5], 
                summary.totalReviews
              )}%
            </div>
            <div className="text-gray-400 text-sm">يوصون بالمنتج</div>
          </div>
        </div>
      </div>
    </div>
  );
}
