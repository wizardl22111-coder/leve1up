import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/orders-store";
import crypto from "crypto";
import products from '@/data/products.json';
import { createSecureDownloadUrl } from "@/lib/download-utils";
import { Resend } from "resend";

// 🔄 تخزين مؤقت لمعرفات الدفع المنشأة لمنع التكرار
const paymentIntentCache = new Map<string, any>();

// 🧹 تنظيف الكاش كل 30 دقيقة
setInterval(() => {
  paymentIntentCache.clear();
  console.log('🧹 Cleared payment intent cache');
}, 30 * 60 * 1000);

// 📧 دالة إرسال بريد للمنتجات المجانية
async function sendFreeProductEmail(order: any): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  if (!resend || !process.env.RESEND_API_KEY) {
    console.warn("⚠️ Resend API key not configured, skipping email");
    return;
  }

  const downloadUrl = createSecureDownloadUrl(order.items[0]?.name || 'free-product');
  
  const emailHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>منتجك المجاني جاهز!</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; direction: rtl;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 منتجك المجاني جاهز!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">شكراً لك على اهتمامك بمنتجاتنا</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          <div style="background-color: #f0f9ff; border-right: 4px solid #0ea5e9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 20px;">📦 تفاصيل المنتج</h2>
            <p style="margin: 5px 0; color: #374151;"><strong>اسم المنتج:</strong> ${order.items[0]?.name || 'منتج رقمي مجاني'}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>السعر:</strong> مجاني 🆓</p>
            <p style="margin: 5px 0; color: #374151;"><strong>رقم الطلب:</strong> ${order.id}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>تاريخ الطلب:</strong> ${new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
              📥 تحميل المنتج الآن
            </a>
          </div>

          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>💡 ملاحظة:</strong> رابط التحميل صالح لمدة 24 ساعة من وقت إرسال هذا البريد.
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              إذا واجهت أي مشكلة في التحميل، لا تتردد في التواصل معنا على 
              <a href="mailto:support@leve1up.store" style="color: #3b82f6;">support@leve1up.store</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2024 Level Up Store. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'Level Up Store <orders@leve1up.store>',
      to: [order.customerEmail],
      subject: `🎉 منتجك المجاني جاهز للتحميل - ${order.items[0]?.name}`,
      html: emailHtml,
    });
    
    console.log(`📧 Free product email sent to: ${order.customerEmail}`);
  } catch (error) {
    console.error('❌ Error sending free product email:', error);
    throw error;
  }
}

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

    // 🖼️ البحث عن صورة المنتج من products.json (تعريف مبكر لتجنب خطأ الاستخدام قبل التعريف)
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

    // 🔄 إنشاء مفتاح idempotency للتحقق من التكرار
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${customerEmail}-${productName}-${amount}-${finalCurrency}`)
      .digest('hex');

    // التحقق من وجود payment intent مسبق لنفس البيانات
    if (paymentIntentCache.has(idempotencyKey)) {
      const cachedIntent = paymentIntentCache.get(idempotencyKey);
      console.log("🔄 Returning cached payment intent:", cachedIntent.id);
      return NextResponse.json(cachedIntent);
    }
    
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

    // 🆓 معالجة خاصة للمنتجات المجانية
    if (amount <= 0) {
      console.log("🆓 Processing free product:", productName);
      
      // إنشاء طلب مجاني مباشرة بدون الذهاب إلى Ziina
      const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const freeSessionId = crypto.randomUUID();
      
      // حفظ الطلب المجاني في Redis
      const freeOrder = {
        id: orderId,
        sessionId: freeSessionId,
        status: 'completed' as const, // مكتمل مباشرة
        amount: 0,
        currency: finalCurrency,
        customerEmail: customerEmail || '',
        items: [{
          id: 0,
          name: productName || 'منتج رقمي مجاني',
          quantity: 1,
          price: 0,
          image: productImage,
          downloadUrl: productFile || ''
        }],
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        paymentId: `free_${orderId}`,
        paymentMethod: 'free'
      };

      await saveOrder(freeOrder);
      console.log("✅ Free order saved:", orderId);

      // إرسال بريد التأكيد للمنتج المجاني
      try {
        await sendFreeProductEmail(freeOrder);
        console.log("📧 Free product email sent successfully");
      } catch (emailError) {
        console.error("❌ Error sending free product email:", emailError);
      }

      return NextResponse.json({
        success: true,
        orderId: orderId,
        sessionId: freeSessionId,
        message: 'تم الحصول على المنتج المجاني بنجاح! تحقق من بريدك الإلكتروني.',
        downloadUrl: createSecureDownloadUrl(productName || 'free-product'),
        isFree: true
      });
    }

    // 🚨 تحقق من الحد الأدنى للمنتجات المدفوعة فقط
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

    // 💾 حفظ payment intent في الكاش لمنع التكرار
    paymentIntentCache.set(idempotencyKey, data);
    
    // 💾 حفظ الطلب في Redis قبل إرجاع الرابط للعميل
    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    

    
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
