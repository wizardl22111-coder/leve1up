import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/orders-store";
import crypto from "crypto";
import products from '@/data/products.json';

export async function POST(req: Request) {
  try {
    // ✅ التحقق من وجود مفتاح Ziina API
    if (!process.env.ZIINA_SECRET_KEY && !process.env.ZIINA_API_KEY) {
      console.error("❌ Ziina API key not found in environment variables");
      return NextResponse.json(
        { error: "خدمة الدفع غير متاحة حالياً. يرجى المحاولة لاحقاً أو التواصل مع الدعم." },
        { status: 503 }
      );
    }

    const { amount, currency_code, productName, productFile, customerEmail } = await req.json();

    const finalCurrency = currency_code || "AED";

    console.log("💰 Received amount:", amount, finalCurrency);
    console.log("📦 Product:", productName);
    console.log("📧 Customer email:", customerEmail);
    
    // 🆔 إنشاء sessionId فريد محلياً (قبل الاتصال بـ Ziina)
    const sessionId = crypto.randomUUID();
    console.log("🆕 Generated sessionId:", sessionId);

    /**
     * 🧮 خريطة تحويل العملات إلى الوحدة الأدق (subunit)
     * Ziina تتطلب أن يُرسل المبلغ بالوحدة الأدق:
     * - AED, SAR, USD, EUR, GBP, INR, QAR = ×100
     * - BHD, KWD, OMR = ×1000
     */
    const subunitMap: Record<string, number> = {
      AED: 100,
      SAR: 100,
      BHD: 1000,
      KWD: 1000,
      OMR: 1000,
      QAR: 100,
      USD: 100,
      EUR: 100,
      GBP: 100,
      INR: 100,
    };

    const multiplier = subunitMap[finalCurrency] || 100;

    // 🔢 تحويل المبلغ إلى الوحدة الأدق
    const amountInSubunit = Math.round(amount * multiplier);

    // 🚨 تحقق من الحد الأدنى (2 AED أو ما يعادله)
    const minSubunit = finalCurrency === "BHD" || finalCurrency === "KWD" || finalCurrency === "OMR" ? 210 : 200;

    if (amountInSubunit < minSubunit) {
      console.error(`❌ الحد الأدنى للدفع هو ${minSubunit / multiplier} ${finalCurrency}`);
      return NextResponse.json(
        { error: `الحد الأدنى للدفع هو ${minSubunit / multiplier} ${finalCurrency}` },
        { status: 400 }
      );
    }

    const payload = {
      amount: amountInSubunit,
      currency_code: finalCurrency,
      message: `دفع مقابل ${productName}`,
      metadata: {
        sessionId, // ✅ إضافة sessionId في metadata
        productName,
        productFile,
        customerEmail,
      },
      success_url: `https://leve1up.store/success?session=${sessionId}`, // ✅ استخدام sessionId بدلاً من placeholder
      cancel_url: `https://leve1up.store/cancel?session=${sessionId}`,
      failure_url: `https://leve1up.store/cancel?session=${sessionId}`,
      test: true,
      allow_tips: false,
    };

    console.log("📤 Sending payload to Ziina:", JSON.stringify(payload, null, 2));

    // ✅ استخدام المفتاح المتاح (مع الأولوية للـ SECRET_KEY)
    const apiKey = process.env.ZIINA_SECRET_KEY || process.env.ZIINA_API_KEY;

    const res = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Error from Ziina:", err);
      console.error("❌ Response status:", res.status);
      
      // ✅ معالجة حالات فشل مختلفة مع رسائل موجهة
      let errorMessage = "حدث خطأ أثناء إنشاء الدفع";
      
      if (res.status === 401) {
        errorMessage = "خطأ في التحقق من الهوية. يرجى التواصل مع الدعم.";
      } else if (res.status === 400) {
        errorMessage = "بيانات الدفع غير صحيحة. يرجى المحاولة مرة أخرى.";
      } else if (res.status >= 500) {
        errorMessage = "خدمة الدفع غير متاحة حالياً. يرجى المحاولة لاحقاً.";
      }
      
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    const data = await res.json();
    const paymentIntentId = data.id;
    console.log("✅ Payment intent created:", paymentIntentId);
    
    // 💾 حفظ الطلب في Redis قبل إرجاع الرابط للعميل
    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    // 🖼️ البحث عن صورة المنتج من products.json
    let productImage = '';
    try {
      const product = products.find((p: any) => 
        p.product_name === productName || 
        p.product_name_en === productName ||
        p.download_url === productFile
      );
      if (product) {
        productImage = product.product_image || '';
        console.log('🖼️ Product image found:', productImage);
      }
    } catch (error) {
      console.log('⚠️ Could not find product image:', error);
    }
    
    try {
      await saveOrder({
        id: orderId,
        sessionId: sessionId, // ✅ إضافة sessionId للبحث من صفحة success
        paymentId: paymentIntentId, // ✅ paymentId للبحث من webhook
        status: 'pending',
        amount: amount,
        currency: currency_code || 'AED',
        customerEmail: customerEmail || '',
        items: [{
          id: 0,
          name: productName || 'منتج رقمي',
          quantity: 1,
          price: amount,
          image: productImage, // ✅ إضافة صورة المنتج
          downloadUrl: productFile || ''
        }],
        createdAt: new Date().toISOString(),
        metadata: {
          sessionId,
          productName,
          productFile,
          paymentIntentId
        }
      });
      
      console.log("💾 Order saved successfully:", orderId);
      console.log("🔗 SessionId:", sessionId);
      console.log("🔗 PaymentId:", paymentIntentId);
    } catch (saveError) {
      console.error("⚠️ Failed to save order (payment will still proceed):", saveError);
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error creating payment intent:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
