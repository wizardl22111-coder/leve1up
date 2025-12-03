import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // التحقق من الوصول للوحة الإدارة
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // التحقق من وجود دور الإدارة
      const userRole = req.nextauth.token?.role;
      
      if (userRole !== "admin") {
        // إعادة توجيه للصفحة الرئيسية إذا لم يكن مدير
        return NextResponse.redirect(new URL("/", req.url));
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

