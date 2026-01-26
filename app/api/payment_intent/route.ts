import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/orders-store";
import crypto from "crypto";
import products from '@/data/products.json';
import { Resend } from 'resend';
import { generateSecureDownloadUrl } from '@/lib/download-tokens';

/**
 * 📧 إرسال بريد للمنتجات المجانية
 */
async function sendFreeProductEmail(order: any): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured, skipping email');
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const items = order.items || [];
    const currentDate = new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // بناء قائمة المنتجات المجانية مع روابط التحميل
    const productsHtmlPromises = items.map(async (item: any) => {
      const secureDownloadUrl = item.downloadUrl 
        ? await generateSecureDownloadUrl(order.id, order.paymentId, item.downloadUrl, order.customerEmail)
        : null;
      
      return `
        <div style="background: #f0fdf4; border: 2px solid #22c55e; padding: 20px; margin: 15px 0; border-radius: 12px;">
          <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 18px; font-weight: bold;">🆓 ${item.name}</h3>
          <p style="margin: 5px 0; color: #22c55e; font-size: 16px; font-weight: bold;">💰 مجاني تماماً!</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">📅 تاريخ التحميل: ${currentDate}</p>
          ${secureDownloadUrl ? `
            <div style="margin-top: 15px;">
              <a href="${secureDownloadUrl}" 
                 style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                📥 تحميل المنتج المجاني
              </a>
            </div>
          ` : ''}
        </div>
      `;
    });
    
    const productsHtml = (await Promise.all(productsHtmlPromises)).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>منتجك المجاني جاهز للتحميل! 🎉</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎉 منتجك المجاني جاهز!</h1>
          <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 16px;">شكراً لك على اختيار Level Up Store</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">مرحباً بك! 👋</h2>
            <p style="color: #6b7280; font-size: 16px; margin: 0;">منتجك المجاني جاهز للتحميل الآن</p>
          </div>

          <div style="background: #f8fffe; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px;">📦 منتجاتك المجانية:</h3>
            ${productsHtml}
          </div>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚠️ ملاحظة مهمة:</h4>
            <ul style="color: #92400e; margin: 0; padding-right: 20px; font-size: 14px;">
              <li>روابط التحميل صالحة لمدة 24 ساعة من وقت الإرسال</li>
              <li>يمكنك تحميل المنتج مرة واحدة فقط</li>
              <li>احتفظ بهذا الإيميل للرجوع إليه لاحقاً</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              إذا واجهت أي مشكلة في التحميل، لا تتردد في التواصل معنا
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Level Up Store - متجرك للمنتجات الرقمية المتميزة<br>
              هذا الإيميل تم إرساله تلقائياً، يرجى عدم الرد عليه
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'Level Up Store <orders@leve1up.store>',
      to: [order.customerEmail],
      subject: '🎉 منتجك المجاني جاهز للتحميل - Level Up Store',
      html: emailHtml,
    });

    console.log('✅ Free product email sent successfully:', result.data?.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to send free product email:', error);
    return false;
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
    
    // 🆔 إنشاء sessionId فريد محلياً (قبل الاتصال بـ Ziina)
    const sessionId = crypto.randomUUID();
    console.log("🆕 Generated sessionId:", sessionId);
    
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
        console.log("🖼️ Product image found:", productImage);
      }
    } catch (imageError) {
      console.warn("⚠️ Could not find product image:", imageError);
    }

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

    // 🚨 تحقق من الحد الأدنى (2 AED أو ما يعادله) - استثناء للمنتجات المجانية
    const minSubunit = finalCurrency === "BHD" || finalCurrency === "KWD" || finalCurrency === "OMR" ? 210 : 200;

    if (amount > 0 && amountInSubunit < minSubunit) {
      console.error(`❌ الحد الأدنى للدفع هو ${minSubunit / multiplier} ${finalCurrency}`);
      return NextResponse.json(
        { error: `الحد الأدنى للدفع هو ${minSubunit / multiplier} ${finalCurrency}` },
        { status: 400 }
      );
    }

    // 🆓 معالجة خاصة للمنتجات المجانية
    if (amount === 0) {
      console.log("🆓 Free product detected - bypassing payment gateway");
      
      // إنشاء طلب مجاني مباشرة
      const orderId = `free_order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      
      try {
        await saveOrder({
          id: orderId,
          sessionId: sessionId,
          paymentId: `free_${sessionId}`, // معرف وهمي للمنتجات المجانية
          status: 'completed' as const, // مكتمل مباشرة
          amount: 0,
          currency: finalCurrency,
          customerEmail: customerEmail || '',
          items: [{
            id: 1, // معرف المنتج المجاني
            name: productName || 'منتج مجاني',
            quantity: 1,
            price: 0,
            image: productImage,
            downloadUrl: productFile || ''
          }],
          createdAt: new Date().toISOString(),
          metadata: {
            sessionId,
            productName,
            productFile,
            isFreeProduct: true
          }
        });
        
        console.log("💾 Free order saved successfully:", orderId);
        
        // إرسال بريد المنتج المجاني
        await sendFreeProductEmail({
          id: orderId,
          sessionId: sessionId,
          customerEmail: customerEmail,
          items: [{
            id: 1,
            name: productName || 'منتج مجاني',
            downloadUrl: productFile || ''
          }]
        });
        
        console.log("📧 Free product email sent successfully");
        
        // إرجاع رابط النجاح مباشرة
        return NextResponse.json({
          success_url: `https://leve1up.store/success?session=${sessionId}`,
          isFreeProduct: true,
          orderId: orderId,
          sessionId: sessionId
        });
        
      } catch (error) {
        console.error("❌ Error processing free product:", error);
        return NextResponse.json(
          { error: "حدث خطأ أثناء معالجة المنتج المجاني" },
          { status: 500 }
        );
      }
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
    
    // ✅ استخدام productImage المُعرّف في أعلى الدالة
    
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
