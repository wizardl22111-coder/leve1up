/**
 * 🔗 دوال مساعدة لإنشاء روابط التحميل الآمنة
 */

// قاعدة بيانات الملفات (يجب أن تتطابق مع app/api/download/route.ts)
const FILE_MAPPINGS: Record<string, string> = {
  'الربح من المنتجات الرقمية': 'الربح-من-المنتجات-الرقمية',
  'دليل التسويق الرقمي': 'دليل-التسويق-الرقمي',
  'استراتيجيات البيع اونلاين': 'استراتيجيات-البيع-اونلاين',
};

/**
 * إنشاء رابط تحميل آمن عبر النطاق
 * @param fileName اسم الملف الأصلي
 * @param baseUrl النطاق الأساسي (افتراضي: leve1up.store)
 * @returns رابط التحميل الآمن
 */
export function createSecureDownloadUrl(
  fileName: string, 
  baseUrl: string = 'https://leve1up.store'
): string {
  // البحث عن المفتاح المطابق
  const fileKey = FILE_MAPPINGS[fileName];
  
  if (!fileKey) {
    console.warn(`⚠️ No mapping found for file: ${fileName}`);
    // fallback: تحويل الاسم إلى key آمن
    const fallbackKey = fileName
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '')
      .toLowerCase();
    return `${baseUrl}/api/download?file=${encodeURIComponent(fallbackKey)}`;
  }
  
  return `${baseUrl}/api/download?file=${encodeURIComponent(fileKey)}`;
}

/**
 * إضافة ملف جديد إلى قاعدة البيانات
 * @param originalName الاسم الأصلي للملف
 * @param safeKey المفتاح الآمن
 */
export function addFileMapping(originalName: string, safeKey: string): void {
  FILE_MAPPINGS[originalName] = safeKey;
  console.log(`✅ Added file mapping: "${originalName}" -> "${safeKey}"`);
}

/**
 * الحصول على جميع الملفات المتاحة
 * @returns قائمة بأسماء الملفات المتاحة
 */
export function getAvailableFiles(): string[] {
  return Object.keys(FILE_MAPPINGS);
}

/**
 * التحقق من وجود ملف
 * @param fileName اسم الملف
 * @returns true إذا كان الملف موجود
 */
export function isFileAvailable(fileName: string): boolean {
  return fileName in FILE_MAPPINGS;
}

/**
 * إنشاء رابط تحميل مع token للحماية الإضافية
 * @param fileName اسم الملف
 * @param orderId رقم الطلب (اختياري)
 * @param baseUrl النطاق الأساسي
 * @returns رابط التحميل مع token
 */
export function createSecureDownloadUrlWithToken(
  fileName: string,
  orderId?: string,
  baseUrl: string = 'https://leve1up.store'
): string {
  const baseDownloadUrl = createSecureDownloadUrl(fileName, baseUrl);
  
  if (orderId) {
    const separator = baseDownloadUrl.includes('?') ? '&' : '?';
    return `${baseDownloadUrl}${separator}orderId=${encodeURIComponent(orderId)}`;
  }
  
  return baseDownloadUrl;
}

/**
 * تحويل رابط Vercel Blob إلى رابط آمن
 * @param blobUrl رابط Vercel Blob الأصلي
 * @param fileName اسم الملف (اختياري)
 * @param baseUrl النطاق الأساسي
 * @returns رابط التحميل الآمن
 */
export function convertBlobUrlToSecure(
  blobUrl: string,
  fileName?: string,
  baseUrl: string = 'https://leve1up.store'
): string {
  if (fileName) {
    return createSecureDownloadUrl(fileName, baseUrl);
  }
  
  // fallback: استخدام الرابط القديم مع proxy
  return `${baseUrl}/api/download?url=${encodeURIComponent(blobUrl)}`;
}
