import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getUserProfile, updateUserProfile } from '@/lib/user-settings';

/**
 * 📥 GET - جلب بيانات المستخدم
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من الجلسة
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // جلب بيانات المستخدم من Redis
    const profile = await getUserProfile(session.user.email);
    
    // إذا لم توجد بيانات في Redis، استخدم بيانات الجلسة
    const userProfile = profile || {
      name: session.user.name || 'مستخدم جديد',
      email: session.user.email,
      image: session.user.image,
      joinedAt: new Date().toISOString(),
      provider: session.user.provider || 'unknown'
    };
    
    return NextResponse.json({
      success: true,
      profile: userProfile
    });

  } catch (error: any) {
    console.error('❌ خطأ في جلب بيانات المستخدم:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
}

/**
 * 📤 PUT - تحديث بيانات المستخدم
 */
export async function PUT(request: NextRequest) {
  try {
    // التحقق من الجلسة
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // جلب البيانات من الطلب
    const body = await request.json();
    const { name, email } = body;

    // التحقق من صحة البيانات
    if (!name || !email) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني مطلوبان' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // تحديث بيانات المستخدم في Redis
    await updateUserProfile(session.user.email, {
      name: name.trim(),
      email: email.trim().toLowerCase()
    });
    
    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح'
    });

  } catch (error: any) {
    console.error('❌ خطأ في تحديث بيانات المستخدم:', error);
    
    // رسائل خطأ مخصصة
    if (error.message === 'المستخدم غير موجود') {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث البيانات' },
      { status: 500 }
    );
  }
}
