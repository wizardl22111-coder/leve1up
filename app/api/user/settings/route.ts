import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getUserSettings, saveUserSettings, toggleUserSetting } from '@/lib/user-settings';

/**
 * 📥 GET - جلب إعدادات المستخدم
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

    // جلب الإعدادات من Redis
    const settings = await getUserSettings(session.user.email);
    
    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error: any) {
    console.error('❌ خطأ في جلب إعدادات المستخدم:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإعدادات' },
      { status: 500 }
    );
  }
}

/**
 * 📤 POST - حفظ إعدادات المستخدم
 */
export async function POST(request: NextRequest) {
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
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'الإعدادات مطلوبة' },
        { status: 400 }
      );
    }

    // حفظ الإعدادات في Redis
    await saveUserSettings(session.user.email, settings);
    
    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات بنجاح'
    });

  } catch (error: any) {
    console.error('❌ خطأ في حفظ إعدادات المستخدم:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حفظ الإعدادات' },
      { status: 500 }
    );
  }
}

/**
 * 🔄 PATCH - تبديل إعداد معين
 */
export async function PATCH(request: NextRequest) {
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
    const { setting, value } = body;

    if (!setting || typeof value !== 'boolean') {
      return NextResponse.json(
        { error: 'اسم الإعداد والقيمة مطلوبان' },
        { status: 400 }
      );
    }

    // تبديل الإعداد في Redis
    await toggleUserSetting(session.user.email, setting, value);
    
    return NextResponse.json({
      success: true,
      message: `تم ${value ? 'تفعيل' : 'إلغاء'} ${setting} بنجاح`
    });

  } catch (error: any) {
    console.error('❌ خطأ في تبديل إعداد المستخدم:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الإعداد' },
      { status: 500 }
    );
  }
}
