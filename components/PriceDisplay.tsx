'use client';

import { Currency, formatPriceValue } from '@/lib/currency';
import CurrencyDisplay from './CurrencyDisplay';

interface PriceDisplayProps {
  price: number;
  currency: Currency;
  className?: string;
  showCurrencyFirst?: boolean; // لعرض العملة قبل السعر (مثل ﷼ 29.99)
  originalPrice?: number; // السعر الأصلي للمنتجات المجانية
}

export default function PriceDisplay({ 
  price, 
  currency, 
  className = '', 
  showCurrencyFirst = false,
  originalPrice 
}: PriceDisplayProps) {
  // إذا كان السعر 0، عرض السعر الأصلي + مجاني
  if (price === 0) {
    if (originalPrice && originalPrice > 0) {
      const formattedOriginalPrice = formatPriceValue(originalPrice);
      return (
        <div className={`${className} flex items-center gap-2`}>
          <span className="text-gray-400 line-through text-sm">
            {formattedOriginalPrice} <CurrencyDisplay currency={currency} />
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

  const formattedPrice = formatPriceValue(price);

  if (showCurrencyFirst) {
    return (
      <span className={className}>
        <CurrencyDisplay currency={currency} className="ml-1" />
        {formattedPrice}
      </span>
    );
  }

  // إذا كان هناك سعر أصلي أعلى، عرض الخصم
  if (originalPrice && originalPrice > price) {
    const formattedOriginalPrice = formatPriceValue(originalPrice);
    return (
      <div className={`${className} flex items-center gap-2`}>
        <span className="text-gray-400 line-through text-sm">
          {formattedOriginalPrice} <CurrencyDisplay currency={currency} />
        </span>
        <span className="text-white font-bold">
          {formattedPrice} <CurrencyDisplay currency={currency} />
        </span>
      </div>
    );
  }

  return (
    <span className={className}>
      {formattedPrice}{' '}
      <CurrencyDisplay currency={currency} />
    </span>
  );
}
