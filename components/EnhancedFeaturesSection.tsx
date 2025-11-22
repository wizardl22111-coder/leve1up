'use client';

import { useEffect, useRef } from 'react';

export default function EnhancedFeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      id: 1,
      icon: "⚡",
      title: "تسليم فوري",
      description: "روابط تحميل فوراً بعد الدفع بدون انتظار."
    },
    {
      id: 2,
      icon: "🛠️",
      title: "دعم فني سريع",
      description: "دعم مباشر لمشكلات التفعيل والتحميل."
    },
    {
      id: 3,
      icon: "✅",
      title: "منتجات أصلية",
      description: "محتوى أصلي ومطابق للترخيص."
    },
    {
      id: 4,
      icon: "🔒",
      title: "أمان وخصوصية",
      description: "نحفظ بياناتك ونحمي روابط التحميل."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.16 }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 bg-[#071026] relative overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#eef2f7] mb-3 sm:mb-4">
            ليش تشتري من لفل؟
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#98a0ad] max-w-2xl mx-auto">
            أربع مميزات تميزنا عن غيرنا.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="reveal bg-[#0b1320] p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 items-start border border-[#06b6d4]/10 hover:border-[#06b6d4]/30 transition-all duration-300 hover:transform hover:-translate-y-1"
              style={{
                opacity: 0,
                transform: 'translateY(16px) scale(0.997)',
                transition: 'opacity 0.65s cubic-bezier(0.19, 1, 0.22, 1), transform 0.65s cubic-bezier(0.19, 1, 0.22, 1)',
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#06b6d4] text-[#021017] rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
                {feature.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-[#eef2f7] mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#98a0ad] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .reveal.is-visible {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
      `}</style>
    </section>
  );
}
