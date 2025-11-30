'use client';

import { Currency, formatPriceValue } from '@/lib/currency';
import CurrencyDisplay from './CurrencyDisplay';

interface PriceDisplayProps {
  amount: number; // تغيير من price إلى amount كما طلبت
  currency: 'SAR' | 'AED'; // تحديد العملات المدعومة
  oldPrice?: number; // السعر القديم (اختياري)
  className?: string;
  showCurrencyFirst?: boolean; // لعرض العملة قبل السعر
}

export default function PriceDisplay({ 
  amount, 
  currency, 
  oldPrice,
  className = '', 
  showCurrencyFirst = false
}: PriceDisplayProps) {
  // إذا كان السعر 0، عرض مجاني
  if (amount === 0) {
    if (oldPrice && oldPrice > 0) {
      const formattedOldPrice = formatPriceValue(oldPrice);
      return (
        <div className={`${className} flex items-center gap-1 rtl:flex-row-reverse`}>
          <span className="text-gray-400 line-through text-sm flex items-center gap-1">
            {formattedOldPrice}
            <CurrencyDisplay currency={currency} />
          </span>
          <span className="text-green-400 font-bold">
            مجاني
          </span>
        </div>
      );
    }
    return (
      <span className={`${className} text-green-400 font-bold`}>
        مجاني
      </span>
    );
  }

  const formattedAmount = formatPriceValue(amount);

  // إذا كان هناك سعر قديم أعلى، عرض الخصم
  if (oldPrice && oldPrice > amount) {
    const formattedOldPrice = formatPriceValue(oldPrice);
    return (
      <div className={`${className} flex items-center gap-1 rtl:flex-row-reverse`}>
        {/* السعر القديم مع خط شطب */}
        <span className="text-gray-400 line-through text-sm flex items-center gap-1">
          {formattedOldPrice}
          <CurrencyDisplay currency={currency} />
        </span>
        {/* السعر الجديد */}
        <span className="text-white font-bold text-lg flex items-center gap-1">
          {formattedAmount}
          <CurrencyDisplay currency={currency} />
        </span>
      </div>
    );
  }

  // العرض العادي للسعر
  if (showCurrencyFirst) {
    return (
      <span className={`${className} flex items-center gap-1`}>
        <CurrencyDisplay currency={currency} />
        {formattedAmount}
      </span>
    );
  }

  return (
    <span className={`${className} flex items-center gap-1`}>
      {formattedAmount}
      <CurrencyDisplay currency={currency} />
    </span>
  );
}
