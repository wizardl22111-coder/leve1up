/**
 * Generate realistic product reviews for UI/testing purposes
 * @param {Object} options - Configuration options
 * @param {string} options.locale - One of: "eg" (Egyptian), "jo" (Jordanian), "sa" (Saudi)
 * @param {number} options.count - Number of reviews to generate
 * @param {boolean} options.includeStarsOnly - If true, generate star-only reviews
 * @returns {Array} Array of review objects
 */
function generateSampleReviews({ locale, count, includeStarsOnly = false }) {
  // Rating distribution: 60% 5-star, 20% 4-star, 10% 3-star, 7% 2-star, 3% 1-star
  const ratingDistribution = [
    { rating: 5, weight: 60 },
    { rating: 4, weight: 20 },
    { rating: 3, weight: 10 },
    { rating: 2, weight: 7 },
    { rating: 1, weight: 3 }
  ];

  // Locale-specific data
  const localeData = {
    eg: {
      usernames: ['أحمد محمد', 'محمد علي', 'فاطمة أحمد', 'عائشة محمود', 'علي حسن', 'مريم خالد', 'حسن عبدالله', 'نور الدين', 'يوسف إبراهيم', 'سارة أحمد'],
      phrases: {
        5: [
          'منتج رائع جداً! بصراحة عجبني أوي وسهل الاستخدام',
          'ممتاز والله! ربنا يبارك حلو جداً ومفيد',
          'بجد حاجة حلوة! عجبني التنظيم والجودة العالية',
          'باقة شاملة ومفيدة جداً! وفرت علي وقت ومجهود كبير',
          'أفضل استثمار قمت به! الجودة احترافية والسعر ممتاز'
        ],
        4: [
          'حلو بس ممكن يكون أحسن شوية في التنظيم',
          'كويس جداً بصراحة! أنصح به للمبتدئين والمحترفين',
          'عجبني لكن فيه تحسينات ممكن تتعمل',
          'جميل ومفيد! الملفات منظمة بشكل جيد'
        ],
        3: [
          'عادي مش وحش بس مش أحسن حاجة شفتها',
          'متوسط يعني، فيه أحسن منه في السوق',
          'مقبول لحد كبير بس محتاج تطوير',
          'كويس بس مش أكتر من كده'
        ],
        2: [
          'مش حلو أوي، فيه مشاكل في الجودة',
          'ممكن يكون أحسن، مش عاجبني قوي',
          'فيه نقص واضح في المحتوى',
          'مش زي ما كنت متوقع'
        ],
        1: [
          'مش حلو خالص! مضيعة وقت وفلوس',
          'سيء جداً، مش أنصح به أبداً',
          'مش عاجبني خالص، جودة ضعيفة',
          'مخيب للآمال تماماً'
        ]
      }
    },
    jo: {
      usernames: ['محمد الأحمد', 'أحمد خالد', 'فاطمة محمد', 'زينب علي', 'عمر حسن', 'لينا أحمد', 'خالد محمود', 'رنا سالم', 'يزن عبدالله', 'سلمى حسين'],
      phrases: {
        5: [
          'والله الشغل تمام! نظيف الشغل ممتاز',
          'تبارك الله عليك! شغل محترم جداً',
          'والله زي العسل! كل شي منظم وحلو',
          'شغل احترافي والله! أنصح فيه بقوة',
          'ممتاز كتير! وفر علي وقت ومجهود'
        ],
        4: [
          'تمام بس ممكن أحسن شوية',
          'شغل كويس والله! منيح للاستعمال',
          'حلو لكن فيه مجال للتحسين',
          'كتير منيح! الجودة حلوة'
        ],
        3: [
          'عادي يعني، مش وحش ومش ممتاز',
          'متوسط الحال، ماشي الحال',
          'مقبول لحد ما، بس مش أكتر',
          'عادي، فيه أحسن منه'
        ],
        2: [
          'مش كتير حلو، فيه نقص واضح',
          'ممكن يكون أحسن، مش عاجبني كتير',
          'فيه مشاكل تحتاج حل',
          'مش زي ما توقعت'
        ],
        1: [
          'مش حلو أبداً! ضايع وقت',
          'سيء كتير، ما أنصح فيه',
          'مش عاجبني خالص',
          'مخيب للآمال'
        ]
      }
    },
    sa: {
      usernames: ['عبدالله سالم', 'محمد العلي', 'فاطمة خالد', 'نورا حسن', 'سعد الشهري', 'ريم محمود', 'خالد عبدالرحمن', 'هند العتيبي', 'فهد الدوسري', 'لطيفة القحطاني'],
      phrases: {
        5: [
          'ما شاء الله تبارك الله! منتج ممتاز',
          'مره كويس! أنصح به بقوة',
          'الله يعطيك العافية! شغل نظيف ومرتب',
          'تسلم إيدك! جودة احترافية بسعر ممتاز',
          'باقة متكاملة وعملية! وفرت علي وقت كبير'
        ],
        4: [
          'كويس بس ممكن أحسن في بعض النقاط',
          'حلو مره لكن فيه مجال للتطوير',
          'جميل وعملي! الملفات منظمة بشكل جيد',
          'مقبول جداً! أنصح به للمبتدئين'
        ],
        3: [
          'عادي يعني، مش وحش ومش ممتاز',
          'متوسط الحال، ماشي الحال معاه',
          'مقبول لحد كبير بس محتاج تحسين',
          'عادي، فيه أفضل منه في السوق'
        ],
        2: [
          'مش حلو مره، فيه نقص واضح',
          'ممكن يكون أفضل، مش عاجبني كتير',
          'فيه مشاكل تحتاج حل عاجل',
          'مش زي ما كنت أتوقع'
        ],
        1: [
          'سيء مره! ما أنصح به أبداً',
          'مضيعة وقت وفلوس',
          'مش حلو أبداً، جودة ضعيفة',
          'مخيب للآمال تماماً'
        ]
      }
    }
  };

  // Helper function to get weighted random rating
  function getRandomRating() {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const { rating, weight } of ratingDistribution) {
      cumulative += weight;
      if (random <= cumulative) {
        return rating;
      }
    }
    return 5; // fallback
  }

  // Helper function to get random item from array
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Helper function to generate random date within last 6 months
  function getRandomDate() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
    const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
    return new Date(randomTime).toISOString().split('T')[0]; // Return YYYY-MM-DD format like existing reviews
  }

  // Generate reviews
  const reviews = [];
  const currentLocaleData = localeData[locale];
  
  if (!currentLocaleData) {
    throw new Error(`Unsupported locale: ${locale}. Supported locales: eg, jo, sa`);
  }

  for (let i = 0; i < count; i++) {
    const rating = getRandomRating();
    const username = getRandomItem(currentLocaleData.usernames);
    const timestamp = Date.now() + i; // Ensure unique IDs
    
    let comment;
    if (includeStarsOnly) {
      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      comment = stars; // NO "(مثال)" prefix for stars only
    } else {
      comment = getRandomItem(currentLocaleData.phrases[rating]); // NO "(مثال)" prefix for text
    }

    reviews.push({
      review_id: timestamp + i,
      product_id: null, // Will be set when used
      user_name: username,
      rating,
      comment,
      date: getRandomDate(),
      verified_purchase: true
    });
  }

  return reviews;
}

