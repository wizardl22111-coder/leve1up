'use client';

import { Currency, formatPriceValue } from '@/lib/currency';
import CurrencyDisplay from './CurrencyDisplay';

interface PriceDisplayProps {
  price: number;
  currency: Currency;
  className?: string;
  showCurrencyFirst?: boolean; // لعرض العملة قبل السعر (مثل ﷼ 29.99)
}

export default function PriceDisplay({ 
  price, 
  currency, 
  className = '', 
  showCurrencyFirst = false 
}: PriceDisplayProps) {
  // إذا كان السعر 0، عرض "مجاني"
  if (price === 0) {
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

  return (
    <span className={className}>
      {formattedPrice}{' '}
      <CurrencyDisplay currency={currency} />
    </span>
  );
}
