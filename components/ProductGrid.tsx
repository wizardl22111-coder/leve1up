'use client';

import { Star, ShoppingCart, Heart, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import { calculatePrice, formatPrice } from '@/lib/currency';
import products from '@/data/products.json';
import Link from 'next/link';
import Image from 'next/image';
import { useLoadingAnimation } from '@/hooks/useLoadingAnimation';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function ProductGrid() {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();
  const { isLoading, navigateWithLoading } = useLoadingAnimation({
    duration: 2500,
    message: 'جاري تحميل المنتج...'
  });

  // Helper function to get unified product ID
  const getProductId = (product: any) => product.product_id ?? product.id ?? 1;

  // Helper function to get unified product name
  const getProductName = (product: any) => product.name ?? product.product_name ?? 'منتج';

  // Helper function to get unified product image
  const getProductImage = (product: any) => product.image ?? product.product_image ?? '/images/default-product.jpg';

  // Helper function to get unified product price
  const getProductPrice = (product: any) => product.price ?? product.product_price ?? 0;

  // Helper function to get unified product discount
  const getProductDiscount = (product: any) => product.discount ?? product.product_discount ?? 0;

  // Helper function to get unified product rating
  const getProductRating = (product: any) => product.rating ?? product.product_rating ?? 4.5;

  const handleAddToCart = (product: any) => {
    const productId = getProductId(product);
    const productName = getProductName(product);
    addToCart(productId);
    showToast(`تم إضافة ${productName} إلى السلة`, 'cart');
  };

  const handleAddToWishlist = (product: any) => {
    const productId = getProductId(product);
    const productName = getProductName(product);
    addToWishlist(productId);
    showToast(`تم إضافة ${productName} إلى المفضلة`, 'wishlist');
  };

  const handleDirectPayment = (product: any) => {
    const productId = getProductId(product);
    const productName = getProductName(product);
    // Here you would typically redirect to payment page or open payment modal
    console.log(`جاري تحضير عملية الدفع لـ ${productName}...`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
      {products.map((product: any) => {
        const productId = getProductId(product);
        const productName = getProductName(product);
        const productImage = getProductImage(product);
        const productPrice = getProductPrice(product);
        const productDiscount = getProductDiscount(product);
        const productRating = getProductRating(product);
        
        const priceCalc = calculatePrice(product, currency);
        const isInWishlist = wishlist.includes(productId);
        
        return (
          <div
            key={productId}
            className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
          >
            {/* Product Image */}
            <div 
              className="relative h-56 sm:h-64 overflow-hidden group cursor-pointer"
              onClick={() => navigateWithLoading(`/products/${productId}`)}
            >
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {priceCalc.discountPercentage > 0 && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  خصم {priceCalc.discountPercentage}%
                </div>
              )}
              {product.isFree && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  مجاني 🎁
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
              {/* Rating and Wishlist */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(productRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-300 mr-2">({productRating})</span>
                </div>
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist
                      ? 'text-red-400 bg-red-400/10'
                      : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
                  />
                </button>
              </div>

              {/* Product Name */}
              <h3 
                className="text-lg sm:text-xl font-bold text-white mb-3 hover:text-primary-300 transition-colors line-clamp-2 cursor-pointer"
                onClick={() => navigateWithLoading(`/products/${productId}`)}
              >
                {productName}
              </h3>

              {/* Price Section */}
              <div className="mt-auto">
                {priceCalc.finalPrice === 0 ? (
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-green-400">مجاني</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {formatPrice(priceCalc.finalPrice, currency)}
                      </span>
                      {priceCalc.originalPrice > priceCalc.finalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(priceCalc.originalPrice, currency)}
                        </span>
                      )}
                    </div>
                    {priceCalc.originalPrice > priceCalc.finalPrice && (
                      <p className="text-sm text-green-400">
                        توفر {formatPrice(priceCalc.originalPrice - priceCalc.finalPrice, currency)}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {product.isFree ? (
                    <button
                      onClick={() => navigateWithLoading(`/products/${productId}`)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all text-center"
                    >
                      احصل عليه مجاناً
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-600/30 transition-all flex items-center justify-center gap-2"
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
          </div>
        );
      })}
      
      {/* Loading Animation */}
      <LoadingAnimation isLoading={isLoading} />
    </div>
  );
}
