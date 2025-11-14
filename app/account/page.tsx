"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  ArrowLeft,
  LogOut,
  User,
  Loader2
} from "lucide-react";

interface UserSession {
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!data.isAuthenticated) {
        router.push('/login'); // إعادة توجيه لصفحة تسجيل الدخول
        return;
      }

      setUser(data.user);
      // تم إزالة تحميل الطلبات

    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // تم إزالة تحميل الطلبات - الصفحة محذوفة

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-white">جارٍ التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // سيتم إعادة التوجيه
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للقائمة الرئيسية</span>
          </Link>
        </div>

        {/* Account Info Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-right mb-4">
            معلومات الحساب
          </h2>
        </div>

        {/* Account Info Content */}
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">مرحباً بك!</h3>
          <p className="text-gray-600 mb-6">تم تسجيل دخولك بنجاح</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <p className="text-gray-700">
              <strong>البريد الإلكتروني:</strong> {user?.email}
            </p>
          </div>
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Package className="w-5 h-5" />
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}

