/**
 * 🔧 دوال إدارة إعدادات المستخدم في Upstash Redis
 */

import { Redis } from '@upstash/redis';

// إعداد Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// واجهة إعدادات المستخدم
export interface UserSettings {
  twoFactorEnabled?: boolean;
  emailNotifications?: boolean;
  savePassword?: boolean;
  theme?: 'light' | 'dark';
  language?: 'ar' | 'en';
  lastUpdated?: string;
}

// واجهة بيانات المستخدم
export interface UserProfile {
  name: string;
  email: string;
  image?: string;
  joinedAt?: string;
  provider?: string;
}

/**
 * حفظ إعدادات المستخدم في Redis
 * @param email البريد الإلكتروني للمستخدم
 * @param settings الإعدادات المراد حفظها
 */
export async function saveUserSettings(email: string, settings: Partial<UserSettings>): Promise<void> {
  try {
    const updatedSettings = {
      ...settings,
      lastUpdated: new Date().toISOString()
    };

    await redis.hset(`user_settings:${email}`, updatedSettings);
    console.log(`✅ تم حفظ إعدادات المستخدم: ${email}`);
  } catch (error) {
    console.error('❌ خطأ في حفظ إعدادات المستخدم:', error);
    throw new Error('فشل في حفظ الإعدادات');
  }
}

/**
 * جلب إعدادات المستخدم من Redis
 * @param email البريد الإلكتروني للمستخدم
 * @returns إعدادات المستخدم أو القيم الافتراضية
 */
export async function getUserSettings(email: string): Promise<UserSettings> {
  try {
    const settings = await redis.hgetall(`user_settings:${email}`);
    
    // إعدادات افتراضية إذا لم توجد بيانات
    const defaultSettings: UserSettings = {
      twoFactorEnabled: false,
      emailNotifications: true,
      savePassword: true,
      theme: 'dark',
      language: 'ar'
    };

    if (!settings || Object.keys(settings).length === 0) {
      console.log(`ℹ️ لا توجد إعدادات للمستخدم: ${email}، استخدام الإعدادات الافتراضية`);
      return defaultSettings;
    }

    // تحويل القيم النصية إلى boolean
    const parsedSettings: UserSettings = {
      twoFactorEnabled: settings.twoFactorEnabled === 'true' || settings.twoFactorEnabled === true,
      emailNotifications: settings.emailNotifications === 'true' || settings.emailNotifications === true,
      savePassword: settings.savePassword === 'true' || settings.savePassword === true,
      theme: (settings.theme as 'light' | 'dark') || 'dark',
      language: (settings.language as 'ar' | 'en') || 'ar',
      lastUpdated: settings.lastUpdated as string
    };

    console.log(`✅ تم جلب إعدادات المستخدم: ${email}`);
    return parsedSettings;
  } catch (error) {
    console.error('❌ خطأ في جلب إعدادات المستخدم:', error);
    // إرجاع الإعدادات الافتراضية في حالة الخطأ
    return {
      twoFactorEnabled: false,
      emailNotifications: true,
      savePassword: true,
      theme: 'dark',
      language: 'ar'
    };
  }
}

/**
 * تحديث بيانات المستخدم الأساسية في Redis
 * @param email البريد الإلكتروني الحالي
 * @param profile البيانات الجديدة
 */
export async function updateUserProfile(email: string, profile: Partial<UserProfile>): Promise<void> {
  try {
    // جلب البيانات الحالية
    const currentUserJson = await redis.get<string>(`user:${email}`);
    
    if (!currentUserJson) {
      throw new Error('المستخدم غير موجود');
    }

    const currentUser = typeof currentUserJson === 'string' 
      ? JSON.parse(currentUserJson) 
      : currentUserJson;

    // دمج البيانات الجديدة مع الحالية
    const updatedUser = {
      ...currentUser,
      ...profile,
      updatedAt: new Date().toISOString()
    };

    // حفظ البيانات المحدثة
    await redis.set(`user:${email}`, JSON.stringify(updatedUser));

    // إذا تم تغيير البريد الإلكتروني، نحتاج لنقل البيانات
    if (profile.email && profile.email !== email) {
      // نسخ البيانات للبريد الجديد
      await redis.set(`user:${profile.email}`, JSON.stringify(updatedUser));
      
      // نسخ الإعدادات للبريد الجديد
      const settings = await getUserSettings(email);
      await saveUserSettings(profile.email, settings);
      
      // حذف البيانات القديمة
      await redis.del(`user:${email}`);
      await redis.del(`user_settings:${email}`);
      
      console.log(`✅ تم نقل بيانات المستخدم من ${email} إلى ${profile.email}`);
    }

    console.log(`✅ تم تحديث بيانات المستخدم: ${email}`);
  } catch (error) {
    console.error('❌ خطأ في تحديث بيانات المستخدم:', error);
    throw new Error('فشل في تحديث البيانات');
  }
}

/**
 * جلب بيانات المستخدم الأساسية من Redis
 * @param email البريد الإلكتروني للمستخدم
 * @returns بيانات المستخدم أو null
 */
export async function getUserProfile(email: string): Promise<UserProfile | null> {
  try {
    const userJson = await redis.get<string>(`user:${email}`);
    
    if (!userJson) {
      console.log(`ℹ️ لا توجد بيانات للمستخدم: ${email}`);
      return null;
    }

    const user = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;
    
    return {
      name: user.name,
      email: user.email,
      image: user.image,
      joinedAt: user.createdAt || user.joinedAt,
      provider: user.provider
    };
  } catch (error) {
    console.error('❌ خطأ في جلب بيانات المستخدم:', error);
    return null;
  }
}

/**
 * تبديل حالة إعداد معين
 * @param email البريد الإلكتروني للمستخدم
 * @param setting اسم الإعداد
 * @param value القيمة الجديدة
 */
export async function toggleUserSetting(
  email: string, 
  setting: keyof UserSettings, 
  value: boolean
): Promise<void> {
  try {
    const currentSettings = await getUserSettings(email);
    const updatedSettings = {
      ...currentSettings,
      [setting]: value
    };
    
    await saveUserSettings(email, updatedSettings);
    console.log(`✅ تم تبديل ${setting} إلى ${value} للمستخدم: ${email}`);
  } catch (error) {
    console.error(`❌ خطأ في تبديل ${setting}:`, error);
    throw new Error(`فشل في تحديث ${setting}`);
  }
}

/**
 * حذف جميع بيانات المستخدم (للاستخدام الحذر)
 * @param email البريد الإلكتروني للمستخدم
 */
export async function deleteUserData(email: string): Promise<void> {
  try {
    await redis.del(`user:${email}`);
    await redis.del(`user_settings:${email}`);
    console.log(`✅ تم حذف جميع بيانات المستخدم: ${email}`);
  } catch (error) {
    console.error('❌ خطأ في حذف بيانات المستخدم:', error);
    throw new Error('فشل في حذف البيانات');
  }
}
