import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit3, Gamepad2, Zap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ServicesSection() {
  const services = [
    {
      id: 1,
      title: "أدوات المونتاج",
      description: "حزم جاهزة تساعدك في إنتاج فيديوهات احترافية.",
      image: "/images/services/editing-tools.jpg",
      href: "/edits-tools",
      icon: Edit3,
      gradient: "from-blue-500/10 to-purple-600/10",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      id: 2,
      title: "الباقات الرقمية",
      description: "نتفليكس، بلايستيشن بلس، سبوتيفاي… والمزيد.",
      image: "/images/services/subscriptions.jpg",
      href: "/subscriptions",
      icon: Zap,
      gradient: "from-green-500/10 to-emerald-600/10",
      borderColor: "border-green-500/20",
      iconColor: "text-green-400"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      
      <div className="container-mobile relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-4 py-2 rounded-full mb-4 border border-primary-300/30">
            <Zap className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold">منتجاتنا المميزة</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
            اكتشف{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
              منتجاتنا
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            مجموعة متنوعة من الخدمات الرقمية المصممة لتلبية احتياجاتك
          </p>
        </div>

        {/* Services Grid - عرض عمودي على الجوال، شبكة على الكمبيوتر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <ScrollReveal
                key={service.id}
                delay={index * 200}
                duration={800}
                distance={80}
                direction="up"
              >
                <Link
                  href={service.href}
                  className="group block"
                >
                <div className="bg-gradient-to-br from-dark-300 to-dark-500 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-700/50 hover:border-primary-300/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full">
                  {/* Service Image */}
                  <div className="relative h-32 sm:h-48 md:h-56 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Icon Overlay */}
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                      <div className={`p-2 sm:p-3 bg-dark-400/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10`}>
                        <IconComponent className={`w-4 h-4 sm:w-6 sm:h-6 ${service.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-primary-300 transition-colors leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                      {service.description}
                    </p>
                    
                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-primary-300 font-semibold text-xs sm:text-sm group-hover:text-white transition-colors">
                        استكشف الآن
                      </span>
                      <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-primary-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
