'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function AccessDeniedAlert() {
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'access_denied') {
      setShowAlert(true);
      // إخفاء التنبيه تلقائياً بعد 10 ثوان
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleClose = () => {
    setShowAlert(false);
    // إزالة معامل الخطأ من الرابط
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="bg-red-600 border border-red-500 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-100" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-1">
                  🚫 غير مخول للوصول
                </h3>
                <p className="text-red-100 text-sm leading-relaxed">
                  عذراً، حسابك غير مخول للوصول إلى لوحة الإدارة. 
                  يجب أن تسجل الدخول بحساب المدير المخول.
                </p>
                <div className="mt-3 text-xs text-red-200">
                  💡 <strong>نصيحة:</strong> تأكد من تسجيل الدخول بالإيميل الصحيح
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                aria-label="إغلاق التنبيه"
              >
                <X className="w-5 h-5 text-red-100" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

