'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  LogOut, 
  Shield, 
  Settings, 
  MessageCircle, 
  Edit3,
  Home,
  Mail,
  Bell,
  Key,
  Check,
  X,
  Save,
  Calendar
} from "lucide-react";
import UserOrders from "@/components/UserOrders";

// واجهات البيانات
interface UserSettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  savePassword: boolean;
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
}

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  joinedAt?: string;
  provider?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // حالات المكونات
  const [settings, setSettings] = useState<UserSettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    savePassword: true,
    theme: 'dark',
    language: 'ar'
  });
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // إعادة توجيه إذا لم يكن المستخدم مسجل الدخول
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // جلب بيانات المستخدم والإعدادات
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  // دالة جلب بيانات المستخدم
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // جلب بيانات المستخدم
      const profileResponse = await fetch('/api/user/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
        setEditForm({
          name: profileData.profile.name,
          email: profileData.profile.email
        });
      }

      // جلب إعدادات المستخدم
      const settingsResponse = await fetch('/api/user/settings');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setSettings(settingsData.settings);
      }
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      showToast('حدث خطأ في جلب البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  // دالة عرض Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // دالة تبديل الإعدادات
  const toggleSetting = async (setting: keyof UserSettings, value: boolean) => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting, value })
      });

      if (response.ok) {
        setSettings(prev => ({ ...prev, [setting]: value }));
        const data = await response.json();
        showToast(data.message, 'success');
      } else {
        throw new Error('فشل في تحديث الإعداد');
      }
    } catch (error) {
      console.error('خطأ في تبديل الإعداد:', error);
      showToast('حدث خطأ في تحديث الإعداد', 'error');
    }
  };

  // دالة حفظ بيانات المستخدم
  const saveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, ...editForm } : null);
        setIsEditModalOpen(false);
        showToast('تم تحديث البيانات بنجاح', 'success');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحديث البيانات');
      }
    } catch (error: any) {
      console.error('خطأ في حفظ البيانات:', error);
      showToast(error.message || 'حدث خطأ في حفظ البيانات', 'error');
    }
  };

  // دالة تسجيل الخروج
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // دالة العودة للرئيسية
  const goHome = () => {
    router.push('/');
  };

  // تحديد نوع المصادقة
  const getAuthProvider = () => {
    if (profile?.provider === 'google') return 'Google';
    if (profile?.provider === 'apple') return 'Apple';
    return 'البريد الإلكتروني';
  };

  // تنسيق التاريخ
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // عرض شاشة تحميل
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300 mx-auto mb-4"></div>
          <p className="text-slate-300">جاري التحميل...</p>
        </motion.div>
      </div>
    );
  }

  // إذا لم توجد جلسة، لا تعرض شيئاً
  if (!session || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              الملف الشخصي
            </motion.h1>
            <motion.p 
              className="text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              إدارة معلوماتك الشخصية وإعداداتك
            </motion.p>
          </div>

          {/* Profile Card */}
          <motion.div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="صورة المستخدم"
                    className="w-24 h-24 rounded-full border-4 border-primary-300/30"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-300/20 border-4 border-primary-300/30 flex items-center justify-center">
                    <User className="w-12 h-12 text-primary-300" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-right">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {profile.name}
                </h2>
                <p className="text-slate-300 mb-2">{profile.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>مسجل عبر: {getAuthProvider()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>انضم في: {formatDate(profile.joinedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit3 className="w-4 h-4" />
                  تعديل الملف
                </motion.button>
                
                <motion.button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Settings Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <motion.div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-300" />
                المعلومات الشخصية
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">الاسم الكامل</label>
                  <p className="text-white">{profile.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">البريد الإلكتروني</label>
                  <p className="text-white">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">نوع الحساب</label>
                  <p className="text-white">{getAuthProvider()}</p>
                </div>
              </div>
            </motion.div>

            {/* Account Security */}
            <motion.div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-300" />
                أمان الحساب
              </h3>
              <div className="space-y-4">
                {/* Two Factor Authentication */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">التحقق بخطوتين</span>
                  </div>
                  <motion.button
                    onClick={() => toggleSetting('twoFactorEnabled', !settings.twoFactorEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.twoFactorEnabled ? 'bg-primary-600' : 'bg-slate-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">إشعارات البريد</span>
                  </div>
                  <motion.button
                    onClick={() => toggleSetting('emailNotifications', !settings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-primary-600' : 'bg-slate-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Save Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">حفظ كلمة المرور</span>
                  </div>
                  <motion.button
                    onClick={() => toggleSetting('savePassword', !settings.savePassword)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.savePassword ? 'bg-primary-600' : 'bg-slate-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.savePassword ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">إجراءات سريعة</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <motion.button 
                onClick={() => showToast('قريباً: صفحة الإعدادات المتقدمة', 'success')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-white font-medium">الإعدادات</span>
              </motion.button>
              
              <motion.button 
                onClick={() => showToast('قريباً: إعدادات الأمان والحماية', 'success')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600/20 to-green-700/20 hover:from-green-600/30 hover:to-green-700/30 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                <span className="text-white font-medium">الأمان</span>
              </motion.button>
              
              <motion.button 
                onClick={() => showToast('قريباً: مركز الرسائل والإشعارات', 'success')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/20 hover:from-purple-600/30 hover:to-purple-700/30 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="text-white font-medium">الرسائل</span>
              </motion.button>
            </div>
          </motion.div>

          {/* User Orders Section */}
          <UserOrders className="mb-8" />

          {/* Back to Home Button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={goHome}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-700/80 to-slate-800/80 hover:from-slate-600/80 hover:to-slate-700/80 text-white rounded-xl border border-slate-600/50 hover:border-slate-500/70 font-medium shadow-lg hover:shadow-slate-500/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">تعديل الملف الشخصي</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={saveProfile}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  حفظ
                </motion.button>
                
                <motion.button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium shadow-lg hover:shadow-slate-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-4 h-4" />
                  إلغاء
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
