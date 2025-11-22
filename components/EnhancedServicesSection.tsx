'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Edit3, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function EnhancedServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const services = [
    {
      id: 1,
      title: "أدوات المونتاج",
      description: "قوالب وترانزيشنات ومؤثرات جاهزة تناسب يوتيوبرز ومونتيرين.",
      image: "/images/services/editing-tools.jpg",
      href: "/edits-tools",
      icon: Edit3,
    },
    {
      id: 2,
      title: "الاشتراكات الرقمية",
      description: "اشتراكات وأدوات رقمية — تفعيل فوري وخدمة دعم.",
      image: "/images/services/digital-subscriptions.jpg",
      href: "/subscriptions",
      icon: Zap,
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
            اكتشف خدماتنا
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#98a0ad] max-w-2xl mx-auto">
            خدماتنا المصممة لمساعدتك في إنتاج محتوى احترافي.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-x-auto pb-4 sm:pb-0">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <article
                key={service.id}
                className="reveal flex-shrink-0 w-full sm:flex-1 bg-gradient-to-br from-[#071028] to-[#071827] rounded-xl p-6 shadow-2xl border border-[#06b6d4]/10 hover:border-[#06b6d4]/30 transition-all duration-300 hover:transform hover:-translate-y-1"
                style={{
                  opacity: 0,
                  transform: 'translateY(16px) scale(0.997)',
                  transition: 'opacity 0.65s cubic-bezier(0.19, 1, 0.22, 1), transform 0.65s cubic-bezier(0.19, 1, 0.22, 1)',
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#06b6d4] text-[#021017] rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#eef2f7] mb-1">
                      {service.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-[#98a0ad] text-sm sm:text-base mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="mt-auto">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#06b6d4] to-[#00cfe8] text-[#021017] font-bold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#06b6d4]/20 transition-all duration-200 hover:transform hover:scale-105"
                  >
                    اكتشف المزيد
                  </Link>
                </div>
              </article>
            );
          })}
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
