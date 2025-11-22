'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function EnhancedCTASection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCTAClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 900);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#071026] relative overflow-hidden">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#eef2f7] mb-3 sm:mb-4">
            عروض مميزة
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#98a0ad] max-w-2xl mx-auto">
            احصل على باقات ادوات المونتاج والكتب الرقمية — تفعيل فوري بعد الشراء.
          </p>
        </div>

        <Link
          href="/products"
          onClick={handleCTAClick}
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-[#06b6d4] to-[#00cfe8] text-[#021017] font-bold px-6 py-3 rounded-lg shadow-lg shadow-[#06b6d4]/20 transition-all duration-200 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-[#06b6d4]/30 ${
            isLoading ? 'opacity-70 pointer-events-none' : ''
          }`}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#021017]/30 border-t-[#021017] rounded-full animate-spin"></div>
              جاري التحميل...
            </>
          ) : (
            <>
              اشتري الآن
              <span className="text-lg">🚀</span>
            </>
          )}
        </Link>
      </div>
    </section>
  );
}
