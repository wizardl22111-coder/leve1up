'use client';

import { Star, ShoppingCart, Heart, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import { calculatePrice, formatPrice } from '@/lib/currency';
import products from '@/data/products.json';
import Link from 'next/link';
// import { ProductImage } from './OptimizedImage'; // مؤقتاً معطل
import PriceDisplay from './PriceDisplay';
import ScrollReveal from './ScrollReveal';

interface ProductGridProps {
  products?: any[];
  maxProducts?: number;
  gridCols?: string;
}

export default function ProductGrid({ 
  products: propProducts, 
  maxProducts = 3, 
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
}: ProductGridProps = {}) {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();
  
  // Use provided products or default to all products
  const displayProducts = propProducts || products;

  // Helper function to get unified product ID
  const getProductId = (product: any) => product.product_id ?? product.id ?? 1;

  // Helper function to get unified product name
  const getProductName = (product: any) => product.product_name ?? product.name ?? 'منتج غير محدد';

  // Helper function to get unified product image
  const getProductImage = (product: any) => product.product_image ?? product.image ?? '/images/default-product.jpg';

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

  const handleWishlist = (productId: number) => {
    if (!wishlist.includes(productId)) {
      addToWishlist(productId);
      showToast('تمت إضافة المنتج إلى قائمة الأمنيات! ❤️', 'wishlist');
    }
  };

  const handleDirectPayment = (product: any) => {
    // التوجيه إلى صفحة checkout مع السعر المحسوب حسب العملة المختارة
    const priceCalc = calculatePrice(product, currency);
    const productId = getProductId(product);
    const productName = getProductName(product);
    
    const checkoutUrl = `/checkout?product=${productId}&name=${encodeURIComponent(productName)}&price=${priceCalc.finalPrice.toFixed(2)}&currency=${currency}`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className={`grid ${gridCols} gap-4 sm:gap-6 md:gap-8`}>
      {displayProducts.slice(0, maxProducts).map((product, index) => {
        const priceCalc = calculatePrice(product, currency);
        const productId = getProductId(product);
        const productName = getProductName(product);
        const productImage = getProductImage(product);
        const isInWishlist = wishlist.includes(productId);
        
        // Debug logging
        console.log('ProductGrid - Product:', productName, 'Image:', productImage);
        
        return (
          <ScrollReveal
            key={productId}
            delay={index * 150}
            duration={800}
            distance={80}
            direction="up"
            disabled={true}
          >
            <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
              {/* Product Image */}
              <Link href={`/products/${productId}`}>
                <div className="relative h-56 sm:h-64 overflow-hidden group cursor-pointer">
                  <img
                    src={`${productImage}?v=${Date.now()}`}
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded:', productImage);
                      e.currentTarget.style.opacity = '1';
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', productImage);
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.border = '2px dashed #d1d5db';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleWishlist(productId);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      isInWishlist 
                        ? 'bg-red-500/80 text-white' 
                        : 'bg-white/20 text-white hover:bg-red-500/80'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <Link href={`/products/${productId}`}>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 hover:text-primary-300 transition-colors cursor-pointer line-clamp-2">
                    {productName}
                  </h3>
                </Link>
                
                {/* Product Description */}
                {product.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (product.rating || 5) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-sm mr-2">
                    ({product.rating || 5})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <PriceDisplay 
                    price={priceCalc.finalPrice} 
                    currency={currency}
                    originalPrice={product.originalPrice}
                    className="text-xl sm:text-2xl font-bold"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  {product.price === 0 || product.price === "مجاني" ? (
                    <button
                      onClick={() => handleDirectPayment(product)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">تحميل مجاني</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">أضف للسلة</span>
                      </button>
                      <button
                        onClick={() => handleDirectPayment(product)}
                        className="bg-gradient-to-r from-accent-600 to-primary-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">اشترِ الآن</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
