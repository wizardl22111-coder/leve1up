import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
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

    // التحقق من أن 2FA مفعل
    const is2FAEnabled = await redis.get(`user:${userEmail}:2fa_enabled`);
    if (is2FAEnabled !== 'true') {
      return NextResponse.json(
        { error: 'المصادقة الثنائية غير مفعلة' },
        { status: 400 }
      );
    }

    // إلغاء تفعيل 2FA
    await redis.del(`user:${userEmail}:2fa_enabled`);
    await redis.del(`user:${userEmail}:2fa_secret`);
    
    // تحديث إعدادات المستخدم
    await redis.hset(`user_settings:${userEmail}`, {
      twoFactorEnabled: 'false',
      lastUpdated: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء تفعيل المصادقة الثنائية بنجاح'
    });

  } catch (error) {
    console.error('❌ خطأ في إلغاء تفعيل 2FA:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إلغاء تفعيل المصادقة الثنائية' },
      { status: 500 }
    );
  }
}
