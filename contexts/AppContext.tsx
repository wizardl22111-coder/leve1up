'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { convertPrice, type Currency as CurrencyType } from '@/lib/currency';
import { getDefaultCountry, calculateTax, type Country, type TaxCalculation } from '@/lib/tax';

// إعادة تصدير Currency من lib/currency للتوافق
type Currency = CurrencyType;
type Theme = 'light' | 'dark';

interface CartItem {
  id: number;
  name: string;
  price: number; // السعر المحفوظ بـ SAR
  quantity: number;
  image: string;
}

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  wishlist: number[];
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  cartTotal: number; // الآن يُحسب بالعملة الحالية
  cartCount: number;
  // إضافات جديدة للضرائب والدولة
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  taxCalculation: TaxCalculation | null;
  // إضافات جديدة لأكواد الخصم
  appliedDiscount: { code: string; percent: number } | null;
  setAppliedDiscount: (discount: { code: string; percent: number } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // الوضع الداكن افتراضياً
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedCurrency = localStorage.getItem('currency') as Currency | null;
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCountry = localStorage.getItem('selectedCountry');
    const savedDiscount = localStorage.getItem('appliedDiscount');

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // إذا لم يكن هناك theme محفوظ، استخدم الوضع الداكن افتراضياً
      setTheme('dark');
    }
    
    // تطبيق الوضع على document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark' || !savedTheme);
    
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCountry) {
      try {
        const country = JSON.parse(savedCountry);
        setSelectedCountry(country);
      } catch (e) {
        // في حالة خطأ في parsing، استخدم الدولة الافتراضية
        setSelectedCountry(getDefaultCountry());
      }
    }
    if (savedDiscount) {
      try {
        const discount = JSON.parse(savedDiscount);
        setAppliedDiscount(discount);
      } catch (e) {
        // في حالة خطأ في parsing، لا تطبق أي خصم
        setAppliedDiscount(null);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
  }, [selectedCountry]);

  useEffect(() => {
    if (appliedDiscount) {
      localStorage.setItem('appliedDiscount', JSON.stringify(appliedDiscount));
    } else {
      localStorage.removeItem('appliedDiscount');
    }
  }, [appliedDiscount]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (id: number) => {
    setWishlist(prev => [...prev, id]);
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(itemId => itemId !== id));
  };

  // حساب المجموع بالعملة الحالية (السعر محفوظ بـ SAR)
  const cartTotal = cart.reduce((sum, item) => {
    // تحويل السعر من SAR إلى العملة الحالية
    const convertedPrice = convertPrice(item.price, currency);
    return sum + (convertedPrice * item.quantity);
  }, 0);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // حساب الضرائب عند تغيير السلة أو الدولة
  useEffect(() => {
    if (cartTotal > 0) {
      const calculation = calculateTax(cartTotal, selectedCountry.code, currency);
      setTaxCalculation(calculation);
    } else {
      setTaxCalculation(null);
    }
  }, [cartTotal, selectedCountry, currency]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        cartTotal,
        cartCount,
        selectedCountry,
        setSelectedCountry,
        taxCalculation,
        appliedDiscount,
        setAppliedDiscount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
