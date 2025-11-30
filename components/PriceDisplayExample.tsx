'use client';

import PriceDisplay from './PriceDisplay';

/**
 * 📋 مثال على استخدام مكون PriceDisplay الجديد
 * 
 * يوضح جميع الحالات المختلفة لعرض الأسعار مع أيقونات العملة SVG
 */

export default function PriceDisplayExample() {
  return (
    <div className="p-8 bg-gray-900 text-white space-y-6">
      <h2 className="text-2xl font-bold mb-6">أمثلة على عرض الأسعار</h2>
      
      {/* مثال 1: سعر عادي بالريال السعودي */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">سعر عادي - ريال سعودي</h3>
        <PriceDisplay 
          amount={99.99} 
          currency="SAR" 
          className="text-2xl font-bold"
        />
      </div>

      {/* مثال 2: سعر عادي بالدرهم الإماراتي */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">سعر عادي - درهم إماراتي</h3>
        <PriceDisplay 
          amount={149.50} 
          currency="AED" 
          className="text-2xl font-bold"
        />
      </div>

      {/* مثال 3: سعر مخفض (مع سعر قديم) */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">سعر مخفض - مع السعر القديم</h3>
        <PriceDisplay 
          amount={79.99} 
          oldPrice={149.99}
          currency="SAR" 
          className="text-xl"
        />
      </div>

      {/* مثال 4: منتج مجاني */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">منتج مجاني</h3>
        <PriceDisplay 
          amount={0} 
          currency="SAR" 
          className="text-xl"
        />
      </div>

      {/* مثال 5: منتج مجاني مع عرض السعر الأصلي */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">منتج مجاني - مع السعر الأصلي</h3>
        <PriceDisplay 
          amount={0} 
          oldPrice={99.99}
          currency="AED" 
          className="text-xl"
        />
      </div>

      {/* مثال 6: عرض العملة أولاً */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">عرض العملة أولاً</h3>
        <PriceDisplay 
          amount={299.99} 
          currency="SAR" 
          showCurrencyFirst={true}
          className="text-2xl font-bold"
        />
      </div>

      {/* مثال 7: في بطاقة منتج */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">مثال في بطاقة منتج</h3>
        <div className="bg-gray-700 p-4 rounded-lg max-w-sm">
          <div className="bg-gray-600 h-32 rounded mb-4 flex items-center justify-center">
            <span className="text-gray-400">صورة المنتج</span>
          </div>
          <h4 className="font-bold mb-2">اشتراك Netflix Premium</h4>
          <p className="text-gray-300 text-sm mb-3">اشتراك شهري كامل مع جودة 4K</p>
          <div className="flex items-center justify-between">
            <PriceDisplay 
              amount={45.99} 
              oldPrice={59.99}
              currency="SAR" 
              className="text-lg"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
              أضف للسلة
            </button>
          </div>
        </div>
      </div>

      {/* مثال 8: في خطة اشتراك */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">مثال في خطة اشتراك</h3>
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-lg max-w-sm text-center">
          <h4 className="text-xl font-bold mb-2">الخطة المميزة</h4>
          <p className="text-blue-100 mb-4">جميع الميزات + دعم أولوية</p>
          <div className="mb-4">
            <PriceDisplay 
              amount={199.99} 
              currency="AED" 
              className="text-3xl font-bold"
            />
            <p className="text-blue-100 text-sm mt-1">شهرياً</p>
          </div>
          <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg w-full hover:bg-gray-100">
            اختر هذه الخطة
          </button>
        </div>
      </div>
    </div>
  );
}

