'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Calendar, LogOut, Settings, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // لا تزال تحمل
    if (!session) {
      router.push('/login'); // إعادة توجيه إلى صفحة تسجيل الدخول
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-300/30 border-t-primary-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // سيتم إعادة التوجيه
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">الملف الشخصي</h1>
          <p className="text-gray-400">إدارة معلوماتك الشخصية</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user?.name || 'المستخدم'}
                  className="w-24 h-24 rounded-full border-4 border-primary-300/30"
                />
              ) : (
                <div className="w-24 h-24 bg-primary-300/20 rounded-full flex items-center justify-center border-4 border-primary-300/30">
                  <User className="w-12 h-12 text-primary-300" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-2xl font-bold text-white mb-2">
                {session.user?.name || 'المستخدم'}
              </h2>
              <p className="text-gray-400 mb-4">{session.user?.email}</p>
              
              {/* Provider Badge */}
              {session.user?.provider && (
                <div className="inline-flex items-center gap-2 bg-primary-300/20 text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  {session.user.provider === 'google' && 'Google'}
                  {session.user.provider === 'apple' && 'Apple'}
                  {session.user.provider === 'credentials' && 'حساب محلي'}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-2 bg-primary-300/20 hover:bg-primary-300/30 text-primary-300 px-4 py-2 rounded-xl transition-all duration-200 font-medium">
                <Settings className="w-4 h-4" />
                تعديل الملف
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-300" />
              المعلومات الشخصية
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">الاسم</p>
                  <p className="text-white font-medium">{session.user?.name || 'غير محدد'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                  <p className="text-white font-medium">{session.user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">تاريخ الانضمام</p>
                  <p className="text-white font-medium">اليوم</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-300" />
              أمان الحساب
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                <div>
                  <p className="text-white font-medium">التحقق بخطوتين</p>
                  <p className="text-sm text-gray-400">حماية إضافية لحسابك</p>
                </div>
                <div className="w-10 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-4 h-4 bg-gray-400 rounded-full absolute top-1 right-1 transition-all duration-200"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                <div>
                  <p className="text-white font-medium">إشعارات البريد</p>
                  <p className="text-sm text-gray-400">تلقي التحديثات عبر البريد</p>
                </div>
                <div className="w-10 h-6 bg-primary-300 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-all duration-200"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                <div>
                  <p className="text-white font-medium">حفظ كلمة المرور</p>
                  <p className="text-sm text-gray-400">تذكر تسجيل الدخول</p>
                </div>
                <div className="w-10 h-6 bg-primary-300 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-all duration-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-4">إجراءات سريعة</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
              <Settings className="w-6 h-6 text-primary-300 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">الإعدادات</span>
            </button>
            
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
              <Shield className="w-6 h-6 text-primary-300 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">الأمان</span>
            </button>
            
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
              <Mail className="w-6 h-6 text-primary-300 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">الرسائل</span>
            </button>
            
            <button className="flex flex-col items-center gap-2 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-200 group">
              <User className="w-6 h-6 text-primary-300 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-300 group-hover:text-white">الملف</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
