'use client';

import Image from 'next/image';
import { Currency } from '@/lib/currency';

interface CurrencyDisplayProps {
  currency: Currency;
  className?: string;
}

export default function CurrencyDisplay({ currency, className = '' }: CurrencyDisplayProps) {
  // للدرهم الإماراتي، نستخدم صورة
  if (currency === 'AED') {
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/UAE_Dirham_symbol.svg/512px-UAE_Dirham_symbol.svg.png"
        alt="درهم إماراتي"
        width={16}
        height={16}
        className={`inline-block ${className}`}
      />
    );
  }

  // للريال السعودي، نستخدم الرمز الخاص
  if (currency === 'SAR') {
    return <span className={className}>﷼</span>;
  }

  // للعملات الأخرى، نستخدم الرموز النصية العادية
  const symbols: Record<Currency, string> = {
    AED: 'د.إ',
    SAR: '﷼',
    BHD: 'د.ب',
    KWD: 'د.ك',
    OMR: 'ر.ع',
    QAR: 'ر.ق',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };

  return <span className={className}>{symbols[currency] || '﷼'}</span>;
}
