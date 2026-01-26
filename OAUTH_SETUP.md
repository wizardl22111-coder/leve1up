# دليل إعداد OAuth (Google & Apple) مع Vercel

## 🚀 إعداد متغيرات البيئة في Vercel

### الطريقة الأولى: عبر Vercel Dashboard

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع `leve1up`
3. اذهب إلى **Settings** > **Environment Variables**
4. أضف المتغيرات التالية:

### الطريقة الثانية: عبر Vercel CLI

```bash
# تسجيل الدخول إلى Vercel
vercel login

# إضافة متغيرات البيئة
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXT_PUBLIC_GOOGLE_ENABLED
```

---

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
     - `https://leve1up.vercel.app` (إذا كان لديك نطاق Vercel)
   - **Authorized redirect URIs**:
     - `https://leve1up.store/api/auth/callback/google`
     - `https://leve1up.vercel.app/api/auth/callback/google`

### 3. إضافة متغيرات البيئة في Vercel

في **Vercel Dashboard** > **Settings** > **Environment Variables**:

| المتغير | القيمة | البيئة |
|---------|--------|--------|
| `GOOGLE_CLIENT_ID` | `your-actual-client-id.apps.googleusercontent.com` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `your-actual-client-secret` | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_ENABLED` | `true` | Production, Preview, Development |

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

### 5. إضافة متغيرات البيئة في Vercel

في **Vercel Dashboard** > **Settings** > **Environment Variables**:

| المتغير | القيمة | البيئة |
|---------|--------|--------|
| `APPLE_ID` | `your-services-id` | Production, Preview, Development |
| `APPLE_SECRET` | `your-generated-jwt-secret` | Production, Preview, Development |
| `NEXT_PUBLIC_APPLE_ENABLED` | `true` | Production, Preview, Development |

---

## 🚀 تفعيل OAuth في Vercel

### خطوات التفعيل:

1. **إضافة المتغيرات في Vercel Dashboard**
2. **إعادة نشر المشروع** (Redeploy)
   ```bash
   vercel --prod
   ```
3. **ستظهر أزرار OAuth تلقائياً** في صفحات التسجيل وتسجيل الدخول
4. **اختبار التسجيل** عبر الخدمات الخارجية

### المتغيرات المطلوبة في Vercel:

| المتغير | الوصف | مطلوب |
|---------|--------|--------|
| `NEXTAUTH_URL` | `https://leve1up.store` | ✅ |
| `NEXTAUTH_SECRET` | مفتاح سري قوي | ✅ |
| `GOOGLE_CLIENT_ID` | من Google Cloud Console | للـ Google OAuth |
| `GOOGLE_CLIENT_SECRET` | من Google Cloud Console | للـ Google OAuth |
| `NEXT_PUBLIC_GOOGLE_ENABLED` | `true` | لإظهار زر Google |
| `APPLE_ID` | من Apple Developer | للـ Apple OAuth |
| `APPLE_SECRET` | من Apple Developer | للـ Apple OAuth |
| `NEXT_PUBLIC_APPLE_ENABLED` | `true` | لإظهار زر Apple |

---

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ "redirect_uri_mismatch"**:
   - تأكد من أن redirect URI في Google Console يطابق الموقع تماماً
   - استخدم `https://leve1up.store/api/auth/callback/google`

2. **خطأ "invalid_client"**:
   - تحقق من صحة GOOGLE_CLIENT_ID و GOOGLE_CLIENT_SECRET في Vercel
   - تأكد من إعادة النشر بعد إضافة المتغيرات

3. **أزرار OAuth لا تظهر**:
   - تأكد من وجود `NEXT_PUBLIC_GOOGLE_ENABLED=true` في Vercel
   - تحقق من أن المتغير مضاف لجميع البيئات (Production, Preview, Development)

4. **المتغيرات لا تعمل**:
   - أعد نشر المشروع بعد إضافة المتغيرات
   - تحقق من أن المتغيرات مضافة للبيئة الصحيحة

### للتطوير المحلي:

إنشاء ملف `.env.local` للتطوير المحلي:

```bash
# للتطوير المحلي فقط
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_ENABLED=true
```

---

## ⚡ إعداد سريع للمتغيرات الأساسية

### المتغيرات المطلوبة فوراً في Vercel:

```bash
# المتغيرات الأساسية (مطلوبة)
NEXTAUTH_URL=https://leve1up.store
NEXTAUTH_SECRET=your-super-secret-key-here-32-characters-minimum

# متغيرات Redis/KV (إذا كانت متاحة)
KV_REST_API_URL=your-upstash-redis-url
KV_REST_API_TOKEN=your-upstash-redis-token

# تفعيل OAuth (اختياري - أضف عند الحاجة)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# NEXT_PUBLIC_GOOGLE_ENABLED=true
```

### خطوات الإعداد السريع:

1. **اذهب إلى Vercel Dashboard**
2. **اختر مشروع leve1up**
3. **Settings > Environment Variables**
4. **أضف المتغيرات الأساسية أولاً**
5. **أعد النشر**: `vercel --prod`

---

## 📝 ملاحظات مهمة

- **الأمان**: لا تشارك CLIENT_SECRET مع أحد
- **Vercel**: استخدم Vercel Environment Variables بدلاً من .env.local للإنتاج
- **إعادة النشر**: يجب إعادة نشر المشروع بعد إضافة متغيرات جديدة
- **البيئات**: أضف المتغيرات لجميع البيئات (Production, Preview, Development)

---

## 🔄 الحالة الحالية

- ✅ **التسجيل التقليدي**: يعمل بشكل مثالي
- ⏳ **Google OAuth**: جاهز للتفعيل (يحتاج إعداد المتغيرات)
- ⏳ **Apple OAuth**: جاهز للتفعيل (يحتاج إعداد المتغيرات)
- ✅ **حماية الصفحات**: تعمل بشكل مثالي
- ✅ **تسجيل الخروج**: يعمل بشكل مثالي

بمجرد إعداد المتغيرات الصحيحة، ستعمل جميع خدمات OAuth بشكل مثالي! 🎉
