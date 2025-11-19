import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Gamepad2, Trophy, Users, Zap, Star, Gift } from 'lucide-react';

export const metadata = {
  title: 'قسم الألعاب | متجر لفل اب',
  description: 'قسم مخصص لعروض وحزم الألعاب - قادم قريباً مع أفضل العروض والخصومات',
};

export default function GamesPage() {
  const gameFeatures = [
    {
      icon: Trophy,
      title: 'ألعاب حصرية',
      description: 'أحدث الألعاب والإصدارات الحصرية',
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500/10 to-yellow-600/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      icon: Users,
      title: 'ألعاب جماعية',
      description: 'ألعاب متعددة اللاعبين ومغامرات جماعية',
      color: 'text-blue-400',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Zap,
      title: 'تحديثات سريعة',
      description: 'أحدث التحديثات والإضافات الجديدة',
      color: 'text-purple-400',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: Star,
      title: 'تقييمات عالية',
      description: 'ألعاب بتقييمات ممتازة من اللاعبين',
      color: 'text-green-400',
      bgColor: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: Gift,
      title: 'عروض خاصة',
      description: 'خصومات وعروض حصرية للألعاب',
      color: 'text-pink-400',
      bgColor: 'from-pink-500/10 to-pink-600/10',
      borderColor: 'border-pink-500/20'
    },
    {
      icon: Gamepad2,
      title: 'جميع المنصات',
      description: 'ألعاب لجميع المنصات والأجهزة',
      color: 'text-red-400',
      bgColor: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-500/20'
    }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        
        <div className="container-mobile relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-600/20 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-full mb-6 border border-orange-500/30">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm font-bold">قسم الألعاب</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
              قسم الألعاب{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                (قريبًا)
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              قسم مخصص لعروض وحزم الألعاب — قريبًا
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {gameFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm rounded-xl p-6 border ${feature.borderColor} hover:scale-105 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${feature.color} mb-3 mx-auto`} />
                    <h3 className="text-lg font-bold text-white mb-2 text-center">{feature.title}</h3>
                    <p className="text-sm text-gray-400 text-center">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Details */}
      <section className="py-16 bg-dark-400">
        <div className="container-mobile">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">ما ننتظره في قسم الألعاب</h2>
              <p className="text-gray-400 text-lg">
                نعمل على إعداد تجربة ألعاب استثنائية مع أفضل العروض والخصومات
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-gradient-to-br from-dark-300/50 to-dark-400/50 backdrop-blur-sm rounded-xl p-6 border border-primary-300/10">
                <h3 className="text-xl font-bold text-white mb-4">🎮 مكتبة ألعاب ضخمة</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• أحدث الألعاب والإصدارات</li>
                  <li>• ألعاب كلاسيكية محبوبة</li>
                  <li>• ألعاب مستقلة مميزة</li>
                  <li>• محتوى إضافي وتوسعات</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-dark-300/50 to-dark-400/50 backdrop-blur-sm rounded-xl p-6 border border-primary-300/10">
                <h3 className="text-xl font-bold text-white mb-4">💰 عروض وخصومات</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• خصومات تصل إلى 70%</li>
                  <li>• عروض أسبوعية خاصة</li>
                  <li>• حزم ألعاب بأسعار مخفضة</li>
                  <li>• برنامج نقاط ومكافآت</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-dark-300/50 to-dark-400/50 backdrop-blur-sm rounded-xl p-6 border border-primary-300/10">
                <h3 className="text-xl font-bold text-white mb-4">🏆 مميزات حصرية</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• وصول مبكر للألعاب الجديدة</li>
                  <li>• محتوى حصري للأعضاء</li>
                  <li>• دعم فني متخصص</li>
                  <li>• مجتمع لاعبين نشط</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-dark-300/50 to-dark-400/50 backdrop-blur-sm rounded-xl p-6 border border-primary-300/10">
                <h3 className="text-xl font-bold text-white mb-4">🎯 جميع المنصات</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• PlayStation 5 & 4</li>
                  <li>• Xbox Series X/S & One</li>
                  <li>• Nintendo Switch</li>
                  <li>• PC (Steam, Epic, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Notification */}
      <section className="py-16 bg-gradient-to-br from-dark-500 to-dark-400">
        <div className="container-mobile">
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <Gamepad2 className="w-16 h-16 text-orange-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">قادم قريباً جداً</h2>
              <p className="text-gray-400 text-lg mb-8">
                نعمل بجد لإطلاق قسم الألعاب مع أفضل التجارب والعروض الحصرية
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-6 py-3 rounded-full border border-primary-300/30">
                <span className="text-sm font-bold">ترقبوا الإطلاق قريباً</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
