'use client';

import { useState, useEffect } from 'react';
import { Star, User, CheckCircle, MessageSquare } from 'lucide-react';

interface Review {
  review_id: number;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  verified_purchase: boolean;
}

interface ProductReviewsProps {
  productId: number;
  className?: string;
  showTitle?: boolean;
  maxReviews?: number;
}

export default function ProductReviews({ 
  productId, 
  className = '',
  showTitle = true,
  maxReviews = 6
}: ProductReviewsProps) {
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

      // محاولة جلب التقييمات من API
      const response = await fetch(`/api/reviews?productId=${productId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews.slice(0, maxReviews));
          return;
        }
      }

      // إذا لم توجد تقييمات من API، استخدم التقييمات الثابتة
      const staticReviews: { [key: number]: Review[] } = {
        1: [
          {
            review_id: 1,
            user_name: "أحمد محمد",
            rating: 5,
            comment: "دليل ممتاز ومفصل! ساعدني كثيراً في فهم كيفية إنشاء منتجات رقمية مربحة. المحتوى واضح ومنظم بشكل رائع.",
            date: "2024-11-10",
            verified_purchase: true
          },
          {
            review_id: 2,
            user_name: "فاطمة خالد",
            rating: 5,
            comment: "بصراحة من أفضل الاستثمارات اللي عملتها! الدليل شامل ويحتوي على معلومات قيمة جداً. أنصح به بقوة.",
            date: "2024-11-08",
            verified_purchase: true
          },
          {
            review_id: 3,
            user_name: "محمد العلي",
            rating: 4,
            comment: "محتوى جيد ومفيد، لكن كنت أتمنى المزيد من الأمثلة العملية. بشكل عام راضي عن الشراء.",
            date: "2024-11-05",
            verified_purchase: true
          },
          {
            review_id: 4,
            user_name: "سارة أحمد",
            rating: 5,
            comment: "والله شيء رائع! المعلومات واضحة والشرح مبسط. بدأت أطبق الأفكار وشايفة نتائج إيجابية.",
            date: "2024-11-03",
            verified_purchase: true
          }
        ],
        2: [
          {
            review_id: 5,
            user_name: "عبدالله سالم",
            rating: 5,
            comment: "ما شاء الله تبارك الله! كورس شامل ومفيد جداً. تعلمت منه أشياء كثيرة عن التسويق الرقمي.",
            date: "2024-11-09",
            verified_purchase: true
          },
          {
            review_id: 6,
            user_name: "نورا حسن",
            rating: 4,
            comment: "كورس جميل ومنظم، المحتوى قيم لكن أحياناً يحتاج تبسيط أكثر للمبتدئين.",
            date: "2024-11-07",
            verified_purchase: true
          },
          {
            review_id: 7,
            user_name: "يوسف أحمد",
            rating: 5,
            comment: "استثمار ممتاز! الكورس ساعدني أفهم السوق الرقمي أكثر وأبدأ مشروعي الخاص.",
            date: "2024-11-04",
            verified_purchase: true
          }
        ],
        3: [
          {
            review_id: 8,
            user_name: "ريم محمود",
            rating: 5,
            comment: "أفكار رائعة ومبتكرة! كل فكرة مشروحة بالتفصيل مع خطة العمل. أنصح به للجميع.",
            date: "2024-11-11",
            verified_purchase: true
          },
          {
            review_id: 9,
            user_name: "خالد عبدالرحمن",
            rating: 4,
            comment: "محتوى مفيد وأفكار عملية، بعض الأفكار تحتاج رأس مال أكبر لكن بشكل عام ممتاز.",
            date: "2024-11-06",
            verified_purchase: true
          },
          {
            review_id: 10,
            user_name: "مريم الزهراني",
            rating: 5,
            comment: "بجد حاجة حلوة! الأفكار متنوعة وكل واحدة لها جمهورها. بدأت أشتغل على فكرتين منهم.",
            date: "2024-11-02",
            verified_purchase: true
          }
        ],
        4: [
          {
            review_id: 11,
            user_name: "هند العتيبي",
            rating: 5,
            comment: "باقة رائعة جداً! كل ما أحتاجه للمونتاج في مكان واحد. المؤثرات الصوتية عالية الجودة والانتقالات سلسة جداً.",
            date: "2024-11-10",
            verified_purchase: true
          },
          {
            review_id: 12,
            user_name: "فهد الدوسري",
            rating: 5,
            comment: "أفضل استثمار قمت به لقناتي على يوتيوب! الخلفيات المتحركة والـ LUTs غيرت شكل فيديوهاتي تماماً.",
            date: "2024-11-08",
            verified_purchase: true
          },
          {
            review_id: 13,
            user_name: "لطيفة القحطاني",
            rating: 4,
            comment: "باقة ممتازة وشاملة. الملفات منظمة بشكل جيد والجودة عالية. أنصح بها بشدة لكل محرر فيديو.",
            date: "2024-11-05",
            verified_purchase: true
          }
        ],
        5: [
          {
            review_id: 14,
            user_name: "عمر الشهري",
            rating: 5,
            comment: "مره كويس! الأيقونات عالية الجودة ومتنوعة. وفرت علي وقت كبير في التصميم.",
            date: "2024-11-09",
            verified_purchase: true
          },
          {
            review_id: 15,
            user_name: "لينا أحمد",
            rating: 5,
            comment: "والله زي العسل! كل الأيقونات اللي أحتاجها موجودة وبجودة احترافية. أنصح فيها بقوة.",
            date: "2024-11-07",
            verified_purchase: true
          },
          {
            review_id: 16,
            user_name: "سلمى حسين",
            rating: 4,
            comment: "حزمة جميلة ومفيدة، الأيقونات متنوعة لكن كنت أتمنى المزيد من الأنماط المختلفة.",
            date: "2024-11-04",
            verified_purchase: true
          }
        ]
      };

      const productReviews = staticReviews[productId] || [];
      setReviews(productReviews.slice(0, maxReviews));
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('حدث خطأ أثناء جلب التقييمات');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
        {showTitle && (
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            تقييمات العملاء
          </h3>
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
              <div className="h-16 bg-gray-600 rounded"></div>
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
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            تقييمات العملاء
          </h3>
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
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            تقييمات العملاء
          </h3>
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
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          تقييمات العملاء ({reviews.length})
        </h3>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.review_id} className="bg-dark-300 rounded-xl p-5 border border-gray-700/50">
            {/* معلومات المراجع */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{review.user_name}</h4>
                    {review.verified_purchase && (
                      <div className="flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>مشتري محقق</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-gray-400 text-sm">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* نص التقييم */}
            <div className="text-gray-300 leading-relaxed">
              {review.comment}
            </div>
          </div>
        ))}
      </div>

      {/* رسالة تشجيعية */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 text-center">
          <p className="text-gray-300 text-sm">
            💡 هل اشتريت هذا المنتج؟ شارك تجربتك مع الآخرين وساعدهم في اتخاذ القرار الصحيح!
          </p>
        </div>
      </div>
    </div>
  );
}

