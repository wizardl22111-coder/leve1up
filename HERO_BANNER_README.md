# Hero Banner & Section Grid Components

هذا الدليل يشرح كيفية استخدام مكونات البانر الرئيسي وشبكة الأقسام في موقع Level Up.

## 📁 الملفات المُنشأة

### المكونات (Components)
- `components/HeroBanner.jsx` - البانر الرئيسي مع صورة خلفية ونص CTA
- `components/SectionGrid.jsx` - شبكة عرض المنتجات مع عنوان القسم
- `components/ProductCard.jsx` - بطاقة المنتج الفردية

### البيانات (Data)
- `data/hero-sections.js` - بيانات الأقسام والبانرات

### الصور (Assets)
- `public/images/banners/edits-hero.webp` - صورة بانر أدوات المونتاج
- `public/images/banners/subscriptions-hero.webp` - صورة بانر الاشتراكات

### الاختبارات (Tests)
- `__tests__/HeroBanner.test.jsx` - اختبارات البانر الرئيسي
- `__tests__/SectionGrid.test.jsx` - اختبارات شبكة الأقسام

## 🚀 كيفية الاستخدام

### 1. استيراد المكونات

```jsx
import HeroBanner from '@/components/HeroBanner';
import SectionGrid from '@/components/SectionGrid';
import { heroBannerData, editToolsSection, subscriptionsSection } from '@/data/hero-sections';
```

### 2. استخدام HeroBanner

```jsx
// استخدام بانر أدوات المونتاج
<HeroBanner
  image="/images/banners/edits-hero.webp"
  title="أدوات المونتاج الاحترافية"
  subtitle="اكتشف مجموعة شاملة من الأدوات والقوالب لإنتاج محتوى احترافي مذهل"
  ctaText="استكشف الأدوات"
  ctaHref="/edits-tools"
/>

// أو استخدام البيانات المُعرّفة مسبقاً
<HeroBanner {...heroBannerData.editTools} />
```

### 3. استخدام SectionGrid

```jsx
// عرض قسم أدوات المونتاج
<SectionGrid
  title={editToolsSection.title}
  items={editToolsSection.items}
/>

// عرض قسم الاشتراكات
<SectionGrid
  title={subscriptionsSection.title}
  items={subscriptionsSection.items}
/>
```

### 4. مثال كامل للصفحة الرئيسية

```jsx
import HeroBanner from '@/components/HeroBanner';
import SectionGrid from '@/components/SectionGrid';
import { heroBannerData, editToolsSection, subscriptionsSection } from '@/data/hero-sections';

export default function HomePage() {
  return (
    <main>
      {/* البانر الرئيسي */}
      <HeroBanner {...heroBannerData.editTools} />
      
      {/* قسم أدوات المونتاج */}
      <SectionGrid
        title={editToolsSection.title}
        items={editToolsSection.items}
      />
      
      {/* قسم الاشتراكات */}
      <SectionGrid
        title={subscriptionsSection.title}
        items={subscriptionsSection.items}
      />
    </main>
  );
}
```

## 🎨 خصائص المكونات

### HeroBanner Props

| الخاصية | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| `image` | string | ✅ | مسار صورة البانر |
| `title` | string | ✅ | العنوان الرئيسي |
| `subtitle` | string | ✅ | العنوان الفرعي |
| `ctaText` | string | ✅ | نص زر الإجراء |
| `ctaHref` | string | ✅ | رابط زر الإجراء |

### SectionGrid Props

| الخاصية | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| `title` | string | ✅ | عنوان القسم |
| `items` | array | ✅ | مصفوفة المنتجات |

### ProductCard Props

| الخاصية | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| `id` | number | ✅ | معرف المنتج |
| `title` | string | ✅ | اسم المنتج |
| `excerpt` | string | ✅ | وصف المنتج |
| `image` | string | ✅ | صورة المنتج |
| `price` | number | ✅ | سعر المنتج |
| `href` | string | ✅ | رابط المنتج |
| `badge` | string | ❌ | شارة اختيارية |

## 🔄 تخصيص البيانات

### إضافة منتج جديد

