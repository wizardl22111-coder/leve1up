import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { Sparkles, BookOpen, Video, Palette } from 'lucide-react';

export const metadata = {
  title: 'جميع المنتجات | متجر لفل اب',
  description: 'تصفح جميع منتجاتنا الرقمية من كتب إلكترونية وأدوات مونتاج وتصميم وأيقونات متحركة',
};

export default function AllProductsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        
        <div className="container-mobile relative z-10">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-4 py-2 rounded-full mb-4 border border-primary-300/30">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-bold">مجموعة كاملة من المنتجات</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6">
              جميع{' '}
              <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
                منتجاتنا
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4 sm:px-0">
              اكتشف مجموعتنا الكاملة من المنتجات الرقمية عالية الجودة - من الكتب الإلكترونية إلى أدوات المونتاج والتصميم
            </p>
          </div>

          {/* Categories Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <BookOpen className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">الكتب الإلكترونية</h3>
              <p className="text-sm text-gray-400">دلائل شاملة للربح من المنتجات الرقمية وبناء المشاريع الناجحة</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <Video className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">أدوات المونتاج</h3>
              <p className="text-sm text-gray-400">انتقالات ومؤثرات وقوالب احترافية لإنتاج فيديوهات مميزة</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
              <Palette className="w-8 h-8 text-pink-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">التصميم والأيقونات</h3>
              <p className="text-sm text-gray-400">قوالب تصميم وأيقونات متحركة لتحسين الهوية البصرية</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-dark-400 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        
        <div className="container-mobile relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
              تصفح{' '}
              <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
                المنتجات
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
              جميع منتجاتنا متاحة بخصومات حصرية تصل إلى 50%
            </p>
          </div>
          
          <ProductGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
