import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import ScrollReveal from '@/components/ScrollReveal';
import { Zap, Play, Music, Gamepad2, Tv, Smartphone } from 'lucide-react';
import { getActiveProducts } from '@/lib/products-utils';

export const metadata = {
  title: 'الاشتراكات الرقمية | متجر لفل اب',
  description: 'نتفليكس، بلايستيشن بلس، سبوتيفاي والمزيد من الاشتراكات الرقمية بأسعار تنافسية',
};

export default function SubscriptionsPage() {
  // Get subscription products from database
  const allProducts = getActiveProducts();
  const subscriptionProducts = allProducts.filter(product => product.category === 'subscriptions');
  
  const subscriptions = [
    {
      name: 'Netflix',
      icon: Play,
      color: 'text-red-400',
      bgColor: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-500/20'
    },
    {
      name: 'ChatGPT',
      icon: Zap,
      color: 'text-green-400',
      bgColor: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20'
    },
    {
      name: 'Google Gemini',
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      name: 'Canva Pro',
      icon: Tv,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20'
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
            <ScrollReveal delay={0} duration={800} distance={60}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm text-green-300 px-4 py-2 rounded-full mb-6 border border-green-500/30">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">الاشتراكات الرقمية</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200} duration={800} distance={60}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
                الباقات{' '}
                <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                  الرقمية
                </span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={400} duration={800} distance={60}>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Netflix، ChatGPT، Google Gemini، Canva Pro… والمزيد
              </p>
            </ScrollReveal>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {subscriptions.map((subscription, index) => {
                const IconComponent = subscription.icon;
                return (
                  <ScrollReveal 
                    key={index}
                    delay={600 + (index * 100)}
                    duration={800}
                    distance={60}
                  >
                    <div className={`bg-gradient-to-br ${subscription.bgColor} backdrop-blur-sm rounded-xl p-4 border ${subscription.borderColor} hover:scale-105 transition-transform duration-300`}
                    >
                      <IconComponent className={`w-8 h-8 ${subscription.color} mb-2 mx-auto`} />
                      <h3 className="text-sm font-bold text-white text-center">{subscription.name}</h3>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>



      {/* Subscription Products Section */}
      <section className="py-16 bg-dark-500">
        <div className="container-mobile">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">الاشتراكات المتاحة</h2>
            <p className="text-gray-400 text-lg">
              اختر من مجموعة متنوعة من الاشتراكات الرقمية المميزة
            </p>
          </div>
          
          {subscriptionProducts.length > 0 ? (
            <ProductGrid 
              products={subscriptionProducts} 
              maxProducts={4}
              gridCols="grid-cols-1 sm:grid-cols-2"
            />
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-6 py-3 rounded-full border border-primary-300/30">
                <span className="text-sm font-bold">قريباً - المزيد من الباقات</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
