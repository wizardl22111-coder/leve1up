'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductsSection from '@/components/ProductsSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import AnimatedSearchInput from '@/components/AnimatedSearchInput';

export default function Home() {
  const handleSearch = (query: string) => {
    console.log('البحث في المنتجات:', query);
    // يمكن إضافة منطق البحث هنا
  };

  const handleFilter = () => {
    console.log('فتح فلتر المنتجات');
    // يمكن إضافة منطق الفلتر هنا
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* قسم البحث المتحرك */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🔍 ابحث في منتجاتنا الرقمية
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              استخدم مربع البحث المتطور للعثور على المنتج المثالي لك
            </p>
          </div>
          
          <div className="flex justify-center">
            <AnimatedSearchInput
              placeholder="ابحث عن الكتب، الكورسات، والملفات..."
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="/search-demo"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              جرب الصفحة التجريبية للبحث
              <span>←</span>
            </a>
          </div>
        </div>
      </section>
      
      <ProductsSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
