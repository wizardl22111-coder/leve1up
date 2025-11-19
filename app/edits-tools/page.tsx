'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Edit3 } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import { getActiveProducts } from '@/lib/products-utils';

export default function EditToolsPage() {
  // Get editing tools products from database
  const allProducts = getActiveProducts();
  const editingProducts = allProducts.filter(product => product.category === 'editing-tools');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-full border border-blue-500/30 mb-6">
              <Edit3 className="w-5 h-5" />
              <span className="text-sm font-bold">أدوات المونتاج الاحترافية</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                أدوات المونتاج
              </span>
              <br />
              الاحترافية
            </h1>
            
            <p className="text-gray-400 text-lg">
              حزم احترافية جاهزة لتطوير مهاراتك في المونتاج
            </p>
          </div>

          {/* Products Grid */}
          <div className="max-w-6xl mx-auto">
            {editingProducts.length > 0 ? (
              <ProductGrid 
                products={editingProducts} 
                maxProducts={3}
                gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              />
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-6 py-3 rounded-full border border-primary-300/30">
                  <Edit3 className="w-5 h-5" />
                  لا توجد أدوات مونتاج متاحة حالياً
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

