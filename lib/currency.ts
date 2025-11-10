export const calculatePrice = (price: number, quantity: number = 1): number => {
  return price * quantity;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price);
};

export const formatPriceUSD = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Currency type definition
export type Currency = 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED';

// Currency subunit mapping (for payment processing)
export const subunitMap: Record<string, number> = {
  'SAR': 100, // 1 SAR = 100 halalas
  'USD': 100, // 1 USD = 100 cents
  'EUR': 100, // 1 EUR = 100 cents
  'GBP': 100, // 1 GBP = 100 pence
  'AED': 100, // 1 AED = 100 fils
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode: string): string => {
  const symbols: Record<string, string> = {
    'SAR': 'ر.س',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'AED': 'د.إ',
  };
  return symbols[currencyCode] || currencyCode;
};
