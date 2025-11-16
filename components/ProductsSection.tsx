import ProductGrid from './ProductGrid';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductsSection() {
  return (
    <section id="products" className="py-12 sm:py-16 md:py-20 bg-dark-400 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      
      <div className="container-mobile relative z-10">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-4 py-2 rounded-full mb-4 border border-primary-300/30">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold">منتجات مختارة بعناية</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
            منتجاتنا{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
              المميزة
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            اختر من بين مجموعة واسعة من الكتب والمنتجات الرقمية عالية الجودة
          </p>
        </div>
        <ProductGrid />
        
        {/* View All Products Button */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-1 border border-primary-300/20"
          >
            <span>عرض جميع المنتجات</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400 mt-3">
            اكتشف مجموعتنا الكاملة من المنتجات الرقمية مع خصومات حصرية تصل إلى 50%
          </p>
        </div>
      </div>
    </section>
  );
}
