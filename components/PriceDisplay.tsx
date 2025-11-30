'use client';

import { Currency, formatPriceValue } from '@/lib/currency';
import CurrencyDisplay from './CurrencyDisplay';

interface PriceDisplayProps {
  amount?: number; // السعر الحالي
  price?: number; // للتوافق مع الكود الموجود
  currency: Currency; // دعم جميع العملات
  oldPrice?: number; // السعر القديم (اختياري)
  originalPrice?: number; // للتوافق مع الكود الموجود
  className?: string;
  showCurrencyFirst?: boolean; // لعرض العملة قبل السعر
}

export default function PriceDisplay({ 
  amount, 
  price,
  currency, 
  oldPrice,
  originalPrice,
  className = '', 
  showCurrencyFirst = false
}: PriceDisplayProps) {
  // دعم كلاً من amount و price للتوافق
  const currentPrice = amount ?? price ?? 0;
  // دعم كلاً من oldPrice و originalPrice للتوافق
  const previousPrice = oldPrice ?? originalPrice;
  
  // إذا كان السعر 0، عرض مجاني
  if (currentPrice === 0) {
    if (previousPrice && previousPrice > 0) {
      const formattedOldPrice = formatPriceValue(previousPrice);
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

  const formattedAmount = formatPriceValue(currentPrice);

  // إذا كان هناك سعر قديم أعلى، عرض الخصم
  if (previousPrice && previousPrice > currentPrice) {
    const formattedOldPrice = formatPriceValue(previousPrice);
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
