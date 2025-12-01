/**
 * Hero Sections Data
 * Contains data for Edit Tools and Subscriptions sections for HeroBanner and SectionGrid
 */

export const editToolsSection = {
  title: "أدوات المونتاج الاحترافية",
  items: [
    {
      id: 1,
      title: "باقة أيقونات متحركة",
      excerpt: "مجموعة شاملة من الأيقونات المتحركة عالية الجودة لمشاريع المونتاج والتصميم",
      image: "/images/products/animated-icons-pack.png",
      price: 25,
      href: "/products/1",
      badge: "الأكثر مبيعاً"
    },
    {
      id: 2,
      title: "باقة التصميم وصناعة المحتوى",
      excerpt: "أدوات وقوالب متقدمة لإنشاء محتوى بصري احترافي ومؤثر",
      image: "/images/products/design-content-pack.png",
      price: 35,
      href: "/products/2",
      badge: "جديد"
    },
    {
      id: 3,
      title: "باقة المونتاج الاحترافية",
      excerpt: "مجموعة كاملة من أدوات المونتاج والمؤثرات البصرية للمحترفين",
      image: "/images/products/ultimate-video-editing-pack.png",
      price: 45,
      href: "/products/3",
      badge: "وفر 30%"
    },
    {
      id: 4,
      title: "الدليل التمهيدي",
      excerpt: "دليل شامل للمبتدئين في عالم المونتاج والتصميم الرقمي",
      image: "/images/products/introductory-guide.png",
      price: 15,
      href: "/products/4"
    }
  ]
};

export const subscriptionsSection = {
  title: "الاشتراكات المميزة",
  items: [
    {
      id: 5,
      title: "اشتراك Google Gemini Pro",
      excerpt: "اشتراك شهري في خدمة الذكاء الاصطناعي المتقدمة من جوجل",
      image: "/images/products/gemini-pro-subscription.jpg",
      price: 80,
      href: "/products/5",
      badge: "الأكثر طلباً"
    },
    {
      id: 6,
      title: "اشتراك Canva Pro",
      excerpt: "اشتراك سنوي في منصة التصميم الرائدة مع جميع الميزات المتقدمة",
      image: "/images/products/canva-subscription.jpg",
      price: 120,
      href: "/products/6",
      badge: "وفر 40%"
    },
    {
      id: 7,
      title: "اشتراك Netflix Premium",
      excerpt: "اشتراك شهري في نتفليكس بجودة 4K ومشاهدة على 4 أجهزة - ابتداءً من 12 ريال",
      image: "/images/products/netflix-subscription.jpg",
      price: 12,
      href: "/products/10",
      badge: "ابتداءً من 12 ريال"
    },
    {
      id: 8,
      title: "اشتراك ChatGPT Plus",
      excerpt: "اشتراك شهري في ChatGPT Plus مع الوصول للميزات المتقدمة",
      image: "/images/products/chatgpt5-subscription.jpg",
      price: 75,
      href: "/products/8",
      badge: "جديد"
    }
  ]
};

// Hero Banner Data
export const heroBannerData = {
  editTools: {
    image: "/images/banners/edits-hero.webp",
    title: "أدوات المونتاج الاحترافية",
    subtitle: "اكتشف مجموعة شاملة من الأدوات والقوالب لإنتاج محتوى احترافي مذهل",
    ctaText: "استكشف الأدوات",
    ctaHref: "/edits-tools"
  },
  subscriptions: {
    image: "/images/banners/subscriptions-hero.webp",
    title: "اشتراكات بأفضل الأسعار",
    subtitle: "احصل على اشتراكاتك المفضلة بأسعار مميزة وضمان الجودة",
    ctaText: "تصفح الاشتراكات",
    ctaHref: "/subscriptions"
  }
};

export default {
  editToolsSection,
  subscriptionsSection,
  heroBannerData
};
