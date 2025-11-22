import Navbar from '@/components/Navbar';
import EnhancedCTASection from '@/components/EnhancedCTASection';
import ProductsSection from '@/components/ProductsSection';
import EnhancedServicesSection from '@/components/EnhancedServicesSection';
import EnhancedFeaturesSection from '@/components/EnhancedFeaturesSection';
import EnhancedFAQSection from '@/components/EnhancedFAQSection';
import Footer from '@/components/Footer';

export default function EnhancedUIPage() {
  return (
    <main className="min-h-screen bg-[#071026]">
      <Navbar />
      
      {/* Hero Section with Enhanced CTA */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-[#071026] via-[#0b1320] to-[#071026]">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#eef2f7] mb-4 leading-tight">
              مرحباً بك في{' '}
              <span className="bg-gradient-to-r from-[#06b6d4] to-[#00cfe8] bg-clip-text text-transparent">
                LevelUp
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#98a0ad] max-w-3xl mx-auto mb-8">
              تجربة محسنة للواجهة مع مكونات UI حديثة ومحسنة للـ RTL
            </p>
          </div>
        </div>
      </section>

      <EnhancedCTASection />
      <ProductsSection />
      <EnhancedServicesSection />
      <EnhancedFeaturesSection />
      <EnhancedFAQSection />
      <Footer />
    </main>
  );
}
