# 📸 مجلد الصور الجديدة للمنتجات

هذا المجلد مخصص لإضافة صور المنتجات الجديدة في متجر Leve1Up.

## 📋 إرشادات إضافة الصور

### 🎯 **متطلبات الصور:**
- **الأبعاد المفضلة**: 800x600 بكسل أو أكبر
- **نسبة العرض إلى الارتفاع**: 4:3 أو 16:9
- **الصيغ المدعومة**: JPG, PNG, WebP
- **حجم الملف**: أقل من 2 ميجابايت
- **الجودة**: عالية ووضوح جيد

### 📁 **تسمية الملفات:**
استخدم أسماء واضحة ومفهومة باللغة الإنجليزية:
```
product-name-description.jpg
```

**أمثلة:**
- `discord-nitro-subscription.png`
- `chatgpt-premium-account.jpg`
- `netflix-family-plan.jpg`
- `gaming-tools-pack.png`

### 🔄 **خطوات إضافة صورة جديدة:**

1. **رفع الصورة**: ضع الصورة في هذا المجلد
2. **تحديث البيانات**: أضف مسار الصورة في `data/products.json`
3. **التحقق**: تأكد من ظهور الصورة في الموقع

### 📝 **مثال على إضافة منتج جديد:**

```json
{
  "product_id": 999,
  "product_name": "اشتراك Discord Nitro",
  "product_image": "/images/products/new/discord-nitro-subscription.png",
  "description": "اشتراك Discord Nitro لمدة سنة كاملة...",
  "price": 150,
  "currency": "SAR"
}
```

## 🎨 **أفضل الممارسات:**

### ✅ **افعل:**
- استخدم صور عالية الجودة
- تأكد من وضوح النص في الصورة
- استخدم ألوان جذابة ومتناسقة
- اجعل الصورة تعبر عن المنتج بوضوح

### ❌ **لا تفعل:**
- لا تستخدم صور مشوشة أو منخفضة الجودة
- لا تستخدم صور محمية بحقوق الطبع والنشر
- لا تجعل الصورة كبيرة جداً (أكثر من 2MB)
- لا تستخدم أسماء ملفات بالعربية

## 🛠️ **أدوات مفيدة:**

### **لتحسين الصور:**
- [TinyPNG](https://tinypng.com/) - ضغط الصور
- [Canva](https://canva.com/) - تصميم الصور
- [Remove.bg](https://remove.bg/) - إزالة الخلفية

### **للحصول على صور مجانية:**
- [Unsplash](https://unsplash.com/)
- [Pexels](https://pexels.com/)
- [Freepik](https://freepik.com/)

## 📊 **حالة الصور الحالية:**

### ✅ **الصور الموجودة:**
- `introductory-guide.png` ✅
- `digital-products-profit.jpg` ✅
- `15-project-ideas.jpg` ✅
- `ultimate-video-editing-pack.png` ✅
- `animated-icons-pack.png` ✅
- `design-content-pack.png` ✅
- `chatgpt5-subscription.jpg` ✅
- `gemini-pro-subscription.jpg` ✅
- `canva-subscription.jpg` ✅
- `netflix-subscription.jpg` ✅
- `discord-nitro-1year.png` ✅
- `discord-nitro-3months.png` ✅

### 🔍 **للتحقق من الصور:**
يمكنك استخدام مكون `ImageTest` في الموقع لفحص حالة جميع الصور:
```
/image-test
```

## 🚀 **نصائح للأداء:**

1. **استخدم WebP**: صيغة حديثة وأصغر حجماً
2. **ضغط الصور**: قلل حجم الملف دون فقدان الجودة
3. **استخدم CDN**: لتسريع تحميل الصور
4. **Lazy Loading**: تحميل الصور عند الحاجة فقط

---

**💡 نصيحة**: احرص على تجربة الصور على أجهزة مختلفة (موبايل، تابلت، ديسكتوب) للتأكد من ظهورها بشكل مثالي.

**📞 الدعم**: إذا واجهت أي مشكلة في إضافة الصور، تواصل مع فريق التطوير.
