'use client';

import { useState } from 'react';
import faq from '@/data/faq.json';

export default function EnhancedFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#071026] relative overflow-hidden">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#eef2f7] mb-3 sm:mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#98a0ad] max-w-2xl mx-auto">
            إجابات على أكثر الأسئلة شيوعاً حول خدماتنا ومنتجاتنا
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faq.map((item, index) => (
            <div
              key={item.id}
              className="bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden border border-[#06b6d4]/20 hover:border-[#06b6d4]/40 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-right hover:bg-[#06b6d4]/5 transition-colors cursor-pointer border-0 bg-transparent text-[#eef2f7] font-semibold"
                aria-expanded={openIndex === index}
              >
                <span className="text-right flex-1 text-sm sm:text-base">
                  {item.question}
                </span>
                <span 
                  className="text-[#06b6d4] text-xl font-bold ml-3 transition-transform duration-200"
                  style={{ 
                    transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' 
                  }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? 'max-h-60 pb-4 px-4 sm:px-5 md:px-6' 
                    : 'max-h-0 pb-0 px-0'
                }`}
              >
                <div className="text-[#98a0ad] text-sm sm:text-base leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
