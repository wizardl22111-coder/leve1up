// نظام أكواد الخصم والحسابات المتقدمة
import { Currency } from './currency';

// أنواع فئات المنتجات
export type ProductCategory = 'subscriptions' | 'games' | 'editing_tools' | 'premium_products';

// واجهة كود الخصم
export interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  description: string;
  createdAt: string;
}

// واجهة المنتج مع الفئة
export interface ProductWithCategory {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: ProductCategory;
  image: string;
}

// واجهة حسابات الخصم والضرائب
export interface AdvancedCalculation {
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  discountAppliedTotal: number;
  taxableAmount: number; // المبلغ الخاضع للضريبة
  taxAmount: number;
  finalTotal: number;
  currency: Currency;
  appliedDiscountCode?: string;
}

// واجهة استجابة API للتحقق من كود الخصم
export interface DiscountValidationResponse {
  valid: boolean;
  discountPercent: number;
  message: string;
  code?: string;
}

// قاعدة بيانات أكواد الخصم (مثال)
export const discountCodes: DiscountCode[] = [
  {
    id: '1',
    code: 'WELCOME10',
    discountPercent: 10,
    isActive: true,
    usageLimit: 100,
    usedCount: 25,
    description: 'خصم ترحيبي للعملاء الجدد',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    code: 'SAVE15',
    discountPercent: 15,
    isActive: true,
    usageLimit: 50,
    usedCount: 12,
    description: 'خصم خاص لفترة محدودة',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    code: 'PREMIUM20',
    discountPercent: 20,
    isActive: true,
    usageLimit: 25,
    usedCount: 8,
    description: 'خصم حصري للعملاء المميزين',
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    code: 'EXPIRED50',
    discountPercent: 50,
    isActive: false,
    expiryDate: '2024-01-31',
    usageLimit: 10,
    usedCount: 10,
    description: 'كود منتهي الصلاحية',
    createdAt: '2024-01-01'
  }
];

// الفئات الخاضعة للضريبة (5%)
export const taxableCategories: ProductCategory[] = ['subscriptions', 'games'];

// معدل الضريبة للفئات الخاضعة للضريبة
export const TAX_RATE = 0.05; // 5%

// التحقق من صحة كود الخصم
export function validateDiscountCode(code: string): DiscountValidationResponse {
  const discountCode = discountCodes.find(
    dc => dc.code.toLowerCase() === code.toLowerCase() && dc.isActive
  );

  if (!discountCode) {
    return {
      valid: false,
      discountPercent: 0,
      message: 'كود الخصم غير صحيح أو منتهي الصلاحية'
    };
  }

  // التحقق من حد الاستخدام
  if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
    return {
      valid: false,
      discountPercent: 0,
      message: 'تم استنفاد عدد مرات استخدام هذا الكود'
    };
  }

  // التحقق من تاريخ الانتهاء
  if (discountCode.expiryDate && new Date() > new Date(discountCode.expiryDate)) {
    return {
      valid: false,
      discountPercent: 0,
      message: 'انتهت صلاحية كود الخصم'
    };
  }

  return {
    valid: true,
    discountPercent: discountCode.discountPercent,
    message: `تم تطبيق خصم ${discountCode.discountPercent}% بنجاح!`,
    code: discountCode.code
  };
}

// التحقق من كون المنتج خاضع للضريبة
export function isProductTaxable(category: ProductCategory): boolean {
  return taxableCategories.includes(category);
}

// حساب الضرائب والخصومات المتقدم
export function calculateAdvancedPricing(
  products: ProductWithCategory[],
  currency: Currency,
  discountPercent: number = 0,
  appliedDiscountCode?: string
): AdvancedCalculation {
  // حساب المجموع الفرعي
  const subtotal = products.reduce((sum, product) => {
    return sum + (product.price * product.quantity);
  }, 0);

  // حساب مبلغ الخصم
  const discountAmount = subtotal * (discountPercent / 100);
  
  // المجموع بعد تطبيق الخصم
  const discountAppliedTotal = subtotal - discountAmount;

  // حساب المبلغ الخاضع للضريبة (فقط المنتجات من الفئات الخاضعة للضريبة)
  const taxableAmount = products.reduce((sum, product) => {
    if (isProductTaxable(product.category)) {
      const productTotal = product.price * product.quantity;
      // تطبيق الخصم على المنتج الخاضع للضريبة
      const productAfterDiscount = productTotal * (1 - discountPercent / 100);
      return sum + productAfterDiscount;
    }
    return sum;
  }, 0);

  // حساب مبلغ الضريبة (5% على المنتجات الخاضعة للضريبة فقط)
  const taxAmount = taxableAmount * TAX_RATE;

  // المجموع النهائي
  const finalTotal = discountAppliedTotal + taxAmount;

  return {
    subtotal,
    discountAmount,
    discountPercent,
    discountAppliedTotal,
    taxableAmount,
    taxAmount,
    finalTotal,
    currency,
    appliedDiscountCode
  };
}

// تنسيق عرض الحسابات المتقدمة
export function formatAdvancedCalculation(calculation: AdvancedCalculation): {
  subtotalText: string;
  discountText: string;
  taxText: string;
  finalTotalText: string;
} {
  const { subtotal, discountAmount, taxAmount, finalTotal } = calculation;
  
  return {
    subtotalText: `${subtotal.toFixed(2)}`,
    discountText: discountAmount > 0 ? `-${discountAmount.toFixed(2)}` : '0.00',
    taxText: `${taxAmount.toFixed(2)}`,
    finalTotalText: `${finalTotal.toFixed(2)}`
  };
}

// الحصول على وصف الضريبة
export function getTaxDescription(products: ProductWithCategory[]): string {
  const taxableProducts = products.filter(p => isProductTaxable(p.category));
  
  if (taxableProducts.length === 0) {
    return 'لا توجد ضرائب مطبقة على هذه المنتجات';
  }
  
  const taxableCategories = [...new Set(taxableProducts.map(p => p.category))];
  const categoryNames = taxableCategories.map(cat => {
    switch (cat) {
      case 'subscriptions': return 'الاشتراكات';
      case 'games': return 'الألعاب';
      default: return cat;
    }
  });
  
  return `ضريبة 5% مطبقة على: ${categoryNames.join('، ')}`;
}

// مثال على منتجات مع فئات
export const sampleProductsWithCategories: ProductWithCategory[] = [
  {
    id: 1,
    name: 'اشتراك شهري في منصة التعلم',
    price: 99.00,
    quantity: 1,
    category: 'subscriptions',
    image: '/images/subscription.jpg'
  },
  {
    id: 2,
    name: 'لعبة استراتيجية متقدمة',
    price: 149.00,
    quantity: 1,
    category: 'games',
    image: '/images/game.jpg'
  },
  {
    id: 3,
    name: 'أدوات المونتاج الاحترافية',
    price: 299.00,
    quantity: 1,
    category: 'editing_tools',
    image: '/images/editing.jpg'
  },
  {
    id: 4,
    name: 'باقة المنتجات المميزة',
    price: 199.00,
    quantity: 1,
    category: 'premium_products',
    image: '/images/premium.jpg'
  }
];
