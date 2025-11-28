'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Star, Check, Users, Shield, Zap, CheckCircle, ShoppingBag, Download, ArrowRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import { calculatePrice, formatPrice } from '@/lib/currency';
import testimonials from '@/data/testimonials.json';
// import { ProductImage } from './OptimizedImage'; // مؤقتاً معطل
import WhyBuySection from './WhyBuySection';
import FreeProductModal from './FreeProductModal';
import ProductDescriptionBoxes from './ProductDescriptionBoxes';
import PriceDisplay from './PriceDisplay';
import ReviewSummary from './ReviewSummary';
import SubscriptionDurationSelector from './SubscriptionDurationSelector';
import DiscordNitroFAQ from './DiscordNitroFAQ';



interface ProductSection {
  title?: string;
  items?: string[];
}

interface ProductSections {
  features?: ProductSection;
  whatYouWillLearn?: ProductSection;
  requirements?: ProductSection;
  whatYouWillGet?: ProductSection;
}

interface Product {
  // New schema fields
  product_id?: number;
  product_name?: string;
  product_name_en?: string;
  product_image?: string;
  download_url?: string;
  filename?: string;
  file_size_mb?: number;
  tags?: string[];
  active?: boolean;
  
  // Legacy fields (for backward compatibility)
  id?: number;
  name?: string;
  nameEn?: string;
  shortDescription?: string;
  description?: string;
  sections?: ProductSections;
  price?: number;
  originalPrice?: number;
  priceAED?: number;
  priceKWD?: number;
  priceQAR?: number;
  priceBHD?: number;
  priceOMR?: number;
  priceJOD?: number;
  priceEGP?: number;
  priceLBP?: number;
  priceSYP?: number;
  priceIQD?: number;
  priceTND?: number;
  priceMAD?: number;
  priceDZD?: number;
  priceUSD?: number;
  priceEUR?: number;
  currency?: string;
  category?: string;
  image?: string;
  rating?: number;
  buyers?: number | string;
  buyers_text?: string;
  inStock?: boolean;
  featured?: boolean;
  features?: string[];
  variants?: any[];
  subscription_plans?: any[];
}

