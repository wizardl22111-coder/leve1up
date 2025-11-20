import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * 👤 API endpoint للحصول على بيانات الملف الشخصي
 * 
 * يُرجع معلومات المستخدم الأساسية بدون أرقام الطلبات
 * يتطلب تسجيل دخول صحيح
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // إعداد بيانات الملف الشخصي
    const profile = {
      name: session.user.name || 'مستخدم',
      email: session.user.email || '',
      image: session.user.image || null,
      provider: session.user.provider || 'email',
      joinedAt: session.user.joinedAt || new Date().toISOString(),
      // معلومات إضافية يمكن إضافتها لاحقاً
      verified: true, // يمكن ربطها بنظام التحقق
      membershipType: 'standard', // يمكن ربطها بنظام العضوية
    };

    console.log(`✅ Profile data retrieved for user: ${session.user.email}`);

    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('❌ Error in profile API:', error);
    
    return NextResponse.json(
      { 
        error: 'حدث خطأ في جلب بيانات الملف الشخصي',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

