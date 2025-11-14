import { NextResponse } from "next/server";
import { getCurrencySymbol, subunitMap, type Currency } from "@/lib/currency";
import { findOrderBySessionId, findOrderByPaymentId, updateOrder } from "@/lib/orders-store";
import { Resend } from "resend";
import { createSecureDownloadUrl } from "@/lib/download-utils";

// 📧 دالة للحصول على Resend client (lazy initialization)
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// دالة تحويل من الوحدة الصغرى إلى المبلغ الأساسي
function convertFromSubunit(amount: number, currency: string): number {
  const divisor = subunitMap[currency as Currency] || 100;
  return amount / divisor;
}

/**
 * ✉️ إرسال إيميل تأكيد الدفع مع روابط التحميل
 */
async function sendOrderEmail(order: any, amount: number, currency: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured, skipping email');
    return false;
  }

  try {
    const currencySymbol = getCurrencySymbol(currency as Currency);
    const items = order.items || [];
    const currentDate = new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // بناء قائمة المنتجات مع روابط التحميل الآمنة
    const productsHtml = items.map((item: any) => {
      // إنشاء رابط تحميل آمن عبر النطاق
      const secureDownloadUrl = item.downloadUrl 
        ? createSecureDownloadUrl(item.name)
        : null;
      
      return `
        <div style="background: #f8fffe; border: 1px solid #10b981; padding: 20px; margin: 15px 0; border-radius: 12px;">
          <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 18px; font-weight: bold;">📦 ${item.name}</h3>
          <p style="margin: 5px 0; color: #374151; font-size: 16px;">💰 السعر: ${item.price} ${currencySymbol}</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">📅 تاريخ الشراء: ${currentDate}</p>
          ${secureDownloadUrl ? `
            <div style="margin-top: 15px;">
              <a href="${secureDownloadUrl}" 
                 style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                🚀 تحميل المنتج الآن
              </a>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    const htmlEmailTemplate = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تم الدفع بنجاح - Leve1Up</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; position: relative;">
            <img src="https://leve1up.store/logo.png" alt="Leve1Up Logo" style="max-width: 120px; height: auto; margin-bottom: 20px; filter: brightness(0) invert(1);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🎉 تم الدفع بنجاح!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">إليك رابط تحميل منتجك</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #10b981; font-size: 24px; margin: 0 0 10px 0;">شكراً لاختيارك Leve1Up 💚</h2>
              <p style="font-size: 16px; color: #6b7280; margin: 0;">نحن سعداء بثقتك وندعمك في رحلة نجاحك</p>
            </div>

            <div style="background: #f0fdf4; border-right: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="font-size: 16px; color: #065f46; margin: 0; font-weight: bold;">
                ✅ تم استلام دفعتك بنجاح! يمكنك الآن تحميل منتجاتك من الأزرار أدناه:
              </p>
            </div>

            <!-- Products Section -->
            <div style="margin: 30px 0;">
              <h3 style="color: #374151; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">📋 تفاصيل المنتج</h3>
              ${productsHtml}
            </div>

            <!-- Total Amount -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; border: 2px solid #10b981;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <span style="font-size: 20px; color: #065f46; font-weight: bold;">💳 المبلغ المدفوع:</span>
                <span style="font-size: 28px; color: #10b981; font-weight: bold;">${amount} ${currencySymbol}</span>
              </div>
              <p style="margin: 10px 0 0 0; color: #059669; font-size: 14px;">تاريخ الدفع: ${currentDate}</p>
            </div>



            <div style="text-align: center; margin-top: 40px;">
              <p style="font-size: 16px; color: #6b7280; margin: 0 0 10px 0;">مع أطيب التحيات،</p>
              <p style="font-size: 18px; color: #10b981; font-weight: bold; margin: 0;">فريق Leve1Up 💚</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-size: 16px; color: #10b981; font-weight: bold;">شكراً لاختيارك Leve1Up 💚</p>
            <a href="https://leve1up.store" style="color: #059669; text-decoration: none; font-weight: bold; font-size: 14px;">🌐 leve1up.store</a>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
              © ${new Date().getFullYear()} Leve1Up Store. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // الحصول على اسم أول منتج للعنوان
    const firstProductName = items.length > 0 ? items[0].name : 'منتجك';
    
    const result = await resend.emails.send({
      from: 'Leve1Up Team <support@leve1up.store>',
      to: order.customerEmail,
      subject: `تم الدفع بنجاح - ${firstProductName}`,
      html: htmlEmailTemplate,
    });

    console.log('✉️ Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  console.log("📦 Webhook received from Ziina:", new Date().toISOString());
  console.log("📦 Payload:", JSON.stringify(body, null, 2));

  const event = body?.event;
  const data = body?.data;

  // فقط نهتم بحدث الدفع الناجح
  if (event === "payment_intent.status.updated" && data?.status === "completed") {
    const status = data?.status;
    const currencyCode = data?.currency_code || data?.currency || "SAR";
    const amountInSubunit = data?.amount || 0;
    // تحويل من الوحدة الصغرى إلى المبلغ الأساسي
    const amount = convertFromSubunit(amountInSubunit, currencyCode);
    const currencySymbol = getCurrencySymbol(currencyCode as Currency);
    const paymentId = data?.id;
    const message = data?.message || "عملية شراء من Leve1Up";

    console.log("🎉 Payment completed successfully!");
    console.log("💳 Payment ID:", paymentId);
    console.log("💰 Amount:", amount, currencySymbol);

    // 🔍 البحث عن الطلب في orders store باستخدام payment_intent ID
    const order = await findOrderByPaymentId(paymentId);
    
    if (!order) {
      // ℹ️ لا يوجد طلب في Redis - هذا طبيعي مع localStorage
      console.info("ℹ️ No order found for payment ID:", paymentId);
      console.info("📝 Payment details - Amount:", amount, currencySymbol);
      console.info("💡 Order delivered via client-side (localStorage)");
      
      return NextResponse.json({ 
        received: true, 
        note: "Order delivered via client-side localStorage" 
      }, { status: 200 });
    }

    console.log("✅ Order found:", order.id);
    console.log("📧 Customer email:", order.customerEmail);
    console.log("📦 Order items:", order.items?.length || 0);
    
    // 🟢 تحديث حالة الطلب إلى paid
    const updatedOrder = await updateOrder(order.id, { 
      status: 'paid',
      paidAt: new Date().toISOString() 
    });
    
    if (!updatedOrder) {
      console.error("❌ Failed to update order status");
      return NextResponse.json({ received: true, error: "Update failed" }, { status: 200 });
    }
    
    console.log("🟢 Order status updated to: paid");
    
    // ✉️ إرسال إيميل تأكيد فقط عند اكتمال الدفع
    if (status === "completed") {
      const emailSent = await sendOrderEmail(updatedOrder, amount, currencyCode);
      
      if (emailSent) {
        console.log(`✉️ Email sent successfully to: ${updatedOrder.customerEmail}`);
      } else {
        console.warn("⚠️ Email not sent (customer can still download from success page)");
      }
    }
    
    console.log("✅ Payment processed successfully!");
  } else {
    console.log("ℹ️ Webhook received but not a completed payment:", { event, status: data?.status });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
