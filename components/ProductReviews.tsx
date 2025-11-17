'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Filter, ChevronDown, MapPin, CheckCircle } from 'lucide-react';

interface Review {
  review_id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment?: string;
  date: string;
  verified_purchase: boolean;
  location?: string;
}

interface ProductReviewsProps {
  productId: number;
  reviews: Review[];
}

export default function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (selectedRating) {
      filtered = filtered.filter(review => review.rating === selectedRating);
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, selectedRating, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getLocationFlag = (location?: string) => {
    if (!location) return '🌍';
    
    if (location.includes('السعودية')) return '🇸🇦';
    if (location.includes('الإمارات')) return '🇦🇪';
    if (location.includes('الكويت')) return '🇰🇼';
    if (location.includes('قطر')) return '🇶🇦';
    if (location.includes('عمان')) return '🇴🇲';
    if (location.includes('البحرين')) return '🇧🇭';
    if (location.includes('مصر')) return '🇪🇬';
    if (location.includes('الأردن')) return '🇯🇴';
    if (location.includes('العراق')) return '🇮🇶';
    if (location.includes('لبنان')) return '🇱🇧';
    if (location.includes('سوريا')) return '🇸🇾';
    
    return '🌍';
  };

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();
  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 8);

  return (
    <div className="bg-dark-400 rounded-2xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">التقييمات والمراجعات</h2>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-primary-400">{averageRating}</span>
          <div className="flex items-center gap-1">
            {renderStars(Math.round(parseFloat(averageRating)))}
          </div>
          <span className="text-gray-400">({reviews.length} تقييم)</span>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">توزيع التقييمات</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-white w-8">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-dark-300 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${reviews.length > 0 ? (distribution[rating as keyof typeof distribution] / reviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-gray-400 w-8 text-sm">
                  {distribution[rating as keyof typeof distribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">تصفية التقييمات</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">تصفية حسب النجوم</label>
              <select
                value={selectedRating || ''}
                onChange={(e) => setSelectedRating(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full bg-dark-300 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none"
              >
                <option value="">جميع التقييمات</option>
                <option value="5">5 نجوم</option>
                <option value="4">4 نجوم</option>
                <option value="3">3 نجوم</option>
                <option value="2">نجمتان</option>
                <option value="1">نجمة واحدة</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">ترتيب حسب</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-dark-300 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="highest">الأعلى تقييماً</option>
                <option value="lowest">الأقل تقييماً</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.review_id} className="bg-dark-300 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {review.user_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold">{review.user_name}</h4>
                    {review.verified_purchase && (
                      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>مشتري موثق</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    {review.location && (
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <span className="text-base">{getLocationFlag(review.location)}</span>
                        <span>{review.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                {new Date(review.date).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {review.comment ? (
              <div className="bg-dark-400 rounded-lg p-4 border-r-4 border-primary-500">
                <p className="text-gray-200 leading-relaxed">{review.comment}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 italic">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>تقييم بالنجوم فقط</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {filteredReviews.length > 8 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {showAll ? 'عرض أقل' : `عرض جميع التقييمات (${filteredReviews.length})`}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      {/* Review Summary */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400 mb-1">
              {reviews.filter(r => r.rating === 5).length}
            </div>
            <div className="text-gray-400 text-sm">تقييم 5 نجوم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {reviews.filter(r => r.verified_purchase).length}
            </div>
            <div className="text-gray-400 text-sm">مشتري موثق</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {new Set(reviews.map(r => r.location?.split('،')[1] || 'غير محدد')).size}
            </div>
            <div className="text-gray-400 text-sm">دولة مختلفة</div>
          </div>
        </div>
      </div>
    </div>
  );
}

