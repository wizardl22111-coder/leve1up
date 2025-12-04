import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Redis } from '@upstash/redis';

// إعداد Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const authOptions: NextAuthOptions = {
  providers: [
    // تسجيل الدخول بـ Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google' && user.email) {
          // حفظ المستخدم في Redis
          const userData = {
            id: user.id,
            name: user.name || '',
            email: user.email,
            image: user.image || '',
            provider: 'google',
            createdAt: new Date().toISOString(),
          };

          await redis.set(`user:${user.email}`, JSON.stringify(userData));
        }
        return true;
      } catch (error) {
        console.error("خطأ في signIn callback:", error);
        return true; // السماح بتسجيل الدخول حتى لو فشل Redis
      }
    },

    async redirect({ url, baseUrl }) {
      // إعادة التوجيه للملف الشخصي بعد تسجيل الدخول
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/profile`;
    },

    async session({ session, token }) {
      if (session?.user?.email) {
        session.user.id = token.sub || '';
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },

  secret: process.env.NEXTAUTH_SECRET,
};
