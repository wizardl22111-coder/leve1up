# 🔧 حل مشكلة Google OAuth: "State cookie was missing"

## 🎯 **المشكلة:**
```
[next-auth][error][OAUTH_CALLBACK_ERROR] State cookie was missing.
```

## 🔍 **الأسباب المحتملة:**

### 1️⃣ **مشكلة في NEXTAUTH_URL**
- **المشكلة:** NEXTAUTH_URL لا يطابق الدومين الفعلي
- **الحل:** تأكد من أن `NEXTAUTH_URL=https://leve1up.store`

### 2️⃣ **مشكلة في Google OAuth Redirect URI**
- **المشكلة:** Redirect URI في Google Console لا يطابق NextAuth
- **الحل:** تأكد من أن Redirect URI هو: `https://leve1up.store/api/auth/callback/google`

### 3️⃣ **مشكلة في Cookies Settings**
- **المشكلة:** إعدادات cookies غير متوافقة مع الدومين
- **الحل:** تم إضافة إعدادات cookies محسنة في `auth-options.ts`

## ✅ **الحلول المطبقة:**

### 🔧 **1. إعدادات Cookies محسنة:**
```typescript
cookies: {
  state: {
    name: `next-auth.state`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 900, // 15 minutes
      domain: process.env.NODE_ENV === 'production' ? '.leve1up.store' : undefined
    }
  },
  // ... باقي الـ cookies
}
```

### 🔧 **2. Google Provider محسن:**
```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code"
    }
  }
})
```

## 📋 **المتغيرات البيئية المطلوبة:**

### **في Vercel Environment Variables:**
```bash
# NextAuth Settings
NEXTAUTH_URL=https://leve1up.store
NEXTAUTH_SECRET=your-32-character-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Redis (للمستخدمين)
KV_REST_API_URL=your-redis-url
KV_REST_API_TOKEN=your-redis-token
```

## 🔧 **إعدادات Google Cloud Console:**

### **1. OAuth 2.0 Client IDs:**
- **Application type:** Web application
- **Name:** Leve1Up Store
- **Authorized JavaScript origins:**
  - `https://leve1up.store`
- **Authorized redirect URIs:**
  - `https://leve1up.store/api/auth/callback/google`

### **2. OAuth consent screen:**
- **User Type:** External
- **App name:** Leve1Up Store
- **User support email:** support@leve1up.store
- **App domain:** leve1up.store
- **Authorized domains:** leve1up.store
- **Developer contact:** support@leve1up.store

## 🚨 **نقاط مهمة للتحقق:**

### ✅ **1. Domain Matching:**
```bash
# تأكد من أن جميع هذه تطابق:
- NEXTAUTH_URL: https://leve1up.store
- Google Redirect URI: https://leve1up.store/api/auth/callback/google
- Vercel Domain: leve1up.store
- Cookie Domain: .leve1up.store
```

### ✅ **2. HTTPS في Production:**
```bash
# تأكد من:
- الموقع يعمل على HTTPS
- لا توجد mixed content warnings
- SSL certificate صالح
```

### ✅ **3. Cookie Settings:**
```bash
# تأكد من:
- SameSite: 'lax' (ليس 'strict')
- Secure: true في production
- Domain: '.leve1up.store' في production
- MaxAge: 900 seconds للـ state cookie
```

## 🔍 **خطوات التشخيص:**

### **1. فحص المتغيرات البيئية:**
```bash
# في Vercel Dashboard > Settings > Environment Variables
# تأكد من وجود جميع المتغيرات المطلوبة
```

### **2. فحص Google Console:**
```bash
# في Google Cloud Console > APIs & Services > Credentials
# تأكد من صحة Redirect URIs
```

### **3. فحص Cookies في المتصفح:**
```bash
# في Developer Tools > Application > Cookies
# ابحث عن: next-auth.state
# تأكد من وجوده قبل OAuth redirect
```

### **4. فحص Network Tab:**
```bash
# في Developer Tools > Network
# ابحث عن requests إلى /api/auth/signin/google
# تأكد من عدم وجود 4xx/5xx errors
```

## 🎯 **الخطوات التالية:**

### **1. تحديث Vercel Environment Variables:**
```bash
NEXTAUTH_URL=https://leve1up.store
NEXTAUTH_SECRET=generate-a-32-character-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **2. تحديث Google OAuth Settings:**
- Redirect URI: `https://leve1up.store/api/auth/callback/google`
- Authorized origins: `https://leve1up.store`

### **3. إعادة نشر التطبيق:**
```bash
# بعد تحديث المتغيرات البيئية
# أعد نشر التطبيق في Vercel
```

### **4. اختبار OAuth:**
```bash
# اذهب إلى: https://leve1up.store/login
# اضغط على "تسجيل الدخول بـ Google"
# تأكد من عدم ظهور خطأ State cookie
```

## 📞 **إذا استمرت المشكلة:**

### **تحقق من:**
1. **Vercel Logs:** ابحث عن أخطاء في الـ logs
2. **Browser Console:** ابحث عن JavaScript errors
3. **Network Requests:** تأكد من نجاح جميع الـ requests
4. **Cookie Storage:** تأكد من حفظ الـ cookies بشكل صحيح

### **أخطاء شائعة:**
- ❌ NEXTAUTH_URL مختلف عن الدومين الفعلي
- ❌ Google Redirect URI خاطئ
- ❌ NEXTAUTH_SECRET غير موجود أو قصير
- ❌ Cookies محجوبة بواسطة browser settings
- ❌ Mixed content (HTTP/HTTPS) issues

## 🎉 **بعد الحل:**
عندما يعمل OAuth بشكل صحيح، ستحصل على:
- ✅ تسجيل دخول سلس عبر Google
- ✅ إنشاء حساب تلقائي للمستخدمين الجدد
- ✅ حفظ معلومات المستخدم في Redis
- ✅ جلسة آمنة ومستقرة
