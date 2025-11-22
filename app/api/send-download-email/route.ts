import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSecureDownloadUrl } from '@/lib/download-utils';

// إعداد Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // التحقق من وجود مفتاح Resend API
    if (!resend) {
      console.error('❌ Resend API key not configured');
      return NextResponse.json(
        { error: 'خدمة البريد الإلكتروني غير متاحة حالياً' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { orderId, customerEmail, cartItems, totalAmount, currency, downloadLinks } = body;

    console.log('📧 Sending download email for cart order:', {
      orderId,
      customerEmail,
      itemsCount: cartItems?.length
    });

    // التحقق من البيانات المطلوبة
    if (!orderId || !customerEmail || !cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: 'بيانات الطلب غير مكتملة' },
        { status: 400 }
      );
    }

    // إنشاء روابط التحميل الآمنة
    const secureDownloadLinks = cartItems.map((item: any) => ({
      productName: item.name,
      downloadUrl: createSecureDownloadUrl(item.name),
      quantity: item.quantity,
      price: item.price
    }));

    // تجهيز قائمة المنتجات للإيميل
    const productsList = cartItems.map((item: any) => 
      `• ${item.name} (الكمية: ${item.quantity}) - ${item.price * item.quantity} ${currency}`
    ).join('\n');

    // تجهيز روابط التحميل للإيميل
    const downloadLinksHtml = secureDownloadLinks.map((link: any) => `
      <div style="margin: 15px 0; padding: 15px; background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 16px;">${link.productName}</h3>
        <a href="${link.downloadUrl}" 
           style="display: inline-block; background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          📥 تحميل المنتج
        </a>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
          الكمية: ${link.quantity} | السعر: ${link.price * link.quantity} ${currency}
        </p>
      </div>
    `).join('');

    // إرسال الإيميل
    const emailResult = await resend.emails.send({
      from: 'Leve1Up Store <orders@leve1up.store>',
      to: [customerEmail],
      subject: `🎉 تحميل منتجاتك - طلب #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #059669; font-size: 28px; margin: 0 0 10px 0;">🎉 تم الدفع بنجاح!</h1>
              <p style="color: #6b7280; font-size: 16px; margin: 0;">شكراً لك على شرائك من Leve1Up Store</p>
            </div>

            <!-- Order Details -->
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">📋 تفاصيل الطلب</h2>
              <div style="display: grid; gap: 8px;">
                <p style="margin: 0; color: #4b5563;"><strong>رقم الطلب:</strong> #${orderId}</p>
                <p style="margin: 0; color: #4b5563;"><strong>البريد الإلكتروني:</strong> ${customerEmail}</p>
                <p style="margin: 0; color: #4b5563;"><strong>تاريخ الطلب:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
                <p style="margin: 0; color: #4b5563;"><strong>المبلغ الإجمالي:</strong> ${totalAmount} ${currency}</p>
                <p style="margin: 0; color: #4b5563;"><strong>عدد المنتجات:</strong> ${cartItems.reduce((total: number, item: any) => total + item.quantity, 0)} منتج</p>
              </div>
            </div>

            <!-- Products List -->
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">🛍️ المنتجات المشتراة:</h3>
              <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; color: #4b5563; margin: 0; line-height: 1.6;">${productsList}</pre>
            </div>

            <!-- Download Links -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px;">📥 تحميل منتجاتك</h2>
              ${downloadLinksHtml}
            </div>

            <!-- Important Notes -->
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-right: 4px solid #f59e0b; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚠️ ملاحظات مهمة:</h3>
              <ul style="color: #92400e; margin: 0; padding-right: 20px; line-height: 1.6;">
                <li>روابط التحميل صالحة لمدة محدودة</li>
                <li>يمكنك تحميل كل منتج عدة مرات</li>
                <li>احفظ الملفات على جهازك بعد التحميل</li>
                <li>في حالة وجود أي مشكلة، تواصل معنا فوراً</li>
              </ul>
            </div>



            <!-- Review Request -->
            <div style="background-color: #fef7cd; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⭐ قيّم تجربتك معنا</h3>
              <p style="color: #92400e; margin: 0 0 15px 0;">رأيك يهمنا! شاركنا تجربتك لنتمكن من تحسين خدماتنا</p>
              <a href="https://leve1up.store/payment-success?order_id=${orderId}&type=cart#review" 
                 style="display: inline-block; background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                ⭐ إضافة تقييم
              </a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                شكراً لاختيارك Leve1Up Store - متجرك الموثوق للمنتجات الرقمية
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                <a href="https://leve1up.store" style="color: #3b82f6; text-decoration: none;">leve1up.store</a> |
                <a href="mailto:leve1up999q@gmail.com" style="color: #3b82f6; text-decoration: none;">الدعم الفني</a>
              </p>
            </div>

          </div>
        </div>
      `
    });

    console.log('✅ Download email sent successfully:', emailResult);

    return NextResponse.json({
      success: true,
      message: 'تم إرسال إيميل التحميل بنجاح',
      emailId: emailResult.data?.id
    });

  } catch (error: any) {
    console.error('❌ Error sending download email:', error);
    return NextResponse.json(
      { error: 'فشل في إرسال إيميل التحميل' },
      { status: 500 }
    );
  }
}
