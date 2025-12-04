import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 🔐 قائمة إيميلات المديرين المخولين للوصول للوحة الإدارة
const ADMIN_EMAILS = [
  'leve1up999q@gmail.com', // إيميل المدير الرئيسي
  // يمكن إضافة إيميلات أخرى هنا
];

export default withAuth(
  function middleware(req) {
    // التحقق من الوصول للوحة الإدارة
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const userEmail = req.nextauth.token?.email;
      
      // التحقق من تسجيل الدخول
      if (!req.nextauth.token) {
        console.log('🚫 Admin access denied: No token found');
        return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(req.url), req.url));
      }
      
      // التحقق من أن الإيميل مخول للوصول للوحة الإدارة
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.log(`🚫 Admin access denied for email: ${userEmail}`);
        // إعادة توجيه للصفحة الرئيسية مع رسالة خطأ
        return NextResponse.redirect(new URL("/?error=access_denied", req.url));
      }
      
      console.log(`✅ Admin access granted for: ${userEmail}`);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // السماح بالوصول للصفحات العامة
        if (!req.nextUrl.pathname.startsWith("/admin")) {
          return true;
        }
        
        // التحقق من تسجيل الدخول
        if (!token) {
          return false;
        }
        
        // التحقق من أن الإيميل مخول للوصول للوحة الإدارة
        const userEmail = token.email;
        return userEmail && ADMIN_EMAILS.includes(userEmail);
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"]
};
