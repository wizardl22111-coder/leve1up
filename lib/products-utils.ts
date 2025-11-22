/**
 * 🛍️ دوال مساعدة للمنتجات وروابط التحميل
 */

import productsData from '@/data/products.json';

// واجهة المنتج
interface Product {
  product_id: number;
  product_name: string;
  product_name_en: string;
  download_url?: string; // اختياري للاشتراكات
  filename?: string; // اختياري للاشتراكات
  price: number;
  currency: string;
  active: boolean;
  category: string;
  tags: string[];
  rating: number;
  buyers: string;
  featured: boolean;
  isFree?: boolean;
  originalPrice?: number;
  description: string;
  product_image?: string;
  file_size_mb?: number;
  sections?: any;
  subscription_plans?: any[];
}

/**
 * جلب جميع المنتجات النشطة
 * @returns قائمة المنتجات النشطة
 */
export function getActiveProducts(): Product[] {
  return productsData.filter((product: any) => product.active === true);
}

/**
 * جلب منتج بالاسم
 * @param productName اسم المنتج
 * @returns المنتج أو null
 */
export function getProductByName(productName: string): Product | null {
  const product = productsData.find((p: any) => 
    p.product_name === productName || 
    p.product_name_en === productName
  );
  
  return product || null;
}

/**
 * جلب رابط التحميل الفعلي للمنتج
 * @param productName اسم المنتج
 * @returns رابط التحميل أو null
 */
export function getProductDownloadUrl(productName: string): string | null {
  const product = getProductByName(productName);
  // للاشتراكات، لا يوجد رابط تحميل
  if (product?.category === 'subscriptions') {
    return null;
  }
  return product?.download_url || null;
}

/**
 * إنشاء قاعدة بيانات الملفات المسموحة من ملف المنتجات
 * @returns قاعدة بيانات الملفات
 */
export function generateAllowedFilesFromProducts(): Record<string, string> {
  const allowedFiles: Record<string, string> = {};
  
  const activeProducts = getActiveProducts();
  
  activeProducts.forEach(product => {
    // تجاهل الباقات لأنها لا تحتوي على ملفات للتحميل
    if (product.category === 'subscriptions' || !product.download_url) {
      return;
    }
    
    // تحويل اسم المنتج إلى key آمن
    const safeKey = product.product_name
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '');
    
    allowedFiles[safeKey] = product.download_url;
    
    console.log(`✅ Added file mapping: "${product.product_name}" -> "${safeKey}"`);
  });
  
  return allowedFiles;
}

/**
 * إنشاء قاعدة بيانات تطابق أسماء المنتجات مع المفاتيح الآمنة
 * @returns قاعدة بيانات التطابق
 */
export function generateFileNameMappings(): Record<string, string> {
  const mappings: Record<string, string> = {};
  
  const activeProducts = getActiveProducts();
  
  activeProducts.forEach(product => {
    // تحويل اسم المنتج إلى key آمن
    const safeKey = product.product_name
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '');
    
    mappings[product.product_name] = safeKey;
    
    // إضافة الاسم الإنجليزي أيضاً إذا وجد
    if (product.product_name_en) {
      const englishSafeKey = product.product_name_en
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .toLowerCase();
      mappings[product.product_name_en] = safeKey;
    }
  });
  
  return mappings;
}

/**
 * التحقق من وجود منتج وإرجاع معلوماته
 * @param productName اسم المنتج
 * @returns معلومات المنتج أو null
 */
export function validateProduct(productName: string): {
  exists: boolean;
  product?: Product;
  downloadUrl?: string;
  safeKey?: string;
} {
  const product = getProductByName(productName);
  
  if (!product) {
    return { exists: false };
  }
  
  const safeKey = product.product_name
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '');
  
  return {
    exists: true,
    product,
    downloadUrl: product.download_url || undefined,
    safeKey
  };
}

/**
 * طباعة جميع المنتجات وروابطها للتشخيص
 */
export function debugProducts(): void {
  console.log('🔍 Debug: جميع المنتجات النشطة:');
  
  const activeProducts = getActiveProducts();
  
  activeProducts.forEach((product, index) => {
    const safeKey = product.product_name
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '');
    
    console.log(`${index + 1}. المنتج: "${product.product_name}"`);
    console.log(`   المفتاح الآمن: "${safeKey}"`);
    console.log(`   رابط التحميل: "${product.download_url || 'لا يوجد (اشتراك)'}"`);
    console.log(`   السعر: ${product.price} ${product.currency}`);
    console.log(`   الفئة: ${product.category}`);
    console.log('---');
  });
  
  console.log('🔍 Debug: قاعدة بيانات التطابق:');
  const mappings = generateFileNameMappings();
  Object.entries(mappings).forEach(([name, key]) => {
    console.log(`"${name}" -> "${key}"`);
  });
  
  console.log('🔍 Debug: قاعدة بيانات الملفات المسموحة:');
  const allowedFiles = generateAllowedFilesFromProducts();
  Object.entries(allowedFiles).forEach(([key, url]) => {
    console.log(`"${key}" -> "${url}"`);
  });
}
