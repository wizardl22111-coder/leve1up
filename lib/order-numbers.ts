import { getRedis } from './orders-store';

/**
 * 🔢 نظام إدارة أرقام الطلبات الفريدة لكل عميل
 * 
 * يوفر هذا الملف دوال لتوليد وإدارة أرقام طلبات فريدة لكل عميل.
 * كل عميل يحصل على سلسلة أرقام منفصلة تبدأ من 001 وتزداد تدريجياً.
 */

/**
 * توليد رقم طلب فريد لعميل معين
 * @param customerEmail البريد الإلكتروني للعميل
 * @returns رقم الطلب الفريد (مثل: user@example.com-001)
 */
export async function generateOrderNumber(customerEmail: string): Promise<string> {
  try {
    const redis = await getRedis();
    
    // مفتاح العداد الخاص بالعميل
    const counterKey = `customer:${customerEmail}:orderCount`;
    
    // زيادة العداد وإرجاع القيمة الجديدة
    const orderCount = await redis.incr(counterKey);
    
    // تنسيق رقم الطلب مع padding للأرقام
    const paddedNumber = orderCount.toString().padStart(3, '0');
    const orderNumber = `${customerEmail}-${paddedNumber}`;
    
    console.log(`🔢 Generated order number: ${orderNumber} for customer: ${customerEmail}`);
    
    return orderNumber;
  } catch (error) {
    console.error('❌ Error generating order number:', error);
    
    // fallback: استخدام timestamp كرقم طلب
    const timestamp = Date.now();
    const fallbackNumber = `${customerEmail}-${timestamp}`;
    console.log(`⚠️ Using fallback order number: ${fallbackNumber}`);
    
    return fallbackNumber;
  }
}

/**
 * الحصول على آخر رقم طلب تم إنشاؤه لعميل معين
 * @param customerEmail البريد الإلكتروني للعميل
 * @returns آخر رقم طلب أو null إذا لم يكن هناك طلبات
 */
export async function getLastOrderNumber(customerEmail: string): Promise<string | null> {
  try {
    const redis = await getRedis();
    
    // الحصول على العداد الحالي
    const counterKey = `customer:${customerEmail}:orderCount`;
    const orderCount = await redis.get(counterKey);
    
    if (!orderCount || orderCount === '0') {
      return null;
    }
    
    // تنسيق آخر رقم طلب
    const paddedNumber = orderCount.toString().padStart(3, '0');
    const orderNumber = `${customerEmail}-${paddedNumber}`;
    
    return orderNumber;
  } catch (error) {
    console.error('❌ Error getting last order number:', error);
    return null;
  }
}

/**
 * الحصول على عدد الطلبات الإجمالي لعميل معين
 * @param customerEmail البريد الإلكتروني للعميل
 * @returns عدد الطلبات
 */
export async function getCustomerOrderCount(customerEmail: string): Promise<number> {
  try {
    const redis = await getRedis();
    
    const counterKey = `customer:${customerEmail}:orderCount`;
    const orderCount = await redis.get(counterKey);
    
    return parseInt(orderCount || '0', 10);
  } catch (error) {
    console.error('❌ Error getting customer order count:', error);
    return 0;
  }
}

/**
 * ربط رقم الطلب بمعرف الطلب الداخلي في Redis
 * @param orderNumber رقم الطلب الفريد
 * @param orderId معرف الطلب الداخلي
 */
export async function linkOrderNumberToId(orderNumber: string, orderId: string): Promise<void> {
  try {
    const redis = await getRedis();
    
    // ربط رقم الطلب بمعرف الطلب
    const orderNumberKey = `orderNumber:${orderNumber}`;
    await redis.set(orderNumberKey, orderId);
    
    // ربط معرف الطلب برقم الطلب (للبحث العكسي)
    const orderIdKey = `order:${orderId}:number`;
    await redis.set(orderIdKey, orderNumber);
    
    console.log(`🔗 Linked order number ${orderNumber} to order ID ${orderId}`);
  } catch (error) {
    console.error('❌ Error linking order number to ID:', error);
  }
}

/**
 * الحصول على معرف الطلب من رقم الطلب
 * @param orderNumber رقم الطلب الفريد
 * @returns معرف الطلب الداخلي أو null
 */
export async function getOrderIdFromNumber(orderNumber: string): Promise<string | null> {
  try {
    const redis = await getRedis();
    
    const orderNumberKey = `orderNumber:${orderNumber}`;
    const orderId = await redis.get(orderNumberKey);
    
    return orderId;
  } catch (error) {
    console.error('❌ Error getting order ID from number:', error);
    return null;
  }
}

/**
 * الحصول على رقم الطلب من معرف الطلب
 * @param orderId معرف الطلب الداخلي
 * @returns رقم الطلب الفريد أو null
 */
export async function getOrderNumberFromId(orderId: string): Promise<string | null> {
  try {
    const redis = await getRedis();
    
    const orderIdKey = `order:${orderId}:number`;
    const orderNumber = await redis.get(orderIdKey);
    
    return orderNumber;
  } catch (error) {
    console.error('❌ Error getting order number from ID:', error);
    return null;
  }
}

/**
 * التحقق من صحة تنسيق رقم الطلب
 * @param orderNumber رقم الطلب للتحقق منه
 * @returns true إذا كان التنسيق صحيح
 */
export function validateOrderNumberFormat(orderNumber: string): boolean {
  // التنسيق المتوقع: email@domain.com-001
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+-\d{3,}$/;
  return pattern.test(orderNumber);
}

/**
 * استخراج البريد الإلكتروني من رقم الطلب
 * @param orderNumber رقم الطلب
 * @returns البريد الإلكتروني أو null
 */
export function extractEmailFromOrderNumber(orderNumber: string): string | null {
  if (!validateOrderNumberFormat(orderNumber)) {
    return null;
  }
  
  const lastDashIndex = orderNumber.lastIndexOf('-');
  if (lastDashIndex === -1) {
    return null;
  }
  
  return orderNumber.substring(0, lastDashIndex);
}

