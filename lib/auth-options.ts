import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import { Redis } from '@upstash/redis';

// إعداد Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// واجهة المستخدم
interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  provider?: string;
  image?: string;
  createdAt: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // تسجيل الدخول بالبريد وكلمة المرور
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
        }

        try {
          // البحث عن المستخدم في Redis
          const userJson = await redis.get<string>(`user:${credentials.email}`);
          
          if (!userJson) {
            throw new Error("المستخدم غير موجود");
          }

          const user: User = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;

          // التحقق من كلمة المرور
          if (!user.password) {
            throw new Error("هذا الحساب مسجل عبر وسائل التواصل الاجتماعي");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error("كلمة المرور غير صحيحة");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("خطأ في تسجيل الدخول:", error);
          throw error;
        }
      }
    }),

    // تسجيل الدخول عبر Google مع إعدادات محسنة
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),

    // تسجيل الدخول عبر Facebook
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        authorization: {
          params: {
            scope: "email"
          }
        }
      })
    ] : []),

    // تسجيل الدخول عبر Discord
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET ? [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        authorization: {
          params: {
            scope: "identify email"
          }
        }
      })
    ] : []),

    // تسجيل الدخول عبر Apple - معطل مؤقتاً حتى يتم إعداد المتغيرات
    ...(process.env.APPLE_ID && process.env.APPLE_SECRET ? [
      AppleProvider({
        clientId: process.env.APPLE_ID,
        clientSecret: process.env.APPLE_SECRET,
      })
    ] : []),
  ],

  // إعدادات الجلسة
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },

  // إعدادات JWT
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },

  // الصفحات المخصصة
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // إعدادات cookies محسنة لحل مشكلة State cookie
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.leve1up.store' : undefined
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.leve1up.store' : undefined
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.leve1up.store' : undefined
      }
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900, // 15 minutes
        domain: process.env.NODE_ENV === 'production' ? '.leve1up.store' : undefined
      }
    },
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900, // 15 minutes
        domain: process.env.NODE_ENV === 'production' ? '.leve1up.store' : undefined
      }
    },
    nonce: {
      name: `next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.leve1up.store' : undefined
      }
    }
  },

  // Callbacks
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // التحقق من وجود المستخدم
        const existingUserJson = await redis.get<string>(`user:${user.email}`);
        
        if (!existingUserJson) {
          // إنشاء مستخدم جديد للمزودين الاجتماعيين
          if (account?.provider !== "credentials") {
            const newUser: User = {
              id: user.id || `user_${Date.now()}`,
              name: user.name || profile?.name || (profile as any)?.username || "مستخدم جديد",
              email: user.email,
              provider: account?.provider,
              image: user.image || profile?.image || (profile as any)?.avatar_url,
              createdAt: new Date().toISOString(),
            };

            await redis.set(`user:${user.email}`, JSON.stringify(newUser));
            console.log(`✅ تم إنشاء مستخدم جديد: ${user.email}`);
          }
        }

        return true;
      } catch (error) {
        console.error("خطأ في signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },

  // إعدادات إضافية
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// دوال مساعدة لإدارة المستخدمين
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  // التحقق من وجود المستخدم
  const existingUser = await redis.get<string>(`user:${userData.email}`);
  
  if (existingUser) {
    throw new Error("المستخدم موجود بالفعل");
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  // إنشاء المستخدم الجديد
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    provider: "credentials",
    createdAt: new Date().toISOString(),
  };

  // حفظ في Redis
  await redis.set(`user:${userData.email}`, JSON.stringify(newUser));
  
  console.log(`✅ تم إنشاء مستخدم جديد: ${userData.email}`);
  
  return newUser;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const userJson = await redis.get<string>(`user:${email}`);
    
    if (!userJson) {
      return null;
    }

    return typeof userJson === 'string' ? JSON.parse(userJson) : userJson;
  } catch (error) {
    console.error("خطأ في جلب المستخدم:", error);
    return null;
  }
}
