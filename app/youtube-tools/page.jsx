'use client';

import { useState } from 'react';
import { Star, ShoppingCart, Heart, ArrowLeft, Zap, Download, Users } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import { calculatePrice, formatPrice } from '@/lib/currency';
import { youtubeToolsProducts } from './data';
import Link from 'next/link';
import Image from 'next/image';

export default function YouTubeToolsPage() {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();

  // Helper function to get unified product ID
  const getProductId = (product) => product.product_id ?? product.id ?? 1;

  // Helper function to get unified product name
  const getProductName = (product) => product.name ?? product.product_name ?? 'منتج';

  // Helper function to get unified product image
  const getProductImage = (product) => product.image ?? product.product_image ?? '/placeholder.jpg';

  const handleAddToCart = (product) => {
    const priceCalc = calculatePrice(product, currency);
    const productId = getProductId(product);
    const productName = getProductName(product);
    const productImage = getProductImage(product);
    
    addToCart({
      id: productId,
      name: productName,
      price: priceCalc.discountedPrice,
      image: productImage,
    });
    showToast('تمت إضافة المنتج إلى السلة بنجاح! ✅', 'cart');
  };

  const handleWishlist = (productId) => {
    if (!wishlist.includes(productId)) {
      addToWishlist(productId);
      showToast('تمت إضافة المنتج إلى قائمة الأمنيات! ❤️', 'wishlist');
    }
  };

  const handleDirectPayment = (product) => {
    const priceCalc = calculatePrice(product, currency);
    const productId = getProductId(product);
    const productName = getProductName(product);
    
    const params = new URLSearchParams({
      id: productId.toString(),
      name: productName,
      price: priceCalc.finalPrice.toString(),
      currency: currency,
    });
    
    window.location.href = `/checkout?${params.toString()}`;
  };

  // Generate product slug for dynamic routing
  const generateSlug = (productName) => {
    return productName
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w-]/g, '')
      .toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-right">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              🎬 أدوات اليوتيوبرز
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
              حزم جاهزة تساعدك على تطوير فيديوهاتك بسهولة
            </p>
          </div>
          
          {/* Back to Home Button */}
          <Link 
            href="/" 
            className="flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 backdrop-blur-md border border-gray-600/30"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">العودة للرئيسية</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {youtubeToolsProducts.map((product) => {
            const priceCalc = calculatePrice(product, currency);
            const productId = getProductId(product);
            const productName = getProductName(product);
            const productImage = getProductImage(product);
            const productSlug = generateSlug(productName);
            const isInWishlist = wishlist.includes(productId);

            return (
              <div
                key={productId}
                className="group bg-gray-800/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-gray-600/20 hover:border-primary-300/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-300/10"
              >
                {/* Product Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Link href={`/products/${productSlug}`}>
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlist(productId)}
                    className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
                      isInWishlist
                        ? 'bg-red-500/80 text-white'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-red-500/80 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-primary-300 to-accent-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      مميز
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-6">
                  {/* Product Name */}
                  <Link href={`/products/${productSlug}`}>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-200 line-clamp-2">
                      {productName}
                    </h3>
                  </Link>

                  {/* Product Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {product.description?.split('\\n')[0] || 'وصف المنتج'}
                  </p>

                  {/* Rating & Buyers */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-semibold text-sm">
                        {product.rating || 4.5}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Users className="w-3 h-3" />
                      <span>{product.buyers || 'جديد'}</span>
                    </div>
                  </div>

                  {/* File Size */}
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
                    <Download className="w-3 h-3" />
                    <span>الحجم: {product.file_size_mb ? `${(product.file_size_mb / 1000).toFixed(1)} جيجا` : 'غير محدد'}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-primary-300">
                        {formatPrice(priceCalc.finalPrice, currency)}
                      </span>
                      {priceCalc.hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(priceCalc.originalPrice, currency)}
                        </span>
                      )}
                    </div>
                    {priceCalc.hasDiscount && (
                      <div className="text-center">
                        <span className="text-xs text-green-400 font-semibold">
                          وفر {formatPrice(priceCalc.savings, currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDirectPayment(product)}
                      className="flex-1 bg-gradient-to-r from-primary-300 to-accent-600 hover:from-primary-400 hover:to-accent-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-300/25"
                    >
                      <Zap className="w-4 h-4" />
                      اشتري الآن
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gray-700/60 hover:bg-gray-600/60 text-white p-2.5 rounded-lg transition-all duration-200 backdrop-blur-md border border-gray-600/30 hover:border-gray-500/50"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-md rounded-2xl p-8 border border-gray-600/20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              🚀 ابدأ رحلتك في صناعة المحتوى
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              احصل على جميع الأدوات التي تحتاجها لإنشاء محتوى يوتيوب احترافي وجذاب
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300 to-accent-600 hover:from-primary-400 hover:to-accent-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary-300/25"
            >
              <ArrowLeft className="w-5 h-5" />
              استكشف المزيد من المنتجات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

