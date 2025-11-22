import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { Redis } from '@upstash/redis';

// إعداد Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    // التحقق من جلسة المستخدم
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // التحقق من أن 2FA غير مفعل بالفعل
    const is2FAEnabled = await redis.get(`user:${userEmail}:2fa_enabled`);
    if (is2FAEnabled === 'true') {
      return NextResponse.json(
        { error: 'المصادقة الثنائية مفعلة بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء secret جديد
    const secret = authenticator.generateSecret();
    
    // إنشاء اسم الخدمة والمستخدم للـ QR Code
    const serviceName = 'Leve1Up Store';
    const accountName = userEmail;
    
    // إنشاء otpauth URL
    const otpauthUrl = authenticator.keyuri(accountName, serviceName, secret);
    
    // إنشاء QR Code
    const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);

    // حفظ الـ secret مؤقتاً (سيتم تأكيده عند التحقق)
    await redis.set(`user:${userEmail}:2fa_temp_secret`, secret, { ex: 300 }); // 5 دقائق

    return NextResponse.json({
      success: true,
      data: {
        secret,
        qrCode: qrCodeDataURL,
        manualEntryKey: secret
      }
    });

  } catch (error) {
    console.error('❌ خطأ في إعداد 2FA:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إعداد المصادقة الثنائية' },
      { status: 500 }
    );
  }
}
