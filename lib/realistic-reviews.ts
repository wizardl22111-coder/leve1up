export interface RealisticReview {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  avatar: string;
  type: 'full' | 'simple_text' | 'stars_only';
  date: string;
  verified: boolean;
  productId: number;
}

export interface Product {
  product_id: number;
  product_name: string;
  category: string;
  price: number;
  isFree?: boolean;
}

// أسماء عربية متنوعة
const arabicNames = [
  // أسماء خليجية
  'محمد العتيبي', 'فاطمة الزهراني', 'أحمد السالم', 'نورا القحطاني', 'خالد المطيري',
  'سارة الدوسري', 'عبدالله الشمري', 'مريم الحربي', 'سلطان المالكي', 'ريم الغامدي',
  'فهد العنزي', 'هند الراشد', 'عبدالرحمن الفيصل', 'لطيفة السديري', 'بندر الخالد',
  
  // أسماء أردنية
  'علي الأردني', 'رشا محمود', 'عمر الزعبي', 'ديانا العمري', 'محمود الطراونة',
  'سلمى الخوري', 'أحمد الشريف', 'لينا الحداد', 'يوسف القاسم', 'رنا العبدالله',
  
  // أسماء مصرية
  'ياسمين أحمد', 'مريم محمد', 'حسام علي', 'دينا حسن', 'كريم عبدالله',
  'نادية إبراهيم', 'طارق محمود', 'سمر عبدالرحمن', 'أمير صلاح', 'هبة عثمان',
  
  // أسماء مغربية
  'عبدالرحيم المغربي', 'خديجة الحسني', 'يوسف البركاني', 'فاطمة الزهراء', 'عمر الإدريسي',
  
  // أسماء عراقية
  'حيدر العراقي', 'زينب الحسيني', 'مصطفى البغدادي', 'نور الهدى', 'علي الكربلائي',
  
  // أسماء شامية
  'سامر الشامي', 'لارا الحلبي', 'باسل الدمشقي', 'ريما اللبنانية', 'نادر الحموي'
];

// تعليقات واقعية حسب نوع المنتج
const reviewTemplates = {
  ebooks: {
    positive: [
      'كتاب مفيد جداً ومليء بالمعلومات القيمة',
      'استفدت كثيراً من هذا الكتاب، ينصح به بشدة',
      'محتوى ممتاز وأسلوب سهل في الشرح',
      'كتاب رائع يستحق القراءة',
      'معلومات قيمة ومفيدة للغاية',
      'شرح واضح ومفصل، أنصح بقراءته',
      'كتاب يغطي الموضوع بشكل شامل',
      'استطعت تطبيق ما تعلمته من الكتاب بسهولة',
      'محتوى عملي ومفيد جداً',
      'كتاب يستحق أكثر من 5 نجوم'
    ],
    neutral: [
      'كتاب جيد بشكل عام',
      'محتوى مفيد لكن يحتاج المزيد من التفاصيل',
      'كتاب لا بأس به',
      'معلومات مفيدة لكن ليست جديدة',
      'جيد للمبتدئين'
    ],
    negative: [
      'كان يمكن أن يكون أفضل',
      'محتوى أساسي جداً',
      'توقعت معلومات أكثر تفصيلاً'
    ]
  },
  courses: {
    positive: [
      'دورة ممتازة وشرح واضح جداً',
      'استفدت كثيراً من هذه الدورة',
      'محتوى عملي ومفيد للغاية',
      'دورة تستحق كل ريال دفعته فيها',
      'شرح مبسط وسهل الفهم',
      'دورة شاملة وتغطي جميع الجوانب',
      'المدرب محترف ويشرح بطريقة ممتازة',
      'تطبيق عملي رائع للمفاهيم',
      'دورة تفوق التوقعات',
      'أنصح بها كل من يريد تعلم هذا المجال'
    ],
    neutral: [
      'دورة جيدة بشكل عام',
      'محتوى مفيد لكن يحتاج تحديث',
      'دورة لا بأس بها للمبتدئين',
      'شرح واضح لكن سريع قليلاً'
    ],
    negative: [
      'توقعت محتوى أكثر تفصيلاً',
      'الدورة أساسية جداً',
      'يحتاج المزيد من الأمثلة العملية'
    ]
  },
  tools: {
    positive: [
      'أداة رائعة وسهلة الاستخدام',
      'وفرت علي الكثير من الوقت والجهد',
      'أداة احترافية وتستحق الشراء',
      'تصميم ممتاز وواجهة سهلة',
      'أداة فعالة جداً في عملي',
      'تطبيق ممتاز ومفيد',
      'أداة تستحق كل ريال',
      'سهولة في الاستخدام ونتائج ممتازة',
      'أداة لا غنى عنها',
      'تحسنت إنتاجيتي بشكل كبير'
    ],
    neutral: [
      'أداة جيدة بشكل عام',
      'تؤدي الغرض المطلوب',
      'أداة لا بأس بها',
      'مفيدة لكن تحتاج تحسينات'
    ],
    negative: [
      'واجهة معقدة قليلاً',
      'تحتاج المزيد من الميزات',
      'توقعت أداء أفضل'
    ]
  }
};

