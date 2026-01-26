# Sections Replace Components

هذا المشروع يحتوي على مكونات جديدة لاستبدال أقسام "أدوات المونتاج" و"الاشتراكات" في الموقع بتصميم حديث ومتجاوب.

## 📁 الملفات المضافة

### المكونات الأساسية:
- `components/SectionsReplace.tsx` - المكون الرئيسي
- `components/CollectionShowcase.tsx` - عرض المجموعات مع البانر
- `components/ProductCarousel.tsx` - سلايدر المنتجات الأفقي
- `components/ProductCard.tsx` - بطاقة المنتج المحسنة

### البيانات:
- `data/collections-sections.js` - بيانات المجموعات والمنتجات

### الصور:
- `public/images/collections/edits-hero.webp` - صورة بانر أدوات المونتاج
- `public/images/collections/subscriptions-hero.webp` - صورة بانر الاشتراكات

### الاختبارات:
- `__tests__/SectionsReplace.test.tsx` - اختبارات المكونات

## 🚀 كيفية الاستخدام

### 1. استبدال الأقسام في الصفحة الرئيسية

في ملف الصفحة الرئيسية (مثل `app/page.tsx` أو `pages/index.tsx`):

```tsx
import SectionsReplace from '@/components/SectionsReplace';

export default function HomePage() {
  return (
    <main>
      {/* المحتوى الآخر */}
      
      {/* استبدال الأقسام القديمة بالجديدة */}
      <SectionsReplace />
      
      {/* المحتوى الآخر */}
    </main>
  );
}
```

### 2. عرض قسم واحد فقط

```tsx
// عرض أدوات المونتاج فقط
<SectionsReplace sections={['editingTools']} />

// عرض الاشتراكات فقط
<SectionsReplace sections={['subscriptions']} />
```

### 3. تغيير التخطيط

```tsx
// تخطيط أفقي (افتراضي) - سلايدر
<SectionsReplace layout="horizontal" />

// تخطيط عمودي - شبكة
<SectionsReplace layout="vertical" />
```

## 🎨 الميزات

### التصميم المتجاوب:
- **الموبايل:** عنصر واحد في الصف
- **التابلت:** 2 عنصر في الصف
- **الكمبيوتر:** 3-4 عناصر في الصف

### البانر الرئيسي:
- صورة خلفية مع تأثيرات
- عنوان وعنوان فرعي
- وصف مختصر
- زر CTA (Call to Action)
- شارة مميزة

### سلايدر المنتجات:
- تمرير أفقي سلس
- أزرار التنقل (السابق/التالي)
- مؤشرات التمرير
- دعم اللمس على الموبايل

### بطاقات المنتجات:
- صور عالية الجودة مع lazy loading
- شارات مخصصة (الأكثر مبيعاً، جديد، إلخ)
- تقييم بالنجوم
- عرض السعر مع الخصومات
- زر إضافة للسلة
- تأثيرات hover متقدمة

## 🔧 التخصيص

### تعديل البيانات:

في ملف `data/collections-sections.js`:

```javascript
export const collectionsData = {
  editingTools: {
    title: 'عنوان مخصص',
    subtitle: 'عنوان فرعي مخصص',
    heroImage: '/path/to/custom/image.webp',
    backgroundColor: 'from-custom-900/20 to-custom-800/20',
    items: [
      // منتجاتك المخصصة
    ]
  }
};
```

### إضافة منتجات جديدة:

```javascript
{
  id: 99,
  title: 'منتج جديد',
  image: '/images/products/new-product.jpg',
  price: 199,
  originalPrice: 299,
  currency: 'SAR',
  badge: 'جديد',
  badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  category: 'editing-tools',
  rating: 4.8,
  link: '/products/99'
}
```

### تخصيص الألوان:

في ملف `app/globals.css` أو في المكونات مباشرة:

```css
/* ألوان مخصصة لأدوات المونتاج */
.editing-tools-theme {
  --primary-color: #your-color;
  --secondary-color: #your-secondary-color;
}
```

## 📱 دعم RTL

جميع المكونات تدعم RTL بشكل كامل:
- النصوص العربية محاذاة بشكل صحيح
- أزرار التنقل تعمل بالاتجاه الصحيح
- التخطيط يتكيف مع الاتجاه العربي

## ♿ إمكانية الوصول

- جميع الصور تحتوي على `alt` text
- الأزرار قابلة للوصول بالكيبورد
- `aria-labels` للعناصر التفاعلية
- تباين ألوان مناسب

## 🚀 الأداء

- **Lazy Loading:** الصور تحمل عند الحاجة
- **Next/Image:** استخدام مكون Next.js المحسن
- **WebP:** صور محسنة للويب
- **Tree Shaking:** تحميل المكونات المطلوبة فقط

## 🧪 تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل اختبارات محددة
npm test SectionsReplace

# تشغيل الاختبارات مع التغطية
npm test -- --coverage
```

## 📦 التبعيات المطلوبة

تأكد من وجود هذه التبعيات في `package.json`:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "jest": "^29.0.0"
  }
}
```

## 🔄 التكامل مع النظام الحالي

### استبدال الأقسام القديمة:

1. **احفظ نسخة احتياطية** من الأقسام القديمة
2. **استبدل** المكونات القديمة بـ `<SectionsReplace />`
3. **اختبر** التكامل مع نظام السلة والدفع
4. **تأكد** من عمل الروابط بشكل صحيح

### مثال للاستبدال:

```tsx
// قبل
<EditingToolsSection />
<SubscriptionsSection />

// بعد
<SectionsReplace />
```

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:

1. **الصور لا تظهر:**
   - تأكد من وجود الصور في `public/images/collections/`
   - تحقق من مسارات الصور في `collections-sections.js`

2. **الأزرار لا تعمل:**
   - تأكد من تكامل `AppContext`
   - تحقق من وجود `showToast` function

3. **التخطيط مكسور:**
   - تأكد من وجود Tailwind CSS
   - تحقق من الستايلات المخصصة في `globals.css`

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من console للأخطاء
2. تأكد من تطابق البيانات مع الهيكل المطلوب
3. اختبر المكونات بشكل منفصل
4. راجع الاختبارات للأمثلة

## 🔮 التطوير المستقبلي

### ميزات مقترحة:
- إضافة المزيد من تأثيرات الانتقال
- دعم الفيديو في البانرات
- تكامل مع نظام التوصيات
- إضافة المزيد من أنواع البطاقات
- دعم الوضع المظلم/الفاتح

---

**ملاحظة:** هذه المكونات مصممة لتكون مرنة وقابلة للتخصيص. يمكنك تعديلها حسب احتياجاتك الخاصة.
