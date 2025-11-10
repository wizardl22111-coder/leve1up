"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  currency: string;
  wishlist: any[];
  addToWishlist: (item: any) => void;
  removeFromWishlist: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);

  const currency = 'SAR';

  const addToWishlist = (item: any) => {
    setWishlist(prev => [...prev, item]);
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      currency,
      wishlist,
      addToWishlist,
      removeFromWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};
