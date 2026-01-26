import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import { createSecureDownloadUrl } from '@/lib/download-utils';

// إعداد Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// إعداد Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItems, totalAmount, currency, customerEmail } = body;



    // التحقق من البيانات المطلوبة
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'السلة فارغة أو غير صحيحة' },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'المبلغ الإجمالي غير صحيح' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب وغير صحيح' },
        { status: 400 }
      );
    }

    // إنشاء معرف فريد للطلب
    const orderId = nanoid(12);
    const timestamp = new Date().toISOString();

    // تجهيز بيانات الطلب
    const orderData = {
      orderId,
      customerEmail,
      cartItems,
      totalAmount,
      currency,
      status: 'pending',
      createdAt: timestamp,
      type: 'cart_order'
    };

    // حفظ بيانات الطلب في Redis
    await redis.set(`order:${orderId}`, JSON.stringify(orderData), { ex: 3600 }); // ينتهي خلال ساعة

    // إنشاء رابط الدفع (محاكاة - يمكن استبداله بـ Stripe أو PayPal)
    const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://leve1up.store'}/payment-success?order_id=${orderId}&type=cart`;

    // إرسال إيميل تأكيد الطلب (اختياري)
    try {
      if (resend) {
        const productsList = cartItems.map((item: any) => 
          `• ${item.name} (الكمية: ${item.quantity}) - ${item.price} ${currency}`
        ).join('\n');

        await resend.emails.send({
        from: 'Leve1Up Store <orders@leve1up.store>',
        to: [customerEmail],
        subject: `تأكيد طلبك #${orderId} - Leve1Up`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">شكراً لك على طلبك!</h1>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e293b; margin-bottom: 15px;">تفاصيل الطلب #${orderId}</h2>
                <p><strong>البريد الإلكتروني:</strong> ${customerEmail}</p>
                <p><strong>تاريخ الطلب:</strong> ${new Date(timestamp).toLocaleDateString('en-GB')}</p>
                <p><strong>المبلغ الإجمالي:</strong> ${totalAmount} ${currency}</p>
              </div>

              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">المنتجات المطلوبة:</h3>
                <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; color: #4b5563;">${productsList}</pre>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${paymentUrl}" 
                   style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  إكمال الدفع وتحميل المنتجات
                </a>
              </div>

              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                  <strong>ملاحظة:</strong> يرجى إكمال عملية الدفع خلال ساعة واحدة من استلام هذا الإيميل.
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                  شكراً لاختيارك Leve1Up Store<br>
                  <a href="https://leve1up.store" style="color: #2563eb;">leve1up.store</a>
                </p>
              </div>
            </div>
          </div>
        `
        });


      }
    } catch (emailError) {
      // لا نوقف العملية إذا فشل الإيميل
    }

    return NextResponse.json({
      success: true,
      orderId,
      redirect_url: paymentUrl,
      message: 'تم إنشاء الطلب بنجاح'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الطلب' },
      { status: 500 }
    );
  }
}