```javascript
// في data/hero-sections.js
const newProduct = {
  id: 9,
  title: "منتج جديد",
  excerpt: "وصف المنتج الجديد",
  image: "/images/products/new-product.png",
  price: 50,
  href: "/products/9",
  badge: "جديد" // اختياري
};

// إضافة للقسم المناسب
editToolsSection.items.push(newProduct);
```

### إنشاء بانر جديد

```javascript
// في data/hero-sections.js
export const newBannerData = {
  image: "/images/banners/new-banner.webp",
  title: "عنوان البانر الجديد",
  subtitle: "وصف البانر الجديد",
  ctaText: "زر الإجراء",
  ctaHref: "/new-page"
};
```

## 🖼️ استبدال الصور

### صور البانرات
1. ضع الصور الجديدة في `/public/images/banners/`
2. استخدم تنسيق WebP للأداء الأفضل
3. الأبعاد المُوصى بها: 1200x600 بكسل
4. حدث مسار الصورة في البيانات

### صور المنتجات
1. ضع الصور في `/public/images/products/`
2. استخدم تنسيق PNG أو JPG
3. الأبعاد المُوصى بها: 400x300 بكسل
4. حدث مسار الصورة في بيانات المنتج

## 📱 التصميم المتجاوب

### HeroBanner
- **الموبايل:** ارتفاع 400px
- **التابلت:** ارتفاع 500px
- **الكمبيوتر:** ارتفاع 600px

### SectionGrid
- **الموبايل:** عمود واحد
- **التابلت والكمبيوتر:** عمودين (2×2 للعرض البصري)

### ProductCard
- **الموبايل:** ارتفاع صورة 192px (h-48)
- **التابلت:** ارتفاع صورة 224px (h-56)
- **الكمبيوتر:** ارتفاع صورة 256px (h-64)

## 🧪 تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل اختبارات محددة
npm test HeroBanner.test.jsx
npm test SectionGrid.test.jsx

# تشغيل الاختبارات مع التغطية
npm test -- --coverage
```

## 🎯 إمكانية الوصول (Accessibility)

### الميزات المُطبقة:
- ✅ نصوص بديلة للصور (`alt` attributes)
- ✅ تسميات ARIA للروابط (`aria-label`)
- ✅ هيكل عناوين صحيح (H1, H2)
- ✅ تباين ألوان مناسب
- ✅ دعم التنقل بالكيبورد
- ✅ حالات التركيز الواضحة (`focus` states)

## 🔧 استكشاف الأخطاء

### مشاكل شائعة:

1. **الصور لا تظهر:**
   - تأكد من وجود الصور في المسار الصحيح
   - تحقق من أسماء الملفات وامتداداتها

2. **خطأ في الاستيراد:**
   ```bash
   Error: Cannot resolve module '@/components/HeroBanner'
   ```
   - تأكد من وجود الملف في المسار الصحيح
   - تحقق من إعدادات path mapping في `next.config.js`

3. **مشاكل في التصميم:**
   - تأكد من تحديث `app/globals.css` مع line-clamp utilities
   - تحقق من تحميل Tailwind CSS بشكل صحيح

## 📋 قائمة التحقق

قبل النشر، تأكد من:

- [ ] جميع الصور موجودة في المسارات الصحيحة
- [ ] البيانات محدثة في `data/hero-sections.js`
- [ ] الاختبارات تمر بنجاح
- [ ] التصميم يعمل على جميع أحجام الشاشات
- [ ] الروابط تعمل بشكل صحيح
- [ ] إمكانية الوصول مُطبقة

## 🚀 النشر

```bash
# بناء المشروع
npm run build

# تشغيل المشروع
npm run dev

# فحص الصفحة الرئيسية والتأكد من:
# - عرض البانر بشكل صحيح
# - عرض الأقسام مع المنتجات
# - عمل الروابط والأزرار
# - التصميم المتجاوب على mobile/desktop
```

---

**ملاحظة:** هذه المكونات مُصممة للعمل مع Next.js 14+ و Tailwind CSS. تأكد من توافق إصدارات المكتبات.
