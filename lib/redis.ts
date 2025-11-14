import { Redis } from '@upstash/redis';

// إنشاء اتصال Redis
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// نوع المستخدم
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  provider: string;
  image?: string;
  createdAt: string;
}

// دالة للحصول على المستخدم
export async function getUser(email: string): Promise<User | null> {
  try {
    const userJson = await redis.get<string>(`user:${email}`);
    if (!userJson) return null;
    
    return typeof userJson === 'string' ? JSON.parse(userJson) : userJson;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// دالة لحفظ المستخدم
export async function saveUser(user: User): Promise<boolean> {
  try {
    await redis.set(`user:${user.email}`, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
}

// دالة للتحقق من وجود المستخدم
export async function userExists(email: string): Promise<boolean> {
  try {
    const user = await redis.get(`user:${email}`);
    return !!user;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}
