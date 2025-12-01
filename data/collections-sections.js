// Collections data for sections replacement
export const collectionsData = {
  editingTools: {
    id: 'editing-tools',
    title: 'أدوات المونتاج الاحترافية',
    subtitle: 'كل ما تحتاجه لإنتاج محتوى احترافي',
    slug: 'editing-tools',
    heroImage: '/images/collections/edits-hero.webp',
    heroImageAlt: 'أدوات المونتاج الاحترافية',
    excerpt: 'مجموعة شاملة من الأدوات والقوالب والمؤثرات لإنتاج فيديوهات احترافية',
    ctaText: 'استكشف الأدوات',
    ctaLink: '/edits-tools',
    backgroundColor: 'from-purple-900/20 to-blue-900/20',
    badgeText: 'الأكثر طلباً',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    items: [
      {
        id: 3,
        title: 'باقة الأيقونات المتحركة',
        image: '/images/products/animated-icons-pack.png',
        price: 149,
        originalPrice: 299,
        currency: 'SAR',
        badge: 'الأكثر مبيعاً',
        badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
        category: 'editing-tools',
        rating: 4.8,
        link: '/products/3'
      },
      {
        id: 4,
        title: 'باقة التصميم وصناعة المحتوى',
        image: '/images/products/design-content-pack.png',
        price: 199,
        originalPrice: 399,
        currency: 'SAR',
        badge: 'جديد',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        category: 'editing-tools',
        rating: 4.9,
        link: '/products/4'
      },
      {
        id: 5,
        title: 'باقة المونتاج الاحترافية',
        image: '/images/products/ultimate-video-editing-pack.png',
        price: 299,
        originalPrice: 599,
        currency: 'SAR',
        badge: 'الأفضل',
        badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        category: 'editing-tools',
        rating: 5.0,
        link: '/products/5'
      }
    ]
  },
  subscriptions: {
    id: 'subscriptions',
    title: 'الاشتراكات المميزة',
    subtitle: 'اشتراكات بأفضل الأسعار وضمان الجودة',
    slug: 'subscriptions',
    heroImage: '/images/collections/subscriptions-hero.webp',
    heroImageAlt: 'الاشتراكات المميزة',
    excerpt: 'احصل على اشتراكاتك المفضلة بأسعار مخفضة وضمان شامل',
    ctaText: 'تصفح الاشتراكات',
    ctaLink: '/subscriptions',
    backgroundColor: 'from-emerald-900/20 to-teal-900/20',
    badgeText: 'أسعار مميزة',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    items: [
      {
        id: 9,
        title: 'اشتراك Google Gemini Pro',
        image: '/images/products/gemini-pro-subscription.jpg',
        price: 89,
        originalPrice: 149,
        currency: 'SAR',
        badge: 'وفر 40%',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
        category: 'subscriptions',
        rating: 4.7,
        link: '/products/9'
      },
      {
        id: 10,
        title: 'اشتراك Canva Pro',
        image: '/images/products/canva-subscription.jpg',
        price: 79,
        originalPrice: 129,
        currency: 'SAR',
        badge: 'شائع',
        badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        category: 'subscriptions',
        rating: 4.6,
        link: '/products/10'
      },
      {
        id: 11,
        title: 'اشتراك Netflix Premium',
        image: '/images/products/netflix-subscription.jpg',
        price: 59,
        originalPrice: 99,
        currency: 'SAR',
        badge: 'الأكثر طلباً',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        category: 'subscriptions',
        rating: 4.8,
        link: '/products/11'
      },
      {
        id: 12,
        title: 'اشتراك ChatGPT Plus',
        image: '/images/products/chatgpt5-subscription.jpg',
        price: 99,
        originalPrice: 159,
        currency: 'SAR',
        badge: 'AI مميز',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        category: 'subscriptions',
        rating: 4.9,
        link: '/products/12'
      }
    ]
  }
};

export default collectionsData;