// كلمات بسيطة للتقييمات النصية
const simpleWords = [
  'ممتاز', 'رائع', 'جيد جداً', 'مفيد', 'رائع جداً', 'ممتاز جداً',
  'جميل', 'مذهل', 'قيم', 'مفيد جداً', 'احترافي', 'متميز',
  'جيد', 'لا بأس به', 'مقبول', 'عادي'
];

// دالة لتوليد تقييم واقعي
export function generateRealisticReview(
  productId: number, 
  product: Product, 
  reviewId: number
): RealisticReview {
  const name = arabicNames[Math.floor(Math.random() * arabicNames.length)];
  const avatarNum = Math.floor(Math.random() * 100) + 1;
  const avatar = `/images/avatars/avatar-${avatarNum}.jpg`;
  
  // تحديد نوع التقييم بناءً على احتمالات واقعية
  const rand = Math.random();
  let type: 'full' | 'simple_text' | 'stars_only';
  let rating: number;
  let comment = '';
  
  if (rand < 0.4) {
    // 40% تقييمات كاملة
    type = 'full';
    rating = Math.random() < 0.8 ? (Math.random() < 0.6 ? 5 : 4) : (Math.random() < 0.7 ? 3 : (Math.random() < 0.8 ? 2 : 1));
    
    // اختيار تعليق مناسب حسب الفئة والتقييم
    const category = product.category === 'ebooks' ? 'ebooks' : 
                    product.category === 'courses' ? 'courses' : 'tools';
    
    const templates = reviewTemplates[category];
    if (rating >= 4) {
      comment = templates.positive[Math.floor(Math.random() * templates.positive.length)];
    } else if (rating === 3) {
      comment = templates.neutral[Math.floor(Math.random() * templates.neutral.length)];
    } else {
      comment = templates.negative[Math.floor(Math.random() * templates.negative.length)];
    }
  } else if (rand < 0.7) {
    // 30% تقييمات نصية بسيطة
    type = 'simple_text';
    rating = Math.random() < 0.85 ? (Math.random() < 0.7 ? 5 : 4) : 3;
    comment = simpleWords[Math.floor(Math.random() * simpleWords.length)];
  } else {
    // 30% تقييمات نجوم فقط
    type = 'stars_only';
    rating = Math.random() < 0.9 ? (Math.random() < 0.8 ? 5 : 4) : 3;
    comment = '';
  }
  
  // تاريخ عشوائي في آخر 6 أشهر
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 180));
  
  return {
    id: reviewId,
    customerName: name,
    rating,
    comment,
    avatar,
    type,
    date: date.toISOString(),
    verified: true,
    productId
  };
}

// دالة لحفظ تقييم جديد
export function saveNewReview(review: Omit<RealisticReview, 'id' | 'date' | 'verified'>): RealisticReview {
  const newReview: RealisticReview = {
    ...review,
    id: Date.now(), // استخدام timestamp كمعرف فريد
    date: new Date().toISOString(),
    verified: true
  };
  
  // حفظ في localStorage
  const existingReviews = getStoredReviews();
  existingReviews.push(newReview);
  localStorage.setItem('user_reviews', JSON.stringify(existingReviews));
  
  return newReview;
}

// دالة لجلب التقييمات المحفوظة محلياً
export function getStoredReviews(): RealisticReview[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('user_reviews');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// دالة لجلب تقييمات منتج محدد مع دمج التقييمات المحفوظة محلياً
export async function getProductReviews(productId: number): Promise<RealisticReview[]> {
  try {
    // جلب التقييمات الأساسية من الملف
    const response = await fetch('/product-reviews.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allReviews = await response.json();
    const baseReviews = allReviews[productId.toString()] || [];
    
    // جلب التقييمات المحفوظة محلياً
    const storedReviews = getStoredReviews().filter(review => review.productId === productId);
    
    // دمج التقييمات وخلطها عشوائياً
    const combinedReviews = [...baseReviews, ...storedReviews];
    return combinedReviews.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    
    // في حالة الفشل، إرجاع التقييمات المحفوظة محلياً فقط
    const storedReviews = getStoredReviews().filter(review => review.productId === productId);
    return storedReviews;
  }
}

// دالة لحساب إحصائيات التقييمات
export function calculateReviewStats(reviews: RealisticReview[]) {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  const ratingDistribution = reviews.reduce((dist, review) => {
    dist[review.rating as keyof typeof dist]++;
    return dist;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  
  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution
  };
}
