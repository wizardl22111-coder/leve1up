'use client';

import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import { calculatePrice } from '@/lib/currency';
import products from '@/data/products.json';
import Link from 'next/link';
import PriceDisplay from './PriceDisplay';
import ScrollReveal from './ScrollReveal';

interface RelatedProductsProps {
  currentProductId: number;
  maxProducts?: number;
  category?: string;
}

export default function RelatedProducts({ 
  currentProductId, 
  maxProducts = 4,
  category 
}: RelatedProductsProps) {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();

  // Helper function to get unified product ID
  const getProductId = (product: any) => product.product_id ?? product.id ?? 1;

  // Helper function to get unified product name
  const getProductName = (product: any) => product.product_name ?? product.name ?? 'منتج غير محدد';

  // Helper function to get unified product image
  const getProductImage = (product: any) => product.product_image ?? product.image ?? '/images/default-product.jpg';

  // Filter products to exclude current product
  const availableProducts = products.filter(product => {
    const productId = getProductId(product);
    return productId !== currentProductId && product.active !== false;
  });

  // Get related products - prefer same category if available
  const getRelatedProducts = () => {
    let relatedProducts: any[] = [];

    // First, try to get products from the same category
    if (category) {
      const sameCategoryProducts = availableProducts.filter(product => 
        product.category === category
      );
      relatedProducts = sameCategoryProducts.slice(0, maxProducts);
    }

    // If we don't have enough products from the same category, fill with random products
    if (relatedProducts.length < maxProducts) {
      const remainingSlots = maxProducts - relatedProducts.length;
      const otherProducts = availableProducts.filter(product => 
        !relatedProducts.some(related => getProductId(related) === getProductId(product))
      );
      
      // Shuffle and take remaining slots
      const shuffled = otherProducts.sort(() => Math.random() - 0.5);
      relatedProducts = [...relatedProducts, ...shuffled.slice(0, remainingSlots)];
    }

    return relatedProducts;
  };

  const relatedProducts = getRelatedProducts();

  // Don't render if no related products
  if (relatedProducts.length === 0) {
    return null;
  }

  const handleAddToCart = (product: any) => {
    const priceCalc = calculatePrice(product, currency);
    const productId = getProductId(product);
    const productName = getProductName(product);
    
    addToCart({
      id: productId,
      name: productName,
      price: priceCalc.finalPrice,
      image: getProductImage(product)
    });
    
    showToast(`تمت إضافة ${productName} إلى السلة! 🛒`, 'cart');
  };

  return (
    <section className="mt-12 sm:mt-16">
      <div className="container-mobile">
        {/* Section Title */}
        <ScrollReveal delay={0} duration={600}>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              منتجات قد تعجبك
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              اكتشف المزيد من المنتجات الرائعة التي قد تهمك
            </p>
          </div>
        </ScrollReveal>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((product, index) => {
            const priceCalc = calculatePrice(product, currency);
            const productId = getProductId(product);
            const productName = getProductName(product);
            const productImage = getProductImage(product);
            const isInWishlist = wishlist.includes(productId);
            
            return (
              <ScrollReveal
                key={productId}
                delay={index * 150}
                duration={800}
                distance={60}
                direction="up"
              >
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                  
                  {/* Product Image */}
                  <Link href={`/products/${productId}`}>
                    <div className="relative overflow-hidden group cursor-pointer rounded-t-2xl aspect-[4/3]">
                      <img
                        src={`${productImage}?v=${Date.now()}`}
                        alt={productName}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        style={{ 
                          display: 'block',
                          visibility: 'visible',
                          opacity: 1
                        }}
                        onLoad={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onError={(e) => {
                          console.error('Related product image failed to load:', productImage);
                          e.currentTarget.style.backgroundColor = '#374151';
                          e.currentTarget.style.border = '2px dashed #6b7280';
                        }}
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-primary-300/20 border border-primary-300/40 text-primary-300 rounded-lg text-xs font-medium">
                        {product.category === 'ebooks' ? 'كتاب رقمي' : 
                         product.category === 'editing-tools' ? 'أدوات المونتاج' :
                         product.category === 'youtube-tools' ? 'أدوات المونتاج' :
                         product.category === 'subscriptions' ? 'الاشتراكات' :
                         product.category ?? 'منتج رقمي'}
                      </span>
                    </div>

                    {/* Product Title */}
                    <Link href={`/products/${productId}`}>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 hover:text-primary-300 transition-colors duration-200 line-clamp-2 cursor-pointer">
                        {productName}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating ?? 4.5)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        ({product.rating ?? 4.5})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4 mt-auto">
                      <PriceDisplay 
                        amount={priceCalc.finalPrice}
                        oldPrice={priceCalc.originalPrice > priceCalc.finalPrice ? priceCalc.originalPrice : undefined}
                        currency={currency}
                        className="text-lg font-bold"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* View Product Button */}
                      <Link 
                        href={`/products/${productId}`}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-center text-sm"
                      >
                        عرض المنتج
                      </Link>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/40 text-gray-300 hover:text-white p-2.5 rounded-xl transition-all duration-200 hover:shadow-lg"
                        title="إضافة إلى السلة"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Products Link */}
        <ScrollReveal delay={600} duration={600}>
          <div className="text-center mt-8 sm:mt-12">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-gray-600/40 hover:border-gray-500/60"
            >
              <span>عرض جميع المنتجات</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
