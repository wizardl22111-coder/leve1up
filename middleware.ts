import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // التحقق من الوصول للوحة الإدارة
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // مؤقتاً: السماح لأي مستخدم مسجل بالوصول للوحة الإدارة
      // يمكن إضافة نظام الأدوار لاحقاً
      if (!req.nextauth.token) {
        // إعادة توجيه لصفحة تسجيل الدخول إذا لم يكن مسجل
        return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(req.url), req.url));
      }
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
        
        // التحقق من تسجيل الدخول للوحة الإدارة
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"]
};
