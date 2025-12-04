'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="p-8">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔍 صفحة تشخيص المصادقة</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 حالة الجلسة</h2>
          <div className="space-y-2">
            <p><strong>الحالة:</strong> <span className={`px-2 py-1 rounded ${status === 'authenticated' ? 'bg-green-100 text-green-800' : status === 'unauthenticated' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{status}</span></p>
            {session?.user && (
              <>
                <p><strong>الاسم:</strong> {session.user.name || 'غير محدد'}</p>
                <p><strong>الإيميل:</strong> {session.user.email || 'غير محدد'}</p>
                <p><strong>الصورة:</strong> {session.user.image ? 'موجودة' : 'غير موجودة'}</p>
                <p><strong>المعرف:</strong> {(session.user as any).id || 'غير محدد'}</p>
                <p><strong>المزود:</strong> {(session.user as any).provider || 'غير محدد'}</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔐 فحص الصلاحيات</h2>
          <div className="space-y-2">
            <p><strong>هل هو مدير؟</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${session?.user?.email === 'leve1up999q@gmail.com' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {session?.user?.email === 'leve1up999q@gmail.com' ? 'نعم ✅' : 'لا ❌'}
              </span>
            </p>
            <p><strong>يمكن الوصول للملف الشخصي؟</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${session ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {session ? 'نعم ✅' : 'لا ❌'}
              </span>
            </p>
            <p><strong>يمكن الوصول للوحة الإدارة؟</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${session?.user?.email === 'leve1up999q@gmail.com' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {session?.user?.email === 'leve1up999q@gmail.com' ? 'نعم ✅' : 'لا ❌'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 اختبار التوجيه</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/profile')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              اذهب للملف الشخصي
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              اذهب للوحة الإدارة
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              اذهب للصفحة الرئيسية
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📋 بيانات الجلسة الكاملة</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
