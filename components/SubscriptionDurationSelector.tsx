'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { calculatePrice } from '@/lib/currency';

interface DurationOption {
  id: string;
  duration: string;
  months: number;
  price: number;
  originalPrice?: number;
  savings?: string;
  popular?: boolean;
  description: string;
}

interface QualityOption {
  id: string;
  name: string;
  description: string;
  priceIncrease: number;
}

interface SubscriptionDurationSelectorProps {
  productId: number;
  variants?: any[];
  onDurationChange: (option: DurationOption, quality: QualityOption, finalPrice: number) => void;
  className?: string;
}

export default function SubscriptionDurationSelector({ 
  productId, 
  variants,
  onDurationChange, 
  className = '' 
}: SubscriptionDurationSelectorProps) {
  
  const { currency } = useApp();
  const [options, setOptions] = useState<DurationOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<DurationOption | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<QualityOption | null>(null);

  // خيارات الجودة
  const qualityOptions: QualityOption[] = [
    {
      id: 'basic',
      name: 'أساسي 1080p',
      description: 'جودة عالية الوضوح',
      priceIncrease: 0
    },
    {
      id: 'premium',
      name: 'مميز 4K UHD',
      description: 'جودة فائقة الوضوح',
      priceIncrease: 5
    }
  ];

  useEffect(() => {
    // استخدام البيانات المُمررة مباشرة أو تحميلها من ملف JSON
    const loadProductData = async () => {
      try {
        let productVariants = variants;
        
        // إذا لم تُمرر البيانات، حمّلها من الملف أو استخدم البيانات الافتراضية لـ Netflix
        if (!productVariants) {
          // بيانات افتراضية لمنتج Netflix
          if (productId === 10) {
            productVariants = [
              {
                duration: 'شهر',
                price: 11.99,
                originalPrice: 50,
                description: 'مثالي للتجربة'
              },
              {
                duration: '3 أشهر',
                price: 29.99,
                originalPrice: 150,
                description: 'خيار شائع',
                popular: true
              },
              {
                duration: '6 أشهر',
                price: 49.99,
                originalPrice: 300,
                description: 'أفضل قيمة'
              },
              {
                duration: '12 شهر',
                price: 119.99,
                originalPrice: 600,
                description: 'أقصى توفير'
              }
            ];
          } else {
            const response = await fetch('/data/products.json');
            const products = await response.json();
            const product = products.find((p: any) => p.product_id === productId);
            productVariants = product?.subscription_plans || product?.variants;
          }
        }
        
        if (productVariants && productVariants.length > 0) {
          const durationOptions: DurationOption[] = productVariants.map((variant: any, index: number) => ({
            id: `option-${index}`,
            duration: variant.duration,
            months: variant.duration === 'شهر' ? 1 : 
                   variant.duration === '3 أشهر' ? 3 :
                   variant.duration === '6 أشهر' ? 6 : 12,
            price: variant.price,
            originalPrice: variant.originalPrice,
            popular: variant.popular || variant.duration === '3 أشهر',
            description: variant.description || (
              variant.duration === 'شهر' ? 'مثالي للتجربة' :
              variant.duration === '3 أشهر' ? 'خيار شائع' :
              variant.duration === '6 أشهر' ? 'أفضل قيمة' : 'أقصى توفير'
            )
          }));
          
          setOptions(durationOptions);
          setSelectedOption(durationOptions[0]); // اختيار الخيار الأول افتراضياً
          setSelectedQuality(qualityOptions[0]); // اختيار الجودة الأساسية افتراضياً
        }
      } catch (error) {
        console.error('Error loading product data:', error);
      }
    };

    loadProductData();
  }, [productId, variants]);

  // إعادة حساب الأسعار عند تغيير العملة
  useEffect(() => {
    if (selectedOption && selectedQuality) {
      // تحويل السعر الأساسي
      const basePriceConverted = calculatePrice({ price: selectedOption.price, currency: 'SAR' }, currency).finalPrice;
      
      // تحويل زيادة الجودة
      const qualityIncreaseConverted = selectedQuality.priceIncrease > 0 ? 
        calculatePrice({ price: selectedQuality.priceIncrease, currency: 'SAR' }, currency).finalPrice : 0;
      
      const finalPrice = basePriceConverted + qualityIncreaseConverted;
      onDurationChange(selectedOption, selectedQuality, finalPrice);
    }
  }, [currency, selectedOption, selectedQuality, onDurationChange]);

  const handleOptionSelect = (option: DurationOption) => {
    setSelectedOption(option);
    if (selectedQuality) {
      // تحويل السعر الأساسي
      const basePriceConverted = calculatePrice({ price: option.price, currency: 'SAR' }, currency).finalPrice;
      
      // تحويل زيادة الجودة
      const qualityIncreaseConverted = selectedQuality.priceIncrease > 0 ? 
        calculatePrice({ price: selectedQuality.priceIncrease, currency: 'SAR' }, currency).finalPrice : 0;
      
      const finalPrice = basePriceConverted + qualityIncreaseConverted;
      onDurationChange(option, selectedQuality, finalPrice);
    }
  };

  const handleQualitySelect = (quality: QualityOption) => {
    setSelectedQuality(quality);
    if (selectedOption) {
      // تحويل السعر الأساسي
      const basePriceConverted = calculatePrice({ price: selectedOption.price, currency: 'SAR' }, currency).finalPrice;
      
      // تحويل زيادة الجودة
      const qualityIncreaseConverted = quality.priceIncrease > 0 ? 
        calculatePrice({ price: quality.priceIncrease, currency: 'SAR' }, currency).finalPrice : 0;
      
      const finalPrice = basePriceConverted + qualityIncreaseConverted;
      onDurationChange(selectedOption, quality, finalPrice);
    }
  };

  // حساب السعر الشهري مع العملة
  const getMonthlyPrice = (option: DurationOption, qualityIncrease: number = 0) => {
    // تحويل السعر الأساسي
    const basePriceConverted = calculatePrice({ price: option.price, currency: 'SAR' }, currency).finalPrice;
    
    // تحويل زيادة الجودة
    const qualityIncreaseConverted = qualityIncrease > 0 ? 
      calculatePrice({ price: qualityIncrease, currency: 'SAR' }, currency).finalPrice : 0;
    
    // حساب السعر الشهري
    const monthlyPrice = (basePriceConverted + qualityIncreaseConverted) / option.months;
    return monthlyPrice.toFixed(2);
  };

  // حساب السعر النهائي مع العملة
  const getFinalPrice = () => {
    if (!selectedOption || !selectedQuality) return 0;
    
    // تحويل السعر الأساسي
    const basePriceConverted = calculatePrice({ price: selectedOption.price, currency: 'SAR' }, currency).finalPrice;
    
    // تحويل زيادة الجودة
    const qualityIncreaseConverted = selectedQuality.priceIncrease > 0 ? 
      calculatePrice({ price: selectedQuality.priceIncrease, currency: 'SAR' }, currency).finalPrice : 0;
    
    return basePriceConverted + qualityIncreaseConverted;
  };

  // حساب سعر الخيار مع العملة
  const getOptionPrice = (option: DurationOption) => {
    const mockProduct = { price: option.price, currency: 'SAR' };
    const priceCalc = calculatePrice(mockProduct, currency);
    return priceCalc.finalPrice;
  };

  // حساب السعر الأصلي مع العملة
  const getOriginalPrice = (option: DurationOption) => {
    const mockProduct = { price: option.originalPrice, currency: 'SAR' };
    const priceCalc = calculatePrice(mockProduct, currency);
    return priceCalc.finalPrice;
  };

  // حساب زيادة الجودة مع العملة
  const getQualityIncrease = (priceIncrease: number) => {
    if (priceIncrease === 0) return 0;
    const mockProduct = { price: priceIncrease, currency: 'SAR' };
    const priceCalc = calculatePrice(mockProduct, currency);
    return priceCalc.finalPrice;
  };

  // حساب نسبة التوفير
  const getSavingsPercentage = (option: DurationOption) => {
    if (!option.originalPrice) return null;
    const savings = ((option.originalPrice - option.price) / option.originalPrice * 100).toFixed(0);
    return `وفر ${savings}%`;
  };

  if (!selectedOption || !selectedQuality || options.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">جاري تحميل خيارات الاشتراك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* العنوان الرئيسي */}
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">اختر مدة الاشتراك</h3>
        <p className="text-gray-400 text-base leading-relaxed">كلما زادت المدة، كلما وفرت أكثر!</p>
      </div>

      {/* خيارات المدة - شبكة محسّنة 2×2 على الكمبيوتر */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            role="radio"
            aria-checked={selectedOption.id === option.id}
            tabIndex={0}
            className={`relative p-6 lg:aspect-square lg:flex lg:flex-col lg:justify-center rounded-xl border-2 cursor-pointer transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-xl ${
              selectedOption.id === option.id
                ? 'border-primary-400 bg-primary-500/10 shadow-xl shadow-primary-500/25 ring-2 ring-primary-400/20'
                : 'border-gray-600 bg-dark-400/50 hover:border-gray-500 hover:bg-dark-400/70'
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOptionSelect(option);
              }
            }}
          >
            {/* شارة الأكثر شعبية */}
            {option.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                  <span>الأكثر شعبية</span>
                </div>
              </div>
            )}

            {/* أيقونة التحديد */}
            <div className="absolute top-4 right-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                selectedOption.id === option.id
                  ? 'border-primary-400 bg-primary-500 scale-110'
                  : 'border-gray-500 bg-transparent'
              }`}>
                {selectedOption.id === option.id && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>

            {/* محتوى البطاقة */}
            <div className="space-y-4 pt-2">
              {/* عنوان المدة */}
              <div className="text-center">
                <h4 className="text-xl font-bold text-white mb-1">{option.duration}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{option.description}</p>
              </div>

              {/* السعر الرئيسي */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-3xl font-bold text-white">{getOptionPrice(option).toFixed(2)}</span>
                  <span className="text-lg text-gray-300">{currency}</span>
                  {option.originalPrice && (
                    <span className="text-gray-500 line-through text-lg">
                      {getOriginalPrice(option).toFixed(2)} {currency}
                    </span>
                  )}
                </div>
                
                {/* السعر الشهري */}
                <p className="text-gray-400 text-sm font-medium">
                  {getMonthlyPrice(option)} {currency}/شهر
                </p>

                {/* نسبة التوفير */}
                {getSavingsPercentage(option) && (
                  <div className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-green-500/30">
                    {getSavingsPercentage(option)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* قسم اختيار جودة البث */}
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="text-xl font-bold text-white mb-2">اختر جودة البث</h4>
          <p className="text-gray-400 text-sm">اختر الجودة التي تناسب احتياجاتك</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {qualityOptions.map((quality) => (
            <div
              key={quality.id}
              onClick={() => handleQualitySelect(quality)}
              role="radio"
              aria-checked={selectedQuality.id === quality.id}
              tabIndex={0}
              className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedQuality.id === quality.id
                  ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-gray-600 bg-dark-400/50 hover:border-gray-500'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleQualitySelect(quality);
                }
              }}
            >
              {/* أيقونة الجودة */}
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedQuality.id === quality.id
                    ? 'border-blue-400 bg-blue-500'
                    : 'border-gray-500'
                }`}>
                  {selectedQuality.id === quality.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white">{quality.name}</h5>
                    {quality.id === 'premium' && (
                      <Zap className="w-4 h-4 text-yellow-400" />
                    )}
                    {quality.priceIncrease > 0 && (
                      <span className="text-blue-400 text-sm font-medium">
                        +{getQualityIncrease(quality.priceIncrease).toFixed(2)} {currency}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{quality.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ملخص السعر النهائي */}
      <div className="bg-gradient-to-r from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-xl p-6 border border-primary-300/20 shadow-xl">
        <div className="text-center space-y-4">
          <h4 className="text-xl font-bold text-white">ملخص الطلب</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-gray-300">
              <span>المدة المختارة:</span>
              <span className="font-medium">{selectedOption.duration}</span>
            </div>
            
            <div className="flex justify-between items-center text-gray-300">
              <span>جودة البث:</span>
              <span className="font-medium">{selectedQuality.name}</span>
            </div>
            
            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">السعر الإجمالي:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-400">
                    {getFinalPrice().toFixed(2)} {currency}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {getMonthlyPrice(selectedOption, selectedQuality.priceIncrease)} {currency}/شهر
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">ℹ</span>
          </div>
          <div className="text-sm text-blue-200 space-y-2">
            <p className="font-medium text-blue-100">معلومات مهمة:</p>
            <ul className="space-y-1.5 text-blue-300 leading-relaxed">
              <li>• الحساب مشترك وليس شخصي</li>
              <li>• يعمل في جميع الدول العربية</li>
              <li>• دعم فني متاح 24/7</li>
              <li>• ضمان استرداد لكامل المدة</li>
              <li>• تفعيل فوري خلال دقائق</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
