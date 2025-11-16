import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import ProductsSection from '@/components/ProductsSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import PageLoader from '@/components/PageLoader';

export default function Home() {
  return (
    <PageLoader loadingText="مرحباً بك في متجر لفل اب..." delay={2000}>
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <ProductsSection />
        <ServicesSection />
        <StatsSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </main>
    </PageLoader>
  );
}
