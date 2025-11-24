'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrustBadges from '@/components/TrustBadges';
import DiscountCodeInput from '@/components/DiscountCodeInput';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getCurrencySymbol } from '@/lib/currency';
import Link from 'next/link';
// import { ProductImage } from '@/components/OptimizedImage'; // مؤقتاً معطل
import PriceDisplay from '@/components/PriceDisplay';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal, 
    currency, 
    clearCart
  } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [appliedCodes, setAppliedCodes] = useState<string[]>([]);
  const [totalDiscount, setTotalDiscount] = useState(0);

  // حساب المجموع مع الخصومات
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * totalDiscount) / 100;
  const finalTotal = subtotal - discountAmount;

  // دوال التعامل مع أكواد الخصم
  const handleDiscountApplied = (discountPercent: number, code: string) => {
    setAppliedCodes(prev => [...prev, code]);
    setTotalDiscount(prev => prev + discountPercent);
  };

  const handleDiscountRemoved = (code: string) => {
    setAppliedCodes(prev => prev.filter(c => c !== code));
    // في التطبيق الحقيقي، يجب حفظ نسبة كل كود منفصلة
    // هنا نفترض أن كل كود له نفس النسبة للبساطة
    setTotalDiscount(0);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError('');

    try {
      // 🛒 تجهيز بيانات السلة
      const cartItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      // 💳 إنشاء طلب الدفع
      const response = await fetch('/api/payment_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          customerEmail: customerEmail,
          totalAmount: finalTotal,
          currency: currency
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // 💾 حفظ بيانات السلة في localStorage للاسترجاع في صفحة النجاح
        localStorage.setItem('cart', JSON.stringify(cartItems));
        localStorage.setItem('customerEmail', customerEmail);
        localStorage.setItem('totalAmount', finalTotal.toString());
        localStorage.setItem('currency', currency);

        // 🔄 إعادة توجيه إلى صفحة الدفع
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'فشل في إنشاء رابط الدفع');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الطلب');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <section className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                سلة التسوق فارغة
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
              </p>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5" />
                تصفح المنتجات
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <section className="pt-24 pb-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              سلة التسوق
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              لديك {cart.length} {cart.length === 1 ? 'منتج' : 'منتجات'} في السلة
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
              <p className="text-red-800 dark:text-red-200 text-center font-semibold">
                ⚠️ {error}
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-6 animate-scale-in hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        style={{ 
                          display: 'block',
                          visibility: 'visible',
                          opacity: 1
                        }}
                        onLoad={(e) => {
                          console.log('Cart image loaded:', item.image);
                          e.currentTarget.style.opacity = '1';
                        }}
                        onError={(e) => {
                          console.error('Cart image failed to load:', item.image);
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.border = '2px dashed #d1d5db';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 text-center md:text-right">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                        <PriceDisplay price={item.price} currency={currency} />
                      </p>

                      {/* Quantity Controls & Remove Button */}
                      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-1">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition"
                          >
                            <Minus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition"
                          >
                            <Plus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-center md:text-right mt-2 md:mt-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">المجموع</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        <PriceDisplay price={item.price * item.quantity} currency={currency} />
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                إفراغ السلة
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sticky top-24 animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  ملخص الطلب
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>المجموع الفرعي</span>
                    <span className="font-semibold">{subtotal.toFixed(2)} {getCurrencySymbol(currency)}</span>
                  </div>
                  
                  {/* عرض الخصم إذا كان موجود */}
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>الخصم ({totalDiscount}%)</span>
                      <span className="font-semibold">-{discountAmount.toFixed(2)} {getCurrencySymbol(currency)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>الإجمالي</span>
                      <span>{finalTotal.toFixed(2)} {getCurrencySymbol(currency)}</span>
                    </div>
                  </div>
                </div>

                {/* مكون أكواد الخصم */}
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <DiscountCodeInput
                    onDiscountApplied={handleDiscountApplied}
                    onDiscountRemoved={handleDiscountRemoved}
                    appliedCodes={appliedCodes}
                    disabled={isCheckingOut}
                  />
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    سيتم إرسال المنتجات إلى هذا البريد الإلكتروني
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !customerEmail}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      إتمام الدفع الآن
                    </>
                  )}
                </button>

                <Link
                  href="/#products"
                  className="block text-center mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                >
                  متابعة التسوق
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <ShoppingBag className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                      ستتلقى المنتجات الرقمية فوراً عبر البريد الإلكتروني بعد إتمام الطلب
                    </p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6">
                  <TrustBadges variant="compact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
