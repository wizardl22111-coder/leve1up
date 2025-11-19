'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Currency } from '@/lib/currency';

interface CurrencyDisplayProps {
  currency: Currency;
  className?: string;
}

export default function CurrencyDisplay({ currency, className = '' }: CurrencyDisplayProps) {
  const [aedImageError, setAedImageError] = useState(false);
  const [sarImageError, setSarImageError] = useState(false);

  // رموز العملات النصية (fallback)
  const symbols: Record<Currency, string> = {
    AED: 'د.إ',
    SAR: 'ريال', // تغيير من ﷼ إلى "ريال" كما طلبت
    BHD: 'د.ب',
    KWD: 'د.ك',
    OMR: 'ر.ع',
    QAR: 'ر.ق',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };

  // للدرهم الإماراتي، نجرب الصورة أولاً
  if (currency === 'AED') {
    if (aedImageError) {
      // إذا فشلت الصورة، نستخدم النص
      return <span className={className}>{symbols.AED}</span>;
    }
    
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/UAE_Dirham_symbol.svg/512px-UAE_Dirham_symbol.svg.png"
        alt="درهم إماراتي"
        width={16}
        height={16}
        className={`inline-block ${className}`}
        onError={() => setAedImageError(true)}
        onLoad={() => setAedImageError(false)}
      />
    );
  }

  // للريال السعودي، نجرب صورة الرمز ﷼
  if (currency === 'SAR') {
    if (sarImageError) {
      // إذا فشلت الصورة، نستخدم كلمة "ريال"
      return <span className={className}>{symbols.SAR}</span>;
    }
    
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Saudi_Riyal_Symbol.svg/512px-Saudi_Riyal_Symbol.svg.png"
        alt="ريال سعودي"
        width={16}
        height={16}
        className={`inline-block ${className}`}
        onError={() => setSarImageError(true)}
        onLoad={() => setSarImageError(false)}
      />
    );
  }

  // للعملات الأخرى، نستخدم الرموز النصية
  return <span className={className}>{symbols[currency] || 'ريال'}</span>;
}
