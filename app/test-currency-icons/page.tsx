import CurrencyDisplay from '@/components/CurrencyDisplay';
import PriceDisplay from '@/components/PriceDisplay';

export default function TestCurrencyIcons() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">اختبار أيقونات العملات</h1>
        
        {/* اختبار CurrencyDisplay */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">مكون CurrencyDisplay</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span>الريال السعودي:</span>
              <CurrencyDisplay currency="SAR" />
            </div>
            <div className="flex items-center gap-2">
              <span>الدرهم الإماراتي:</span>
              <CurrencyDisplay currency="AED" />
            </div>
            <div className="flex items-center gap-2">
              <span>الدينار البحريني:</span>
              <CurrencyDisplay currency="BHD" />
            </div>
            <div className="flex items-center gap-2">
              <span>الدينار الكويتي:</span>
              <CurrencyDisplay currency="KWD" />
            </div>
          </div>
        </div>

        {/* اختبار PriceDisplay */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">مكون PriceDisplay</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* أسعار عادية */}
            <div>
              <h3 className="text-lg font-medium mb-3">أسعار عادية</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>منتج بالريال السعودي:</span>
                  <PriceDisplay amount={99.99} currency="SAR" className="text-lg font-bold" />
                </div>
                <div className="flex items-center justify-between">
                  <span>منتج بالدرهم الإماراتي:</span>
                  <PriceDisplay amount={149.99} currency="AED" className="text-lg font-bold" />
                </div>
              </div>
            </div>

            {/* أسعار مخفضة */}
            <div>
              <h3 className="text-lg font-medium mb-3">أسعار مخفضة</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>خصم على منتج:</span>
                  <PriceDisplay 
                    amount={79.99} 
                    oldPrice={149.99}
                    currency="SAR" 
                    className="text-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>عرض خاص:</span>
                  <PriceDisplay 
                    amount={199.99} 
                    oldPrice={299.99}
                    currency="AED" 
                    className="text-lg"
                  />
                </div>
              </div>
            </div>

            {/* منتجات مجانية */}
            <div>
              <h3 className="text-lg font-medium mb-3">منتجات مجانية</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>منتج مجاني:</span>
                  <PriceDisplay 
                    amount={0} 
                    oldPrice={99.99}
                    currency="SAR" 
                    className="text-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>عرض مجاني:</span>
                  <PriceDisplay 
                    amount={0} 
                    oldPrice={199.99}
                    currency="AED" 
                    className="text-lg"
                  />
                </div>
              </div>
            </div>

            {/* عرض العملة أولاً */}
            <div>
              <h3 className="text-lg font-medium mb-3">عرض العملة أولاً</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>عملة أولاً:</span>
                  <PriceDisplay 
                    amount={299.99} 
                    currency="SAR" 
                    showCurrencyFirst={true}
                    className="text-lg font-bold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>مع خصم:</span>
                  <PriceDisplay 
                    amount={199.99} 
                    oldPrice={399.99}
                    currency="AED" 
                    showCurrencyFirst={true}
                    className="text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* اختبار أحجام مختلفة */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">أحجام مختلفة</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span>صغير:</span>
              <PriceDisplay amount={99.99} currency="SAR" className="text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <span>متوسط:</span>
              <PriceDisplay amount={99.99} currency="SAR" className="text-lg" />
            </div>
            <div className="flex items-center gap-4">
              <span>كبير:</span>
              <PriceDisplay amount={99.99} currency="SAR" className="text-2xl font-bold" />
            </div>
            <div className="flex items-center gap-4">
              <span>كبير جداً:</span>
              <PriceDisplay amount={99.99} currency="SAR" className="text-4xl font-bold" />
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 text-center text-gray-400">
          <p>تم تحديث الأيقونات بالرموز الرسمية للعملات باللون الأبيض</p>
          <p>رمز الريال السعودي من البنك المركزي السعودي | رمز الدرهم الإماراتي من البنك المركزي الإماراتي</p>
        </div>
      </div>
    </div>
  );
}
