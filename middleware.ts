import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// قائمة إيميلات المديرين المخولين للوصول للوحة الإدارة
const ADMIN_EMAILS = [
  'leve1up999q@gmail.com', // إيميل المدير الرئيسي
];

export default withAuth(
  async function middleware(req) {
    const userEmail = req.nextauth.token?.email;
    
    console.log(`🔍 Middleware - Path: ${req.nextUrl.pathname}, Email: ${userEmail}`);

    // التحقق من إعادة توجيه المديرين من /profile إلى /admin/dashboard
    if (req.nextUrl.pathname === "/profile") {
      if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
        console.log(`🔄 إعادة توجيه المدير ${userEmail} من /profile إلى /admin/dashboard`);
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      // السماح للمستخدمين العاديين بالوصول للملف الشخصي
      console.log(`✅ السماح بالوصول للملف الشخصي للمستخدم: ${userEmail}`);
      return NextResponse.next();
    }

    // التحقق من الوصول للوحة الإدارة
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!req.nextauth.token) {
        console.log('🚫 Admin access denied: No token found');
        return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(req.url), req.url));
      }
      
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.log(`🚫 Admin access denied for email: ${userEmail}`);
        return NextResponse.redirect(new URL("/?error=access_denied", req.url));
      }
      
      console.log(`✅ Admin access granted for: ${userEmail}`);
      return NextResponse.next();
    }

    // السماح بالوصول للصفحات الأخرى
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        console.log(`🔍 Authorized callback - Path: ${path}, Token: ${!!token}, Email: ${token?.email}`);
        
        // السماح بالوصول للصفحات العامة (غير المحمية)
        if (!path.startsWith("/admin") && path !== "/profile") {
          return true;
        }
        
        // التحقق من وجود token للصفحات المحمية
        if (!token) {
          console.log(`🚫 No token for protected path: ${path}`);
          return false;
        }
        
        // السماح بالوصول - سيتم التحقق من الصلاحيات في middleware
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile"]
};
