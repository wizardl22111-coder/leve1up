import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { authenticator } from 'otplib';
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
    const { token } = await request.json();

    if (!token || token.length !== 6) {
      return NextResponse.json(
        { error: 'يرجى إدخال رمز صحيح مكون من 6 أرقام' },
        { status: 400 }
      );
    }

    // جلب الـ secret المؤقت
    const tempSecret = await redis.get(`user:${userEmail}:2fa_temp_secret`);
    if (!tempSecret) {
      return NextResponse.json(
        { error: 'انتهت صلاحية الجلسة، يرجى إعادة المحاولة' },
        { status: 400 }
      );
    }

    // التحقق من صحة الرمز
    const isValid = authenticator.verify({
      token: token,
      secret: tempSecret as string
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'الرمز غير صحيح، يرجى المحاولة مرة أخرى' },
        { status: 400 }
      );
    }

    // إذا كان الرمز صحيحاً، تفعيل 2FA
    await redis.set(`user:${userEmail}:2fa_enabled`, 'true');
    await redis.set(`user:${userEmail}:2fa_secret`, tempSecret as string);
    
    // حذف الـ secret المؤقت
    await redis.del(`user:${userEmail}:2fa_temp_secret`);

    // تحديث إعدادات المستخدم
    await redis.hset(`user_settings:${userEmail}`, {
      twoFactorEnabled: 'true',
      lastUpdated: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل المصادقة الثنائية بنجاح'
    });

  } catch (error) {
    console.error('❌ خطأ في التحقق من 2FA:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في التحقق من الرمز' },
      { status: 500 }
    );
  }
}
