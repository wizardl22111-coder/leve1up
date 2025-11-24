# مجلد صور المنتجات 📸

هذا المجلد يحتوي على جميع صور المنتجات المعروضة في الموقع.

## 📋 كيفية إضافة صور منتجات جديدة

### الخطوة 1: رفع الصورة
ضع ملف الصورة في هذا المجلد:
```
public/images/products/
```

### الخطوة 2: تسمية الملف
استخدم اسم ملف بالإنجليزية بدون مسافات (استخدم الشرطة `-` بدلاً من المسافات):
```
✅ صحيح: chatgpt-subscription.jpg
❌ خطأ: اشتراك ChatGPT.jpg
```

### الخطوة 3: تحديث ملف المنتجات
افتح ملف `data/products.json` وأضف/عدّل معلومات المنتج:

```json
{
  "product_id": 11,
  "product_name": "اسم المنتج بالعربية",
  "product_name_en": "Product Name in English",
  "product_image": "/images/products/your-image-name.jpg",
  "description": "وصف المنتج...",
  "price": 99,
  "originalPrice": 199,
  "currency": "SAR",
  "download_url": "رابط التحميل",
  "filename": "filename.pdf",
  "file_size_mb": 5,
  "category": "ebooks",
  "tags": ["تاغ1", "تاغ2"],
  "active": true,
  "rating": 4.5,
  "buyers": "عدد مرات الشراء: 0",
  "featured": false,
  "isFree": false,
  "purchases": 0,
  "reviews": 0
}
```

## 🖼️ متطلبات الصور

### الأبعاد المثالية
- **العرض × الارتفاع**: 800×600 بكسل أو نسبة 4:3
- **الحد الأدنى**: 400×300 بكسل
- **الحد الأقصى**: 2000×1500 بكسل

### الحجم
- يفضل أن يكون حجم الملف أقل من 500KB
- استخدم ضغط الصور للحصول على أفضل أداء

### التنسيقات المدعومة
- ✅ `.jpg` / `.jpeg` (مفضل للصور)
- ✅ `.png` (مفضل للشعارات والرسومات)
- ✅ `.webp` (للأداء الأفضل)

## 📝 أمثلة على أسماء الملفات

```
digital-products-guide.jpg
chatgpt-plus-subscription.png
video-editing-pack.jpg
animated-icons-bundle.png
netflix-premium.jpg
```

## 🔍 التحقق من الصور

بعد إضافة صورة جديدة، تأكد من:
1. ✅ الصورة موجودة في `public/images/products/`
2. ✅ اسم الملف صحيح ومطابق في `products.json`
3. ✅ المسار في `products.json` يبدأ بـ `/images/products/`
4. ✅ الصورة تظهر في الموقع بشكل صحيح

## 📂 هيكل المجلدات

```
public/
└── images/
    ├── products/          ← صور المنتجات (أنت هنا)
    │   ├── product1.jpg
    │   ├── product2.png
    │   └── README.md
    └── services/          ← صور الخدمات والأقسام
        ├── banner.jpg
        └── ...
```

## 💡 نصائح

1. **استخدم أسماء واضحة**: اختر أسماء تصف المنتج بوضوح
2. **تحسين الصور**: اضغط الصور قبل رفعها لتحسين السرعة
3. **النسخ الاحتياطي**: احتفظ بنسخة من الصور الأصلية
4. **الاتساق**: حافظ على نفس نمط التسمية لجميع الصور

---

**ملاحظة**: هذا المجلد محمي في `.gitignore` إذا كان حجم الصور كبير جداً.

