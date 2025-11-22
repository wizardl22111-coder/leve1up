'use client';

import { useState } from 'react';
import { Tag, X, Loader2, CheckCircle } from 'lucide-react';

interface DiscountCodeInputProps {
  onDiscountApplied: (discountPercent: number, code: string) => void;
  onDiscountRemoved: (code: string) => void;
  appliedCodes: string[];
  disabled?: boolean;
}

export default function DiscountCodeInput({
  onDiscountApplied,
  onDiscountRemoved,
  appliedCodes,
  disabled = false
}: DiscountCodeInputProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyCode = async () => {
    if (!code.trim()) {
      setError('يرجى إدخال كود الخصم');
      return;
    }

    if (appliedCodes.includes(code.toUpperCase())) {
      setError('تم تطبيق هذا الكود مسبقاً');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      const data = await response.json();

      if (data.valid) {
        onDiscountApplied(data.discountPercent, data.code);
        setSuccess(`تم تطبيق خصم ${data.discountPercent}%!`);
        setCode('');
        
        // إخفاء رسالة النجاح بعد 3 ثواني
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'كود خصم غير صالح');
      }
    } catch (error) {
      setError('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCode = (codeToRemove: string) => {
    onDiscountRemoved(codeToRemove);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCode();
    }
  };

  return (
    <div className="space-y-3">
      {/* عنوان القسم */}
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-primary-400" />
        <h3 className="text-sm font-semibold text-white">كود الخصم</h3>
      </div>

      {/* حقل الإدخال والزر */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
              setSuccess('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="أدخل كود الخصم"
            disabled={disabled || isLoading}
            className="w-full px-3 py-2.5 bg-dark-300 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            maxLength={20}
          />
        </div>
        
        <button
          onClick={handleApplyCode}
          disabled={disabled || isLoading || !code.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm min-w-[100px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">تطبيق...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>تطبيق</span>
            </>
          )}
        </button>
      </div>

      {/* رسائل الخطأ والنجاح */}
      {error && (
        <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      
      {success && (
        <div className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          {success}
        </div>
      )}

      {/* الأكواد المطبقة */}
      {appliedCodes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">الأكواد المطبقة:</p>
          <div className="flex flex-wrap gap-2">
            {appliedCodes.map((appliedCode) => (
              <div
                key={appliedCode}
                className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-xs"
              >
                <Tag className="w-3 h-3" />
                <span className="font-medium">{appliedCode}</span>
                <button
                  onClick={() => handleRemoveCode(appliedCode)}
                  className="hover:bg-green-500/30 rounded-full p-0.5 transition-colors"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

