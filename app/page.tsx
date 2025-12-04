import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import ProductsSection from '@/components/ProductsSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import AccessDeniedAlert from '@/components/AccessDeniedAlert';

export default function Home() {
  return (
    <main className="min-h-screen">
      <AccessDeniedAlert />
      <Navbar />
      <Hero />
      
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
