"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import products from '@/data/products.json';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // قراءة المنتج من query string
  const productId = searchParams.get("product") || "1";
  const productName = searchParams.get("name") || "الربح من المنتجات الرقمية";
  const price = searchParams.get("price") || "39";
  const currency = searchParams.get("currency") || "AED";

  const currencyCodeMap: Record<string, string> = {
    AED: "AED", SAR: "SAR", BHD: "BHD", KWD: "KWD",
    OMR: "OMR", QAR: "QAR", USD: "USD", EUR: "EUR", GBP: "GBP", INR: "INR",
  };

  const getCurrencySymbol = (curr: string) => {
    const map: Record<string, string> = {
      AED: "د.إ", SAR: "ر.س", BHD: "د.ب", KWD: "د.ك",
      OMR: "ر.ع", QAR: "ر.ق", USD: "$", EUR: "€", GBP: "£", INR: "₹",
    };
    return map[curr] || "";
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("leve1up_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handlePay = async () => {
    if (!email || !email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // البحث عن المنتج في قاعدة البيانات
      const product = products.find(p => p.product_id === parseInt(productId));
      
      if (!product) {
        setError(`المنتج غير موجود (ID: ${productId}). يرجى المحاولة مرة أخرى.`);
        return;
      }

      // استخدام رابط التحميل من قاعدة البيانات (اختياري للاشتراكات)
      const productFile = product.download_url;
      
      // للاشتراكات، لا نحتاج رابط تحميل
      if (!productFile && product.category !== 'subscriptions') {
        setError(`رابط تحميل المنتج غير متوفر. يرجى التواصل مع الدعم الفني.`);
        return;
      }
      
      // حفظ البيانات في localStorage بنفس صيغة السلة
      const cartItem = [{
        id: parseInt(productId),
        name: productName,
        price: parseFloat(price),
        quantity: 1
      }];
      
      localStorage.setItem("cart", JSON.stringify(cartItem));
      localStorage.setItem("leve1up_email", email);
      localStorage.setItem("leve1up_total_amount", price);
      localStorage.setItem("currency", currency);
      localStorage.setItem("leve1up_product_name", productName);
      localStorage.setItem("leve1up_price", price);
      localStorage.setItem("leve1up_currency", currency);
      localStorage.setItem("leve1up_product_file", productFile || "");
      
      const currencyCode = currencyCodeMap[currency] || "AED";

      const res = await fetch("/api/payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(price),
          currency_code: currencyCode,
          productName,
          productFile: productFile || "",
          customerEmail: email,
        }),
      });

      // ✅ فحص استجابة HTTP قبل معالجة البيانات
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'خطأ في الخادم' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("📊 Payment response:", data);

      // ✅ دعم متغيرات اسم الرابط المختلفة
      if (data.redirect_url) {
        console.log("🔗 Redirecting to:", data.redirect_url);
        window.location.href = data.redirect_url;
      } else if (data.url) {
        console.log("🔗 Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "لم يتم الحصول على رابط الدفع");
      }
    } catch (err: any) {
      console.error("❌ Payment error:", err);
      // ✅ رسالة خطأ واضحة وموجهة للمستخدم
      setError(err.message || "فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-black px-4">
      <div className="max-w-md w-full bg-gray-800/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">🛒 تابع عملية الدفع</h1>

        {/* معلومات المنتج */}
        <div className="bg-gray-700/40 p-4 rounded-lg mb-6">
          <p className="text-gray-300 mb-2">
            <strong className="text-white">المنتج:</strong> {productName}
          </p>
          <p className="text-gray-300">
            <strong className="text-white">السعر:</strong> {price} {getCurrencySymbol(currency)}
          </p>
        </div>

        <p className="text-gray-300 mb-6">
          أدخل بريدك الإلكتروني لتصلك فاتورة ورابط تحميل المنتج بعد الدفع
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="border border-gray-600 bg-gray-700 text-white p-3 rounded-lg w-full text-center mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          disabled={!email || loading}
          onClick={handlePay}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "جارٍ إنشاء الدفع..." : "متابعة للدفع"}
        </button>

        <p className="text-sm text-gray-400 mt-4">الدفع آمن ومشفر عبر Ziina 🔒</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={<div className="text-center text-white mt-10">⏳ جاري تحميل صفحة الدفع...</div>}
    >
      <CheckoutContent />
    </Suspense>
  );
}
