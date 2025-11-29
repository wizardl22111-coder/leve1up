# مجلد صور المنتجات

هذا المجلد مخصص لحفظ صور المنتجات في موقع لفل اب.

## هيكل المجلد:

```
public/images/products/
├── subscriptions/          # صور الاشتراكات (Netflix, Spotify, etc.)
├── editing-tools/          # صور أدوات المونتاج
├── gaming/                 # صور الألعاب
├── software/               # صور البرامج
└── other/                  # صور أخرى
```

## إرشادات الصور:

### أحجام الصور المطلوبة:
- **صورة المنتج الرئيسية**: 400x400 بكسل (مربعة)
- **صورة المعاينة**: 300x200 بكسل (مستطيلة)
- **أيقونة المنتج**: 64x64 بكسل (مربعة)

### تنسيقات الصور المدعومة:
- PNG (مفضل للشفافية)
- JPG/JPEG (للصور العادية)
- WebP (للأداء الأفضل)

### تسمية الملفات:
- استخدم أسماء وصفية باللغة الإنجليزية
- مثال: `netflix-premium.png`, `photoshop-2024.jpg`
- تجنب المسافات، استخدم الشرطة (-) بدلاً منها

### أمثلة على أسماء الملفات:
```
subscriptions/
├── netflix-basic.png
├── netflix-premium.png
├── spotify-premium.png
└── youtube-premium.png

editing-tools/
├── photoshop-cc.png
├── after-effects.png
├── premiere-pro.png
└── illustrator.png
```

## كيفية استخدام الصور في الكود:

```javascript
// في ملف المنتج
{
  "product_id": 1,
  "name": "Netflix Premium",
  "image": "/images/products/subscriptions/netflix-premium.png",
  "thumbnail": "/images/products/subscriptions/netflix-premium-thumb.png"
}
```

## ملاحظات مهمة:

1. **الأداء**: استخدم صور محسّنة لتحسين سرعة التحميل
2. **الجودة**: تأكد من وضوح الصور على جميع الأحجام
3. **الحقوق**: استخدم فقط الصور التي لديك حق استخدامها
4. **التنظيم**: احتفظ بالصور منظمة في المجلدات المناسبة

## أدوات مفيدة لتحسين الصور:

- **TinyPNG**: لضغط صور PNG
- **ImageOptim**: لتحسين جودة الصور
- **Squoosh**: أداة Google لضغط الصور
- **Photoshop**: للتعديل المتقدم

---

تم إنشاء هذا المجلد بواسطة Codegen 🤖

