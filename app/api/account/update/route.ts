import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { updateUserProfile } from '@/lib/user-settings';
import bcrypt from 'bcryptjs';
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
    const { name, email, phone, currentPassword, newPassword } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!name || !email) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني مطلوبان' },
        { status: 400 }
      );
    }

    // جلب بيانات المستخدم الحالية
    const currentUserJson = await redis.get<string>(`user:${userEmail}`);
    if (!currentUserJson) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const currentUser = typeof currentUserJson === 'string' 
      ? JSON.parse(currentUserJson) 
      : currentUserJson;

    // إعداد البيانات المحدثة
    const updatedData: any = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || currentUser.phone
    };

    // التحقق من تغيير كلمة المرور
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'يرجى إدخال كلمة المرور الحالية' },
          { status: 400 }
        );
      }

      // التحقق من كلمة المرور الحالية (فقط للمستخدمين المسجلين بالبريد الإلكتروني)
      if (currentUser.provider === 'credentials' && currentUser.password) {
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isCurrentPasswordValid) {
          return NextResponse.json(
            { error: 'كلمة المرور الحالية غير صحيحة' },
            { status: 400 }
          );
        }
      }

      // تشفير كلمة المرور الجديدة
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      updatedData.password = hashedNewPassword;
    }

    // التحقق من تغيير البريد الإلكتروني
    if (email !== userEmail) {
      // التحقق من أن البريد الجديد غير مستخدم
      const existingUser = await redis.get(`user:${email}`);
      if (existingUser) {
        return NextResponse.json(
          { error: 'هذا البريد الإلكتروني مستخدم بالفعل' },
          { status: 400 }
        );
      }
    }

    // تحديث بيانات المستخدم
    await updateUserProfile(userEmail, updatedData);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات الحساب بنجاح',
      data: {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone
      }
    });

  } catch (error) {
    console.error('❌ خطأ في تحديث بيانات الحساب:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث البيانات' },
      { status: 500 }
    );
  }
}
