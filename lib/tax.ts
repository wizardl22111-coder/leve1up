// نظام حساب الضرائب والرسوم بناءً على الدولة
import { Currency } from './currency';

export interface Country {
  code: string;
  name: string;
  nameAr: string;
  currency: Currency;
  vatRate: number; // معدل ضريبة القيمة المضافة (كنسبة مئوية)
  flag: string;
}

// قائمة الدول المدعومة مع معدلات الضرائب
export const supportedCountries: Country[] = [
  {
    code: 'AE',
    name: 'United Arab Emirates',
    nameAr: 'الإمارات العربية المتحدة',
    currency: 'AED',
    vatRate: 5,
    flag: '🇦🇪'
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    currency: 'SAR',
    vatRate: 15,
    flag: '🇸🇦'
  },
  {
    code: 'KW',
    name: 'Kuwait',
    nameAr: 'الكويت',
    currency: 'KWD',
    vatRate: 0, // الكويت لا تطبق ضريبة القيمة المضافة حالياً
    flag: '🇰🇼'
  },
  {
    code: 'QA',
    name: 'Qatar',
    nameAr: 'قطر',
    currency: 'QAR',
    vatRate: 0, // قطر لا تطبق ضريبة القيمة المضافة حالياً
    flag: '🇶🇦'
  },
  {
    code: 'BH',
    name: 'Bahrain',
    nameAr: 'البحرين',
    currency: 'BHD',
    vatRate: 10,
    flag: '🇧🇭'
  },
  {
    code: 'OM',
    name: 'Oman',
    nameAr: 'عُمان',
    currency: 'OMR',
    vatRate: 5,
    flag: '🇴🇲'
  },
  {
    code: 'EG',
    name: 'Egypt',
    nameAr: 'مصر',
    currency: 'USD', // نستخدم الدولار للمنتجات الرقمية
    vatRate: 14,
    flag: '🇪🇬'
  },
  {
    code: 'JO',
    name: 'Jordan',
    nameAr: 'الأردن',
    currency: 'USD',
    vatRate: 16,
    flag: '🇯🇴'
  },
  {
    code: 'LB',
    name: 'Lebanon',
    nameAr: 'لبنان',
    currency: 'USD',
    vatRate: 11,
    flag: '🇱🇧'
  },
  {
    code: 'US',
    name: 'United States',
    nameAr: 'الولايات المتحدة',
    currency: 'USD',
    vatRate: 0, // لا توجد ضريبة فيدرالية على المنتجات الرقمية
    flag: '🇺🇸'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    nameAr: 'المملكة المتحدة',
    currency: 'GBP',
    vatRate: 20,
    flag: '🇬🇧'
  },
  {
    code: 'IN',
    name: 'India',
    nameAr: 'الهند',
    currency: 'INR',
    vatRate: 18, // GST على المنتجات الرقمية
    flag: '🇮🇳'
  }
];

export interface TaxCalculation {
  subtotal: number;
  vatAmount: number;
  total: number;
  vatRate: number;
  country: Country;
  currency: Currency;
}

// الحصول على معلومات الدولة بناءً على الكود
export function getCountryByCode(countryCode: string): Country | null {
  return supportedCountries.find(country => country.code === countryCode) || null;
}

// الحصول على الدولة الافتراضية (الإمارات)
export function getDefaultCountry(): Country {
  return supportedCountries[0]; // الإمارات كدولة افتراضية
}

// حساب الضرائب
export function calculateTax(
  subtotal: number,
  countryCode: string,
  currency: Currency
): TaxCalculation {
  const country = getCountryByCode(countryCode) || getDefaultCountry();
  
  // حساب مبلغ الضريبة
  const vatAmount = subtotal * (country.vatRate / 100);
  const total = subtotal + vatAmount;

  return {
    subtotal,
    vatAmount,
    total,
    vatRate: country.vatRate,
    country,
    currency
  };
}

// تنسيق عرض الضريبة
export function formatTaxDisplay(taxCalculation: TaxCalculation): {
  subtotalText: string;
  vatText: string;
  totalText: string;
} {
  const { subtotal, vatAmount, total, vatRate, country } = taxCalculation;
  
  return {
    subtotalText: `${subtotal.toFixed(2)}`,
    vatText: vatRate > 0 ? `${vatAmount.toFixed(2)} (${vatRate}%)` : 'معفى',
    totalText: `${total.toFixed(2)}`
  };
}

// التحقق من وجوب عرض الضرائب
export function shouldShowTax(countryCode: string): boolean {
  const country = getCountryByCode(countryCode);
  return country ? country.vatRate > 0 : false;
}

// الحصول على نص توضيحي للضريبة
export function getTaxExplanation(countryCode: string): string {
  const country = getCountryByCode(countryCode);
  if (!country) return '';
  
  if (country.vatRate === 0) {
    return 'لا توجد ضرائب مطبقة على هذا المنتج في دولتك';
  }
  
  return `ضريبة القيمة المضافة ${country.vatRate}% مطبقة حسب قوانين ${country.nameAr}`;
}