/**
 * Update product buyers count to sample text
 * @param {Array} products - Array of product objects
 * @returns {Array} Updated products array
 */
function updateProductBuyersToSample(products) {
  return products.map(product => ({
    ...product,
    buyers: "تم شراءه 300 مرة" // Removed "مثال" as requested
  }));
}

// Export functions
module.exports = {
  generateSampleReviews,
  updateProductBuyersToSample
};

/* 
EXAMPLE OUTPUTS (NO "مثال" prefix - realistic reviews):

1. Egyptian locale (eg), count=3, includeStarsOnly=false:
[
  {
    "review_id": 1700000000000,
    "product_id": null,
    "user_name": "أحمد محمد",
    "rating": 5,
    "comment": "منتج رائع جداً! بصراحة عجبني أوي وسهل الاستخدام",
    "date": "2024-08-15",
    "verified_purchase": true
  },
  {
    "review_id": 1700000000001,
    "product_id": null,
    "user_name": "فاطمة أحمد",
    "rating": 4,
    "comment": "حلو بس ممكن يكون أحسن شوية في التنظيم",
    "date": "2024-09-20",
    "verified_purchase": true
  },
  {
    "review_id": 1700000000002,
    "product_id": null,
    "user_name": "محمد علي",
    "rating": 5,
    "comment": "ممتاز والله! ربنا يبارك حلو جداً ومفيد",
    "date": "2024-10-05",
    "verified_purchase": true
  }
]

2. Saudi locale (sa), count=3, includeStarsOnly=false:
[
  {
    "review_id": 1700000000000,
    "product_id": null,
    "user_name": "عبدالله سالم",
    "rating": 5,
    "comment": "ما شاء الله تبارك الله! منتج ممتاز",
    "date": "2024-08-10",
    "verified_purchase": true
  },
  {
    "review_id": 1700000000001,
    "product_id": null,
    "user_name": "نورا حسن",
    "rating": 4,
    "comment": "كويس بس ممكن أحسن في بعض النقاط",
    "date": "2024-09-25",
    "verified_purchase": true
  },
  {
    "review_id": 1700000000002,
    "product_id": null,
    "user_name": "سعد الشهري",
    "rating": 5,
    "comment": "مره كويس! أنصح به بقوة",
    "date": "2024-10-12",
    "verified_purchase": true
  }
]

3. Stars only example (includeStarsOnly=true):
[
  {
    "review_id": 1700000000000,
    "product_id": null,
    "user_name": "أحمد محمد",
    "rating": 5,
    "comment": "★★★★★",
    "date": "2024-08-15",
    "verified_purchase": true
  }
]

USAGE EXAMPLES:

// Generate realistic reviews (NO "مثال" prefix)
const saudiReviews = generateSampleReviews({
  locale: "sa",
  count: 10,
  includeStarsOnly: false
});

// Generate star-only reviews
const starReviews = generateSampleReviews({
  locale: "eg",
  count: 5,
  includeStarsOnly: true
});

// Update products buyers count (removed "مثال")
const products = [
  { id: 1, name: "Product 1", buyers: "تم الشراء أكثر من 300 مرة" },
  { id: 2, name: "Product 2", buyers: "129 مشتري" }
];
const updatedProducts = updateProductBuyersToSample(products);
// Result: all products will have buyers: "تم شراءه 300 مرة"

*/