export default function ProductDetail({ product }: { product?: Product }) {
  const { currency, addToCart, addToWishlist, wishlist } = useApp();
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showSimplifiedDescription, setShowSimplifiedDescription] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<any>(null);

  // Early return if no product
  if (!product) {
    return (
      <section className="pt-20 sm:pt-24 pb-12 bg-dark-500 transition-colors duration-300">
        <div className="container-mobile">
          <div className="text-center text-white">
            <p className="text-xl">المنتج غير موجود</p>
          </div>
        </div>
      </section>
    );
  }

  // Helper function to get unified product ID
  const getProductId = () => product.product_id ?? product.id ?? 1;

  // Helper function to get unified product name
  const getProductName = () => product.name ?? product.product_name ?? 'منتج';

  // Helper function to get unified product image
  const getProductImage = () => product.image ?? product.product_image ?? '/placeholder.jpg';

  // حساب السعر باستخدام النظام الموحد
  // إذا كان هناك خطة محددة للاشتراك، استخدم سعرها، وإلا استخدم السعر الأساسي
  const currentPrice = selectedDuration ? selectedDuration.price : (product.price ?? 0);
  const currentOriginalPrice = selectedDuration ? selectedDuration.originalPrice : (product.originalPrice ?? currentPrice);
  const productWithUpdatedPrice = { 
    ...product, 
    price: currentPrice,
    originalPrice: currentOriginalPrice
  };
  const priceCalc = calculatePrice(productWithUpdatedPrice, currency);
  const productId = getProductId();
  const productName = getProductName();
  const productImage = getProductImage();

  // Get testimonials for this product
  const productTestimonials = testimonials.filter(t => t.productId === productId);

  const isInWishlist = wishlist.includes(productId);

  const handleAddToCart = () => {
    // Check if product is free
    if (priceCalc.finalPrice === 0 && (product as any).isFree) {
      setShowFreeModal(true);
      return;
    }
    
    // نحفظ السعر المخفض بـ SAR (discountedPrice) وليس finalPrice
    // لأن AppContext سيحوله تلقائياً للعملة الحالية
    // إذا كان هناك خطة محددة، استخدم سعرها
    const finalPrice = selectedDuration ? selectedDuration.price : priceCalc.discountedPrice;
    
    addToCart({
      id: productId,
      name: productName,
      price: finalPrice, // السعر بـ SAR بعد الخصم أو سعر الخطة المحددة
      image: productImage,
      // إضافة معلومات الخطة إذا كانت موجودة
      ...(selectedDuration && { 
        duration: selectedDuration.duration,
        variant: selectedDuration 
      })
    });
    showToast('تمت إضافة المنتج إلى السلة بنجاح! ✅', 'cart');
  };

  const handleWishlist = () => {
    if (!isInWishlist) {
      addToWishlist(productId);
      showToast('تمت إضافة المنتج إلى قائمة الأمنيات! ❤️', 'wishlist');
    }
  };

  const handlePayment = () => {
    // التوجيه إلى صفحة checkout مع السعر المحسوب حسب العملة المختارة
    const checkoutUrl = `/checkout?product=${productId}&name=${encodeURIComponent(productName)}&price=${priceCalc.finalPrice.toFixed(2)}&currency=${currency}`;
    window.location.href = checkoutUrl;
  };

  return (
    <section className="pt-20 sm:pt-24 pb-12 bg-dark-500 transition-colors duration-300">
      <div className="container-mobile">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="animate-scale-in">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-400 shadow-2xl">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-contain"
                style={{ 
                  display: 'block',
                  visibility: 'visible',
                  opacity: 1
                }}
                onLoad={(e) => {
                  console.log('Product detail image loaded:', productImage);
                  e.currentTarget.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error('Product detail image failed to load:', productImage);
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.border = '2px dashed #d1d5db';
                }}
              />
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="animate-slide-up space-y-6">
            {/* Back Button */}
            <div>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/40 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
              >
                <ArrowRight className="w-4 h-4" />
                العودة للخلف
              </button>
            </div>
            
            {/* Category Badge */}
            <div>
              <span className="inline-block px-4 py-2 bg-primary-300/20 border border-primary-300/40 text-primary-300 rounded-xl text-sm font-bold">
                {product.category === 'ebooks' ? 'كتاب رقمي' : 
                 product.category === 'editing-tools' ? 'أدوات المونتاج' :
                 product.category === 'youtube-tools' ? 'أدوات المونتاج' :
                 product.category === 'subscriptions' ? 'الاشتراكات' :
                 product.category ?? 'منتج رقمي'}
              </span>
            </div>

            {/* Product Title - Large & Prominent */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {productName}
            </h1>

            {/* Short Description - Simple & Clear */}
            {product.shortDescription && (
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed" style={{ fontSize: '16px' }}>
                {product.shortDescription}
              </p>
            )}

            {/* Rating and Buyers */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating ?? 0)
                        ? 'text-yellow-400 fill-yellow-400'
                         : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-white font-bold text-lg">
                  {product.rating ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-primary-300" />
                <span className="font-semibold">
                  {(product as any).buyers_text ? `${(product as any).buyers_text}: ${product.buyers}` :
                    (typeof product.buyers === 'string' 
                      ? product.buyers 
                      : `${(product.buyers ?? 0).toLocaleString()} مشتري`)}
                </span>
              </div>
            </div>

            {/* Subscription Duration Selector for Netflix */}
            {product.category === 'subscriptions' && productId === 10 && (
              <SubscriptionDurationSelector
                productId={productId}
                variants={product.subscription_plans || product.variants}
                onDurationChange={(option) => setSelectedDuration(option)}
                className="mb-6"
              />
            )}

            {/* Price Block - Enhanced */}
            <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm border border-primary-300/30 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-white">السعر</h3>
                {priceCalc.discountPercentage > 0 && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 rounded-xl text-red-400 text-sm font-bold">
                    خصم {priceCalc.discountPercentage}%
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {priceCalc.finalPrice === 0 ? (
                  <div className="space-y-2">
                    {priceCalc.originalPrice > 0 && (
                      <p className="text-lg sm:text-xl text-gray-500 line-through leading-relaxed">
                        السعر الأصلي: <PriceDisplay price={priceCalc.originalPrice} currency={currency} />
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <p className="text-4xl sm:text-5xl font-extrabold text-green-400 leading-tight">
                        مجاني! 🎉
                      </p>
                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/40 rounded-xl">
                        <span className="text-green-400 font-bold text-base">عرض محدود</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {priceCalc.discountPercentage > 0 && (
                      <p className="text-lg sm:text-xl text-gray-500 line-through leading-relaxed">
                        السعر الأصلي: <PriceDisplay price={priceCalc.originalPrice} currency={currency} />
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent leading-tight">
                        <PriceDisplay price={priceCalc.finalPrice} currency={currency} />
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* عبارة قصيرة للاشتراكات */}
              {product.category === 'subscriptions' && (
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    {product.product_id === 7 && "احصل على تفعيل مباشر لحسابك وابدأ استخدام أدوات ChatGPT فوراً."}
                    {product.product_id === 8 && "تمكين الوصول لحساب Gemini يتم لحظياً — بدون انتظار أو تعقيد."}
                    {product.product_id === 9 && "نحفّز اشتراكك مباشرة ليصبح جاهزاً للعمل خلال ثوانٍ."}
                    {product.product_id === 10 && "يتم تجهيز حساب Netflix الخاص بك مباشرة لتبدأ المشاهدة بدون تأخير."}
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-xl">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold text-sm">
                  {product.category === 'subscriptions' ? 'تفعيل فوري' : 'تسليم فوري'}
                </span>
              </div>
            </div>

            {/* CTA Buttons - Full Width Mobile */}
            <div className="space-y-3">
              {/* Buy Now / Direct Payment Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Show appropriate button based on product type */}
                {priceCalc.finalPrice === 0 && (product as any).isFree ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-green-500/30 active:scale-95 transition-all duration-300 touch-manipulation"
                    style={{ fontSize: '16px' }}
                  >
                    <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                    احصل عليه مجاناً 🎁
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handlePayment}
                      className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-green-500/30 active:scale-95 transition-all duration-300 touch-manipulation"
                      style={{ fontSize: '16px' }}
                    >
                      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                      اشتر الآن
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-primary-300 to-accent-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-primary-300/30 active:scale-95 transition-all duration-300 touch-manipulation"
                      style={{ fontSize: '16px' }}
                    >
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                      أضف للسلة
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="text-center p-3 sm:p-4 bg-dark-300/30 rounded-xl border border-primary-300/10">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-300 font-semibold">دفع آمن</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-dark-300/30 rounded-xl border border-primary-300/10">
                <Download className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-300 font-semibold">تحميل فوري</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-dark-300/30 rounded-xl border border-primary-300/10">
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-300 font-semibold">ضمان الجودة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-12 sm:mt-16">
            <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent mb-4 sm:mb-0">
                  عن المنتج
                </h2>
                
                {/* زر التبديل بين الوصف الطويل والمبسط */}
                <button
                  onClick={() => setShowSimplifiedDescription(!showSimplifiedDescription)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 text-blue-300 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 text-sm font-medium"
                >
                  {showSimplifiedDescription ? (
                    <>
                      <span>عرض الوصف الكامل</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>عرض ملخص المنتج</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* الوصف الطويل الأصلي */}
              {!showSimplifiedDescription && (
                <div className="prose prose-invert max-w-none">
                  {product.description.split('\n').map((paragraph, index) => {
                    if (!paragraph.trim()) return null;
                    
                    // Check if it's a heading (starts with emoji or bullet)
                    const isHeading = paragraph.match(/^[📘📚💡🎁🧩🎯🚀⚡📦📈📌•]/);
                    
                    if (isHeading) {
                      return (
                        <h3 key={index} className="text-lg sm:text-xl font-bold text-primary-300 mt-6 mb-3 first:mt-0">
                          {paragraph}
                        </h3>
                      );
                    }
                    
                    return (
                      <p key={index} className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              )}

              {/* الوصف المبسط (البوكسات) مع انيميشن */}
              {showSimplifiedDescription && (
                <div className="mt-4 animate-fade-in-up">
                  <ProductDescriptionBoxes 
                    productId={product.product_id || product.id || 0} 
                    productName={product.product_name || product.name || ''} 
                  />
                </div>
              )}
            </div>
          </div>
        )}



        {/* Sectioned Details - Mobile First */}
        {product.sections && (
          <div className="mt-12 sm:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Features Section */}
              {product.sections.features && (
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#6A0DAD' }}>
                    {product.sections.features.title}
                  </h2>
                  <ul className="space-y-3 sm:space-y-4">
                    {product.sections.features.items?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                        <span className="text-base leading-relaxed" style={{ color: '#EAEAEA', fontSize: '16px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What You Will Learn Section */}
              {product.sections.whatYouWillLearn && (
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#6A0DAD' }}>
                    {product.sections.whatYouWillLearn.title}
                  </h2>
                  <ul className="space-y-3 sm:space-y-4">
                    {product.sections.whatYouWillLearn.items?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                        <span className="text-base leading-relaxed" style={{ color: '#EAEAEA', fontSize: '16px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements Section */}
              {product.sections.requirements && (
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#6A0DAD' }}>
                    {product.sections.requirements.title}
                  </h2>
                  <ul className="space-y-3 sm:space-y-4">
                    {product.sections.requirements.items?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                        <span className="text-base leading-relaxed" style={{ color: '#EAEAEA', fontSize: '16px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What You Will Get Section */}
              {product.sections.whatYouWillGet && (
                <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/10 hover:border-primary-300/30 transition-all">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#6A0DAD' }}>
                    {product.sections.whatYouWillGet.title}
                  </h2>
                  <ul className="space-y-3 sm:space-y-4">
                    {product.sections.whatYouWillGet.items?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-300 flex-shrink-0 mt-0.5" />
                        <span className="text-base leading-relaxed" style={{ color: '#EAEAEA', fontSize: '16px' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}



        {/* Discord Nitro FAQ - Only for Discord Nitro products */}
        {(productId === 14 || productId === 15) && (
          <div className="mt-12 sm:mt-16">
            <DiscordNitroFAQ />
          </div>
        )}

        {/* Review Summary */}
        <div className="mt-12 sm:mt-16">
          <ReviewSummary 
            productId={product.product_id || product.id || 0}
            showTitle={true}
          />
        </div>

        {/* Share Your Review Box */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-dark-300/90 to-dark-400/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-primary-300/20 hover:border-primary-300/40 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                شارك رأيك بعد الدفع
              </h3>
              <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
                نحن نقدر رأيك! بعد شراء المنتج، شاركنا تجربتك لمساعدة العملاء الآخرين
              </p>
              <button className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                تقييم بعد الشراء
              </button>
            </div>
          </div>
        </div>

        {/* Why Buy Section */}
        <WhyBuySection />
      </div>

      {/* Free Product Modal */}
      <FreeProductModal
        isOpen={showFreeModal}
        onClose={() => setShowFreeModal(false)}
        productName={productName}
        productId={productId}
        downloadUrl={(product as any).download_url}
      />
    </section>
  );
}
