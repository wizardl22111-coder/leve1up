'use client';

import { useState } from 'react';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import { type DiscountValidationResponse } from '@/lib/discount';

interface DiscountCodeProps {
  onDiscountApplied: (discountPercent: number, code: string) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: {
    code: string;
    percent: number;
  };
  className?: string;
}

export default function DiscountCode({
  onDiscountApplied,
  onDiscountRemoved,
  appliedDiscount,
  className = ''
}: DiscountCodeProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setMessage('يرجى إدخال كود الخصم');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch(`/api/discount/validate?code=${encodeURIComponent(discountCode.trim())}`);
      const data: DiscountValidationResponse = await response.json();

      if (data.valid) {
        setMessage(data.message);
        setMessageType('success');
        onDiscountApplied(data.discountPercent, data.code || discountCode);
        setDiscountCode('');
      } else {
        setMessage(data.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error('خطأ في التحقق من كود الخصم:', error);
      setMessage('حدث خطأ أثناء التحقق من كود الخصم');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountRemoved();
    setMessage('');
    setMessageType('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyDiscount();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* عنوان القسم */}
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          هل لديك كود خصم؟
        </h3>
      </div>

      {/* الخصم المطبق حالياً */}
      {appliedDiscount && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  تم تطبيق كود الخصم: {appliedDiscount.code}
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  خصم {appliedDiscount.percent}% مطبق على طلبك
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveDiscount}
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-1"
              title="إزالة كود الخصم"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* حقل إدخال كود الخصم */}
      {!appliedDiscount && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="أدخل كود الخصم هنا"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleApplyDiscount}
              disabled={isLoading || !discountCode.trim()}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                'تطبيق الخصم'
              )}
            </button>
          </div>

          {/* رسالة النتيجة */}
          {message && (
            <div className={`p-3 rounded-lg border ${
              messageType === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {messageType === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* نصائح للمستخدم */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 <strong>نصائح:</strong> أكواد الخصم حساسة للأحرف الكبيرة والصغيرة. تأكد من إدخال الكود بشكل صحيح.
            </p>
          </div>

          {/* أكواد تجريبية للاختبار */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              <strong>أكواد تجريبية للاختبار:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {['WELCOME10', 'SAVE15', 'PREMIUM20'].map((code) => (
                <button
                  key={code}
                  onClick={() => setDiscountCode(code)}
                  className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
