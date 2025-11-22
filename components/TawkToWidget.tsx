'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function TawkToWidget() {
  const pathname = usePathname();

  useEffect(() => {
    // تحقق من أن الصفحة الحالية هي صفحة دفع أو نجاح
    const isCheckoutPage = pathname.includes('/checkout') || pathname.includes('/order-success');
    
    if (isCheckoutPage) {
      // تهيئة Tawk.to فقط على صفحات الدفع
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // إنشاء وإدراج سكريبت Tawk.to
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/6921c18027ad1319611fb72e/1jaltno6d';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      // إضافة السكريبت إلى الصفحة
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }

      // تنظيف السكريبت عند مغادرة الصفحة
      return () => {
        // إزالة السكريبت إذا كان موجوداً
        const existingScript = document.querySelector('script[src*="embed.tawk.to"]');
        if (existingScript) {
          existingScript.remove();
        }
        
        // إعادة تعيين متغيرات Tawk
        if (window.Tawk_API) {
          window.Tawk_API = undefined;
        }
      };
    }
  }, [pathname]);

  return null; // هذا المكون لا يعرض أي شيء مرئي
}
