'use client';

import { useState, useEffect } from 'react';
import { Check, Clock, Star } from 'lucide-react';

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

interface SubscriptionDurationSelectorProps {
  productId: number;
  variants?: any[];
  onDurationChange: (option: DurationOption) => void;
  className?: string;
}

export default function SubscriptionDurationSelector({ 
  productId, 
  variants,
  onDurationChange, 
  className = '' 
}: SubscriptionDurationSelectorProps) {
  
  const [options, setOptions] = useState<DurationOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<DurationOption | null>(null);

  useEffect(() => {
    // استخدام البيانات المُمررة مباشرة أو تحميلها من ملف JSON
    const loadProductData = async () => {
      try {
        let productVariants = variants;
        
        // إذا لم تُمرر البيانات، حمّلها من الملف
        if (!productVariants) {
          const response = await fetch('/data/products.json');
          const products = await response.json();
          const product = products.find((p: any) => p.product_id === productId);
          productVariants = product?.subscription_plans || product?.variants;
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
            popular: variant.popular || variant.duration === '6 أشهر',
            description: variant.description || (
              variant.duration === 'شهر' ? 'مثالي للتجربة' :
              variant.duration === '3 أشهر' ? 'خيار شائع' :
              variant.duration === '6 أشهر' ? 'أفضل قيمة' : 'أقصى توفير'
            )
          }));
          
          setOptions(durationOptions);
          setSelectedOption(durationOptions[0]); // اختيار الخيار الأول افتراضياً
        }
      } catch (error) {
        console.error('Error loading product data:', error);
      }
    };

    loadProductData();
  }, [productId, variants]);

  const handleOptionSelect = (option: DurationOption) => {
    setSelectedOption(option);
    onDurationChange(option);
  };

  // حساب السعر الشهري
  const getMonthlyPrice = (option: DurationOption) => {
    return (option.price / option.months).toFixed(2);
  };

  if (!selectedOption || options.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">جاري تحميل خيارات الاشتراك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* العنوان */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">اختر مدة الاشتراك</h3>
        <p className="text-gray-400 text-sm">كلما زادت المدة، كلما وفرت أكثر!</p>
      </div>

      {/* خيارات المدة */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedOption.id === option.id
                ? 'border-primary-400 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                : 'border-gray-600 bg-dark-400/50 hover:border-gray-500'
            }`}
          >
            {/* شارة الأكثر شعبية */}
            {option.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>الأكثر شعبية</span>
                </div>
              </div>
            )}

            {/* أيقونة التحديد */}
            <div className="absolute top-3 right-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption.id === option.id
                  ? 'border-primary-400 bg-primary-500'
                  : 'border-gray-500'
              }`}>
                {selectedOption.id === option.id && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>

            {/* محتوى الخيار */}
            <div className="space-y-2">
              {/* المدة والوصف */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-semibold text-white text-center">{option.duration}</span>
              </div>
              
              <p className="text-gray-400 text-sm">{option.description}</p>

              {/* السعر */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{option.price} ر.س</span>
                  {option.originalPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      {option.originalPrice} ر.س
                    </span>
                  )}
                </div>
                
                {/* السعر الشهري */}
                <p className="text-gray-400 text-sm">
                  {getMonthlyPrice(option)} ر.س/شهر
                </p>

                {/* نسبة التوفير */}
                {option.savings && (
                  <div className="inline-block bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    {option.savings}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ملخص الخيار المحدد */}
      <div className="bg-dark-300/50 rounded-lg p-4 border border-primary-300/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white">الخيار المحدد: {selectedOption.duration}</h4>
            <p className="text-gray-400 text-sm">
              {selectedOption.months} {selectedOption.months === 1 ? 'شهر' : 'أشهر'} من Netflix
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-400">{selectedOption.price} ر.س</div>
            <div className="text-gray-400 text-sm">{getMonthlyPrice(selectedOption)} ر.س/شهر</div>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">ℹ</span>
          </div>
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">معلومات مهمة:</p>
            <ul className="space-y-1 text-blue-300">
              <li>• الحساب مشترك وليس شخصي</li>
              <li>• يعمل في جميع الدول</li>
              <li>• دعم فني 24/7</li>
              <li>• ضمان لكامل المدة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
