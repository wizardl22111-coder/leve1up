const fs = require('fs');
const path = require('path');

// تعليقات قصيرة بلهجات محلية
const shortComments = {
  // لهجة خليجية
  gulf: [
    "والله زين",
    "مرة حلو",
    "يستاهل",
    "ممتاز صراحة",
    "حبيته",
    "مفيد جداً",
    "يجنن",
    "عجبني",
    "روعة",
    "ما شاء الله"
  ],
  
  // لهجة أردنية
  jordanian: [
    "كتير حلو",
    "بجنن",
    "رهيب",
    "عجبني كتير",
    "ممتاز",
    "حلو كتير",
    "بستاهل",
    "زي العسل",
    "كتير مفيد",
    "روعة"
  ],
  
  // لهجة مصرية
  egyptian: [
    "جامد جداً",
    "تحفة",
    "عسل",
    "حلو أوي",
    "كويس جداً",
    "ممتاز",
    "يستاهل",
    "عجبني",
    "جميل",
    "مفيد جداً"
  ]
};

// دالة لاختيار تعليق عشوائي
function getRandomComment() {
  const dialects = Object.keys(shortComments);
  const randomDialect = dialects[Math.floor(Math.random() * dialects.length)];
  const comments = shortComments[randomDialect];
  return comments[Math.floor(Math.random() * comments.length)];
}

// قراءة ملف التقييمات
const reviewsPath = path.join(__dirname, '../public/product-reviews.json');
const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));

// تحديث التقييمات
Object.keys(reviewsData).forEach(productId => {
  reviewsData[productId].forEach(review => {
    // تحديث التقييمات التي لها تعليقات فقط
    if (review.type === 'full' || review.type === 'simple_text') {
      // 70% احتمال أن يكون هناك تعليق قصير
      if (Math.random() < 0.7) {
        review.comment = getRandomComment();
        review.type = 'simple_text';
      } else {
        // 30% بدون تعليق (نجوم فقط)
        review.comment = '';
        review.type = 'stars_only';
      }
    }
  });
});

// حفظ الملف المحدث
fs.writeFileSync(reviewsPath, JSON.stringify(reviewsData, null, 2), 'utf8');

console.log('✅ تم تحديث تعليقات التقييمات بنجاح!');
console.log('📝 التعليقات الآن قصيرة وبلهجات محلية');

// إحصائيات
let totalReviews = 0;
let reviewsWithComments = 0;

Object.keys(reviewsData).forEach(productId => {
  reviewsData[productId].forEach(review => {
    totalReviews++;
    if (review.comment && review.comment.trim() !== '') {
      reviewsWithComments++;
    }
  });
});

console.log(`📊 إجمالي التقييمات: ${totalReviews}`);
console.log(`💬 التقييمات مع تعليقات: ${reviewsWithComments}`);
console.log(`⭐ التقييمات بنجوم فقط: ${totalReviews - reviewsWithComments}`);
