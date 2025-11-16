import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Zap, Play, Music, Gamepad2, Tv, Smartphone } from 'lucide-react';

export const metadata = {
  title: 'الاشتراكات الرقمية | متجر لفل اب',
  description: 'نتفليكس، بلايستيشن بلس، سبوتيفاي والمزيد من الاشتراكات الرقمية بأفضل الأسعار',
};

export default function SubscriptionsPage() {
  const subscriptions = [
    {
      name: 'Netflix',
      icon: Play,
      color: 'text-red-400',
      bgColor: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-500/20'
    },
    {
      name: 'PlayStation Plus',
      icon: Gamepad2,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      name: 'Spotify',
      icon: Music,
      color: 'text-green-400',
      bgColor: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20'
    },
    {
      name: 'Disney+',
      icon: Tv,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20'
    },
    {
      name: 'YouTube Premium',
      icon: Play,
      color: 'text-red-400',
      bgColor: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-500/20'
    },
    {
      name: 'Apple Music',
      icon: Music,
      color: 'text-gray-400',
      bgColor: 'from-gray-500/10 to-gray-600/10',
      borderColor: 'border-gray-500/20'
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm text-green-300 px-4 py-2 rounded-full mb-6 border border-green-500/30">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-bold">الاشتراكات الرقمية</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
              الاشتراكات{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                الرقمية
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              نتفليكس، بلايستيشن بلس، سبوتيفاي… والمزيد
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
              {subscriptions.map((subscription, index) => {
                const IconComponent = subscription.icon;
                return (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br ${subscription.bgColor} backdrop-blur-sm rounded-xl p-4 border ${subscription.borderColor} hover:scale-105 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${subscription.color} mb-2 mx-auto`} />
                    <h3 className="text-sm font-bold text-white text-center">{subscription.name}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-400">
        <div className="container-mobile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">تفعيل فوري</h3>
              <p className="text-gray-400">تفعيل الاشتراك خلال دقائق من الشراء</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">دعم فني</h3>
              <p className="text-gray-400">دعم فني متاح 24/7 لمساعدتك</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tv className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">أفضل الأسعار</h3>
              <p className="text-gray-400">أسعار تنافسية وعروض حصرية</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-gradient-to-br from-dark-500 to-dark-400">
        <div className="container-mobile">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">قريباً جداً</h2>
            <p className="text-gray-400 text-lg mb-8">
              نعمل على إضافة المزيد من الاشتراكات الرقمية المميزة
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-6 py-3 rounded-full border border-primary-300/30">
              <span className="text-sm font-bold">ترقبوا الإطلاق قريباً</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
