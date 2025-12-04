import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

// قائمة إيميلات المديرين المخولين للوصول للوحة الإدارة
const ADMIN_EMAILS = [
  'leve1up999q@gmail.com', // إيميل المدير الرئيسي
];

export default withAuth(
  async function middleware(req) {
    // التحقق من إعادة توجيه المديرين من /profile إلى /admin/dashboard
    if (req.nextUrl.pathname === "/profile") {
      const userEmail = req.nextauth.token?.email;
      
      if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
        console.log(`🔄 إعادة توجيه المدير ${userEmail} من /profile إلى /admin/dashboard`);
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }

    // التحقق من الوصول للوحة الإدارة مع فحص الإيميل
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const userEmail = req.nextauth.token?.email;
      
      if (!req.nextauth.token) {
        console.log('🚫 Admin access denied: No token found');
        return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(req.url), req.url));
      }
      
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.log(`🚫 Admin access denied for email: ${userEmail}`);
        return NextResponse.redirect(new URL("/?error=access_denied", req.url));
      }
      
      console.log(`✅ Admin access granted for: ${userEmail}`);
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // السماح بالوصول للصفحات العامة
        if (!req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/profile") {
          return true;
        }
        
        // التحقق من تسجيل الدخول
        if (!token) {
          return false;
        }
        
        // للصفحات الإدارية، التحقق من أن الإيميل مخول
        if (req.nextUrl.pathname.startsWith("/admin")) {
          const userEmail = token.email;
          return !!(userEmail && ADMIN_EMAILS.includes(userEmail));
        }
        
        // للملف الشخصي، السماح لجميع المستخدمين المسجلين
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile"]
};
