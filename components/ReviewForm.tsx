'use client';

import { useState, useEffect } from 'react';
import { Star, Send, User, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  productId: number;
  productName: string;
  onReviewAdded?: (review: any) => void;
  className?: string;
}

export default function ReviewForm({ 
  productId, 
  productName, 
  onReviewAdded,
  className = '' 
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    authorName: '',
    rating: 0,
    reviewBody: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    details?: string;
  } | null>(null);

  const [hoveredRating, setHoveredRating] = useState(0);

  // جلب الاسم من localStorage عند تحميل المكون
  useEffect(() => {
    const savedName = localStorage.getItem('customerName') || 
                     localStorage.getItem('userName') || 
                     localStorage.getItem('name') || '';

    if (savedName) {
      setFormData(prev => ({
        ...prev,
        authorName: savedName,
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // مسح الرسائل عند التعديل
    if (message) {
      setMessage(null);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
    
    if (message) {
      setMessage(null);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.authorName.trim()) {
      return 'الاسم مطلوب';
    }

    if (formData.rating === 0) {
      return 'يرجى اختيار تقييم من 1 إلى 5 نجوم';
    }

    if (!formData.reviewBody.trim()) {
      return 'تفاصيل التقييم مطلوبة';
    }

    if (formData.reviewBody.length > 1000) {
      return 'تفاصيل التقييم يجب أن تكون أقل من 1000 حرف';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    const validationError = validateForm();
    if (validationError) {
      setMessage({
        type: 'error',
        text: validationError,
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || 'تم إضافة التقييم بنجاح!',
        });

        // حفظ البيانات في localStorage للمرات القادمة
        localStorage.setItem('customerName', formData.authorName);

        // إعادة تعيين النموذج
        setFormData(prev => ({
          ...prev,
          rating: 0,
          reviewBody: '',
        }));

        // إشعار المكون الأب
        if (onReviewAdded && data.review) {
          onReviewAdded(data.review);
        }

      } else {
        setMessage({
          type: 'error',
          text: data.message || 'حدث خطأ أثناء إضافة التقييم',
          details: data.details,
        });
      }

    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage({
        type: 'error',
        text: 'حدث خطأ في الاتصال',
        details: 'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (interactive: boolean = false) => {
    const rating = interactive ? (hoveredRating || formData.rating) : formData.rating;
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && handleRatingClick(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`transition-colors ${
              interactive 
                ? 'hover:scale-110 transform transition-transform' 
                : 'cursor-default'
            }`}
            disabled={!interactive}
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-dark-400 rounded-2xl border border-primary-300/20 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">
          شارك تقييمك لـ "{productName}"
        </h3>
        <p className="text-gray-400 text-sm">
          ساعد الآخرين في اتخاذ قرار الشراء من خلال مشاركة تجربتك مع هذا المنتج
        </p>
      </div>

      {/* رسائل التنبيه */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : message.type === 'error'
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{message.text}</p>
            {message.details && (
              <p className="text-sm opacity-80 mt-1">{message.details}</p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* الاسم */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            الاسم *
          </label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="authorName"
              value={formData.authorName}
              onChange={handleInputChange}
              required
              placeholder="اسمك الكريم"
              className="w-full pr-10 pl-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-300/70 focus:bg-white/15 transition-all"
            />
          </div>
        </div>

        {/* التقييم بالنجوم */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            التقييم *
          </label>
          <div className="flex items-center gap-4">
            {renderStars(true)}
            <span className="text-gray-400 text-sm">
              {formData.rating > 0 ? `${formData.rating} من 5` : 'اختر تقييمك'}
            </span>
          </div>
        </div>



        {/* تفاصيل التقييم */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            تفاصيل التقييم *
          </label>
          <div className="relative">
            <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              name="reviewBody"
              value={formData.reviewBody}
              onChange={handleInputChange}
              required
              maxLength={1000}
              rows={4}
              placeholder="شارك تجربتك مع المنتج... ما الذي أعجبك؟ هل حقق توقعاتك؟"
              className="w-full pr-10 pl-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-300/70 focus:bg-white/15 transition-all resize-none"
            />
          </div>
          <div className="text-xs text-gray-400 mt-1 text-left">
            {formData.reviewBody.length}/1000
          </div>
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              إرسال التقييم
            </>
          )}
        </button>
      </form>

      {/* ملاحظة */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-blue-400 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          يمكنك إضافة تقييم واحد فقط لكل منتج. تأكد من أنك اشتريت المنتج قبل إضافة التقييم.
        </p>
      </div>
    </div>
  );
}
