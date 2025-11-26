import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import ScrollReveal from '@/components/ScrollReveal';
import { Zap } from 'lucide-react';
import { getActiveProducts } from '@/lib/products-utils';

export const metadata = {
  title: 'الاشتراكات الرقمية | متجر لفل اب',
  description: 'نتفليكس، بلايستيشن بلس، سبوتيفاي والمزيد من الاشتراكات الرقمية بأسعار تنافسية',
};

export default function SubscriptionsPage() {
  // Get subscription products from database
  const allProducts = getActiveProducts();
  const subscriptionProducts = allProducts.filter(product => product.category === 'subscriptions');
  


  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section - Banner Style */}
      <section className="relative overflow-hidden pt-20 pb-8">
        <ScrollReveal delay={0} duration={1000} distance={0}>
          <div className="container-mobile">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/services/subscriptions-banner-new.jpg" 
                alt="الاشتراكات الرقمية" 
                className="w-full h-[25vh] sm:h-[30vh] md:h-[35vh] lg:h-[40vh] object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
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
