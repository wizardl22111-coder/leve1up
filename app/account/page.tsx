"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { 
  User,
  LogOut,
  Home,
  ShoppingBag,
  Settings,
  Shield,
  Bell,
  CreditCard
} from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push('/api/auth/signin');
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري تحميل بيانات الحساب...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-500 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-dark-400 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">مرحباً، {session.user?.name || session.user?.email?.split('@')[0]}</h1>
                <p className="text-gray-400">{session.user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Account Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-dark-400 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary-400" />
              <h2 className="text-xl font-bold text-white">معلومات الحساب</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">البريد الإلكتروني</label>
                <p className="text-white bg-dark-300 px-4 py-2 rounded-lg">{session.user?.email}</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">الاسم</label>
                <p className="text-white bg-dark-300 px-4 py-2 rounded-lg">{session.user?.name || session.user?.email?.split('@')[0]}</p>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-dark-400 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">أمان الحساب</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg">
                <span className="text-white">كلمة المرور</span>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium px-4 py-2 bg-primary-500/10 rounded-lg border border-primary-500/20 hover:bg-primary-500/20 transition-all">
                  تغيير
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg">
                <span className="text-white">المصادقة الثنائية</span>
                <button className="text-green-400 hover:text-green-300 text-sm font-medium px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-all">
                  تفعيل
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-dark-400 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">إعدادات سريعة</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-dark-300 hover:bg-dark-200 rounded-lg transition-colors text-right">
                <Bell className="w-5 h-5 text-yellow-400" />
                <span className="text-white">إعدادات الإشعارات</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-dark-300 hover:bg-dark-200 rounded-lg transition-colors text-right">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-white">طرق الدفع</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-dark-400 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-bold text-white">التسوق</h2>
            </div>
            <div className="space-y-3">
              <Link
                href="/"
                className="w-full flex items-center gap-3 p-3 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors text-right"
              >
                <Home className="w-5 h-5 text-white" />
                <span className="text-white font-medium">تصفح المنتجات</span>
              </Link>
              <Link
                href="/cart"
                className="w-full flex items-center gap-3 p-3 bg-dark-300 hover:bg-dark-200 rounded-lg transition-colors text-right"
              >
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <span className="text-white">سلة التسوق</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-2xl p-6 border border-primary-500/30">
          <h3 className="text-xl font-bold text-white mb-2">مرحباً بك في LEVEL UP! 🚀</h3>
          <p className="text-gray-300">
            نحن سعداء لوجودك معنا. استكشف مجموعتنا الواسعة من المنتجات الرقمية المميزة وابدأ رحلتك نحو النجاح.
          </p>
        </div>
      </div>
    </div>
  );
}
