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
    SAR: 'ريال',
    BHD: 'د.ب',
    KWD: 'د.ك',
    OMR: 'ر.ع',
    QAR: 'ر.ق',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };

  // للدرهم الإماراتي، نستخدم SVG المحلي
  if (currency === 'AED') {
    if (aedImageError) {
      // إذا فشل SVG، نستخدم النص
      return <span className={className}>{symbols.AED}</span>;
    }
    
    return (
      <Image
        src="/icons/currency/aed.svg"
        alt="درهم إماراتي"
        width={16}
        height={16}
        className={`inline-block opacity-80 ${className}`}
        onError={() => setAedImageError(true)}
        onLoad={() => setAedImageError(false)}
        priority
        quality={100}
      />
    );
  }

  // للريال السعودي، نستخدم SVG المحلي
  if (currency === 'SAR') {
    if (sarImageError) {
      // إذا فشل SVG، نستخدم كلمة "ريال"
      return <span className={className}>{symbols.SAR}</span>;
    }
    
    return (
      <Image
        src="/icons/currency/sar.svg"
        alt="ريال سعودي"
        width={16}
        height={16}
        className={`inline-block opacity-80 ${className}`}
        onError={() => setSarImageError(true)}
        onLoad={() => setSarImageError(false)}
        priority
        quality={100}
      />
    );
  }

  // للعملات الأخرى، نستخدم الرموز النصية
  return <span className={className}>{symbols[currency] || 'ريال'}</span>;
}
