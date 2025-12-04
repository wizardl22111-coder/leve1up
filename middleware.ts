import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // لا حاجة لأي منطق إضافي - فقط حماية أساسية
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/profile"]
};
