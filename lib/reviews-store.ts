/**
 * 🌟 مخزن التقييمات باستخدام Upstash Redis
 * 
 * يستخدم Redis بدلاً من memory لضمان بقاء البيانات
 * في بيئة serverless functions مع fallback لملف JSON
 * 
 * يتصل تلقائياً باستخدام متغيرات البيئة:
 * - KV_REST_API_URL
 * - KV_REST_API_TOKEN
 */

import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

export interface Review {
  id: string;
  productId: number;
  authorEmail: string;
  authorName?: string;
  rating: number; // 1-5 نجوم
  title: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  approved: boolean; // للمراجعة قبل النشر
  helpful?: number; // عدد الأشخاص الذين وجدوا التقييم مفيداً
  verified?: boolean; // تم التحقق من الشراء
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// 🗂️ fallback: تخزين مؤقت في ملف JSON للتطوير المحلي
const REVIEWS_FILE_PATH = path.join(process.cwd(), 'data', 'reviews.json');

// 🔧 helper: التحقق من توفر Redis
const isRedisAvailable = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// 🔧 إنشاء اتصال Redis (lazy initialization)
let redis: Redis | null = null;
const getRedis = () => {
  if (!redis && isRedisAvailable()) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return redis;
};

// 🔧 helper: قراءة التقييمات من ملف JSON
const readReviewsFromFile = (): Review[] => {
  try {
    if (fs.existsSync(REVIEWS_FILE_PATH)) {
      const data = fs.readFileSync(REVIEWS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Error reading reviews file:', error);
  }
  return [];
};

// 🔧 helper: كتابة التقييمات إلى ملف JSON
const writeReviewsToFile = (reviews: Review[]): void => {
  try {
    // إنشاء مجلد data إذا لم يكن موجوداً
    const dataDir = path.dirname(REVIEWS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error('❌ Error writing reviews file:', error);
  }
};

/**
 * 💾 إضافة تقييم جديد
 */
export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const newReview: Review = {
    ...review,
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    approved: true, // يمكن تغييرها لـ false إذا كنت تريد مراجعة يدوية
  };

  if (isRedisAvailable()) {
    try {
      // حفظ التقييم في Redis
      await getRedis()?.set(`review:${newReview.id}`, JSON.stringify(newReview));
      
      // إضافة التقييم إلى قائمة تقييمات المنتج
      await getRedis()?.sadd(`product_reviews:${review.productId}`, newReview.id);
      
      // إضافة التقييم إلى قائمة تقييمات المستخدم
      await getRedis()?.sadd(`user_reviews:${review.authorEmail}`, newReview.id);
      
      // تحديث إحصائيات المنتج
      await updateProductReviewStats(review.productId);
      
      console.log(`🌟 Review added to Redis: ${newReview.id}`);
      console.log(`📧 Author: ${newReview.authorEmail}`);
      console.log(`⭐ Rating: ${newReview.rating}/5`);
      
      return newReview;
    } catch (error) {
      console.error('❌ Redis Error, falling back to file:', error);
      // Fallback to file
    }
  }
  
  // Fallback: حفظ في ملف JSON
  const reviews = readReviewsFromFile();
  reviews.push(newReview);
  writeReviewsToFile(reviews);
  
  console.log(`🌟 Review added to file: ${newReview.id}`);
  return newReview;
}

/**
 * 🔍 جلب جميع التقييمات لمنتج معين
 */
export async function getReviewsByProductId(productId: number, approved: boolean = true): Promise<Review[]> {
  if (isRedisAvailable()) {
    try {
      // جلب معرفات التقييمات من Redis
      const reviewIds = await getRedis()?.smembers(`product_reviews:${productId}`) || [];
      
      if (reviewIds.length === 0) {
        console.log(`ℹ️ No reviews found in Redis for product: ${productId}`);
        return [];
      }
      
      // جلب التقييمات
      const reviews: Review[] = [];
      for (const reviewId of reviewIds) {
        const reviewJson = await getRedis()?.get<string>(`review:${reviewId}`);
        if (reviewJson) {
          const review = typeof reviewJson === 'string' ? JSON.parse(reviewJson) : reviewJson;
          if (!approved || review.approved) {
            reviews.push(review);
          }
        }
      }
      
      console.log(`✅ Found ${reviews.length} reviews in Redis for product: ${productId}`);
      return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Redis Error during getReviewsByProductId, falling back to file:', error);
      // Fallback to file
    }
  }
  
  // Fallback: البحث في ملف JSON
  const reviews = readReviewsFromFile();
  const productReviews = reviews.filter(review => 
    review.productId === productId && (!approved || review.approved)
  );
  
  console.log(`📁 Found ${productReviews.length} reviews in file for product: ${productId}`);
  return productReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 🔍 جلب تقييمات مستخدم معين
 */
export async function getReviewsByUserEmail(email: string): Promise<Review[]> {
  if (isRedisAvailable()) {
    try {
      const reviewIds = await getRedis()?.smembers(`user_reviews:${email}`) || [];
      
      const reviews: Review[] = [];
      for (const reviewId of reviewIds) {
        const reviewJson = await getRedis()?.get<string>(`review:${reviewId}`);
        if (reviewJson) {
          const review = typeof reviewJson === 'string' ? JSON.parse(reviewJson) : reviewJson;
          reviews.push(review);
        }
      }
      
      return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Redis Error during getReviewsByUserEmail, falling back to file:', error);
    }
  }
  
  // Fallback: البحث في ملف JSON
  const reviews = readReviewsFromFile();
  return reviews.filter(review => review.authorEmail.toLowerCase() === email.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 🔍 التحقق من وجود تقييم للمستخدم على منتج معين
 */
export async function hasUserReviewedProduct(email: string, productId: number): Promise<boolean> {
  const userReviews = await getReviewsByUserEmail(email);
  return userReviews.some(review => review.productId === productId);
}

/**
 * 📊 جلب ملخص التقييمات لمنتج معين
 */
export async function getReviewSummary(productId: number): Promise<ReviewSummary> {
  const reviews = await getReviewsByProductId(productId, true);
  
  const summary: ReviewSummary = {
    totalReviews: reviews.length,
    averageRating: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  };
  
  if (reviews.length === 0) {
    return summary;
  }
  
  // حساب التوزيع
  reviews.forEach(review => {
    summary.ratingDistribution[review.rating as keyof typeof summary.ratingDistribution]++;
  });
  
  // حساب المتوسط
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  summary.averageRating = Math.round((totalRating / reviews.length) * 10) / 10; // تقريب لرقم عشري واحد
  
  return summary;
}

/**
 * 🌟 جلب جميع التقييمات
 */
export async function getAllReviews(approvedOnly: boolean = false): Promise<Review[]> {
  if (isRedisAvailable()) {
    try {
      const redis = getRedis();
      if (!redis) throw new Error('Redis not available');

      // جلب جميع مفاتيح التقييمات
      const keys = await redis.keys('review:*');
      
      if (keys.length === 0) {
        console.log('🔍 No reviews found in Redis');
        return [];
      }

      // جلب جميع التقييمات
      const reviewsData = await redis.mget(...keys);
      const reviews: Review[] = [];

      reviewsData.forEach((reviewJson) => {
        if (reviewJson) {
          try {
            const review = typeof reviewJson === 'string' ? JSON.parse(reviewJson) : reviewJson;
            if (!approvedOnly || review.approved) {
              reviews.push(review);
            }
          } catch (parseError) {
            console.error('❌ Error parsing review from Redis:', parseError);
          }
        }
      });

      // ترتيب حسب الأحدث
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log(`✅ Found ${reviews.length} reviews in Redis (approved only: ${approvedOnly})`);
      return reviews;
    } catch (error) {
      console.error('❌ Redis Error during getAllReviews, falling back to file:', error);
      // Fallback to file
    }
  }
  
  // Fallback: قراءة من ملف JSON
  const reviews = readReviewsFromFile();
  const filteredReviews = approvedOnly ? reviews.filter(review => review.approved) : reviews;
  
  // ترتيب حسب الأحدث
  return filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 🔄 تحديث إحصائيات التقييمات للمنتج (للاستخدام الداخلي)
 */
async function updateProductReviewStats(productId: number): Promise<void> {
  if (!isRedisAvailable()) return;
  
  try {
    const summary = await getReviewSummary(productId);
    await getRedis()?.set(`product_stats:${productId}`, JSON.stringify(summary));
  } catch (error) {
    console.error('❌ Error updating product review stats:', error);
  }
}

/**
 * 🔍 جلب تقييم بالمعرف
 */
export async function getReviewById(reviewId: string): Promise<Review | null> {
  if (isRedisAvailable()) {
    try {
      const reviewJson = await getRedis()?.get<string>(`review:${reviewId}`);
      if (reviewJson) {
        return typeof reviewJson === 'string' ? JSON.parse(reviewJson) : reviewJson;
      }
    } catch (error) {
      console.error('❌ Redis Error during getReviewById, falling back to file:', error);
    }
  }
  
  // Fallback: البحث في ملف JSON
  const reviews = readReviewsFromFile();
  return reviews.find(review => review.id === reviewId) || null;
}

/**
 * 🗑️ حذف تقييم
 */
export async function deleteReview(reviewId: string): Promise<boolean> {
  const review = await getReviewById(reviewId);
  if (!review) return false;
  
  if (isRedisAvailable()) {
    try {
      // حذف التقييم
      await getRedis()?.del(`review:${reviewId}`);
      
      // إزالة من قائمة تقييمات المنتج
      await getRedis()?.srem(`product_reviews:${review.productId}`, reviewId);
      
      // إزالة من قائمة تقييمات المستخدم
      await getRedis()?.srem(`user_reviews:${review.authorEmail}`, reviewId);
      
      // تحديث إحصائيات المنتج
      await updateProductReviewStats(review.productId);
      
      console.log(`🗑️ Review deleted from Redis: ${reviewId}`);
      return true;
    } catch (error) {
      console.error('❌ Redis Error during deleteReview, falling back to file:', error);
    }
  }
  
  // Fallback: حذف من ملف JSON
  const reviews = readReviewsFromFile();
  const filteredReviews = reviews.filter(r => r.id !== reviewId);
  
  if (filteredReviews.length < reviews.length) {
    writeReviewsToFile(filteredReviews);
    console.log(`🗑️ Review deleted from file: ${reviewId}`);
    return true;
  }
  
  return false;
}

/**
 * ✏️ تحديث تقييم موجود
 */
export async function updateReview(reviewId: string, updates: Partial<Omit<Review, 'id' | 'createdAt'>>): Promise<Review | null> {
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) return null;
  
  const updatedReview: Review = {
    ...existingReview,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  if (isRedisAvailable()) {
    try {
      await getRedis()?.set(`review:${reviewId}`, JSON.stringify(updatedReview));
      
      // تحديث إحصائيات المنتج إذا تغير التقييم
      if (updates.rating && updates.rating !== existingReview.rating) {
        await updateProductReviewStats(existingReview.productId);
      }
      
      console.log(`✏️ Review updated in Redis: ${reviewId}`);
      return updatedReview;
    } catch (error) {
      console.error('❌ Redis Error during updateReview, falling back to file:', error);
    }
  }
  
  // Fallback: تحديث في ملف JSON
  const reviews = readReviewsFromFile();
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  
  if (reviewIndex !== -1) {
    reviews[reviewIndex] = updatedReview;
    writeReviewsToFile(reviews);
    console.log(`✏️ Review updated in file: ${reviewId}`);
    return updatedReview;
  }
  
  return null;
}

/**
 * 🔍 البحث في التقييمات
 */
export async function searchReviews(query: string, productId?: number): Promise<Review[]> {
  let reviews: Review[];
  
  if (productId) {
    reviews = await getReviewsByProductId(productId);
  } else {
    // جلب جميع التقييمات (هذا قد يكون بطيئاً مع Redis، لكن مقبول للـ fallback)
    if (isRedisAvailable()) {
      // في Redis، هذا معقد أكثر، لذا سنستخدم الـ fallback
      reviews = readReviewsFromFile();
    } else {
      reviews = readReviewsFromFile();
    }
  }
  
  const searchTerm = query.toLowerCase();
  return reviews.filter(review => 
    review.title.toLowerCase().includes(searchTerm) ||
    review.body.toLowerCase().includes(searchTerm) ||
    review.authorName?.toLowerCase().includes(searchTerm)
  );
}
