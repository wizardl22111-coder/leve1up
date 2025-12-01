import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HeroBanner from '@/components/HeroBanner';
import SectionGrid from '@/components/SectionGrid';
import ServicesSection from '@/components/ServicesSection';
import ProductsSection from '@/components/ProductsSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { heroBannerData, editToolsSection, subscriptionsSection } from '@/data/hero-sections';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* البانر الرئيسي الجديد */}
      <HeroBanner {...heroBannerData.editTools} />
      
      {/* قسم أدوات المونتاج */}
      <SectionGrid
        title={editToolsSection.title}
        items={editToolsSection.items}
      />
      
      {/* قسم الاشتراكات */}
      <SectionGrid
        title={subscriptionsSection.title}
        items={subscriptionsSection.items}
      />
      
      {/* الأقسام الأخرى */}
      <ProductsSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
