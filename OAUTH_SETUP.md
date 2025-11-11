# دليل إعداد OAuth (Google & Apple)

## 🔧 إعداد Google OAuth

### 1. إنشاء مشروع في Google Cloud Console

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google+ API من قسم APIs & Services

### 2. إنشاء OAuth 2.0 Client ID

1. اذهب إلى **APIs & Services** > **Credentials**
2. اضغط على **Create Credentials** > **OAuth 2.0 Client ID**
3. اختر **Web application**
4. أضف هذه المعلومات:
   - **Name**: Level Up Store
   - **Authorized JavaScript origins**: 
     - `https://leve1up.store`
     - `http://localhost:3000` (للتطوير)
   - **Authorized redirect URIs**:
     - `https://leve1up.store/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (للتطوير)

### 3. تحديث متغيرات البيئة

في ملف `.env.local`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# تفعيل Google OAuth في الواجهة
NEXT_PUBLIC_GOOGLE_ENABLED=true
```

---

## 🍎 إعداد Apple OAuth

### 1. إعداد Apple Developer Account

1. اذهب إلى [Apple Developer Portal](https://developer.apple.com/)
2. سجل الدخول بحساب Apple Developer

### 2. إنشاء App ID

1. اذهب إلى **Certificates, Identifiers & Profiles**
2. اختر **Identifiers** > **App IDs**
3. أنشئ App ID جديد مع تفعيل **Sign In with Apple**

### 3. إنشاء Service ID

1. أنشئ **Services ID** جديد
2. فعّل **Sign In with Apple**
3. أضف Domain: `leve1up.store`
4. أضف Return URL: `https://leve1up.store/api/auth/callback/apple`

### 4. إنشاء Private Key

1. اذهب إلى **Keys**
2. أنشئ مفتاح جديد مع تفعيل **Sign In with Apple**
3. حمّل الملف `.p8`

### 5. تحديث متغيرات البيئة

```bash
# Apple OAuth
APPLE_ID=your-services-id
APPLE_SECRET=your-generated-jwt-secret

# تفعيل Apple OAuth في الواجهة
NEXT_PUBLIC_APPLE_ENABLED=true
```

---

## 🚀 تفعيل OAuth

بعد إعداد المتغيرات الصحيحة:

1. أعد تشغيل الخادم
2. ستظهر أزرار Google و Apple في صفحات التسجيل وتسجيل الدخول
3. اختبر التسجيل عبر الخدمات الخارجية

---

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ "redirect_uri_mismatch"**:
   - تأكد من أن redirect URI في Google Console يطابق الموقع تماماً

2. **خطأ "invalid_client"**:
   - تحقق من صحة GOOGLE_CLIENT_ID و GOOGLE_CLIENT_SECRET

3. **أزرار OAuth لا تظهر**:
   - تأكد من وجود NEXT_PUBLIC_GOOGLE_ENABLED=true في .env.local

### للاختبار المحلي:

```bash
# للتطوير المحلي
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_ENABLED=true
```

---

## 📝 ملاحظات مهمة

- **الأمان**: لا تشارك CLIENT_SECRET مع أحد
- **الإنتاج**: استخدم HTTPS دائماً في الإنتاج
- **التحديث**: قد تحتاج إلى إعادة تشغيل الخادم بعد تغيير متغيرات البيئة
- **الاختبار**: اختبر OAuth في بيئة التطوير أولاً

---

## 🔄 الحالة الحالية

- ✅ **التسجيل التقليدي**: يعمل بشكل مثالي
- ⏳ **Google OAuth**: جاهز للتفعيل (يحتاج إعداد المتغيرات)
- ⏳ **Apple OAuth**: جاهز للتفعيل (يحتاج إعداد المتغيرات)
- ✅ **حماية الصفحات**: تعمل بشكل مثالي
- ✅ **تسجيل الخروج**: يعمل بشكل مثالي

بمجرد إعداد المتغيرات الصحيحة، ستعمل جميع خدمات OAuth بشكل مثالي! 🎉

