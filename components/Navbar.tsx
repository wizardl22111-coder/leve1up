'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Heart, Globe, Home, Package, Mail, Receipt, User, LogIn, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';


export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currency, setCurrency, cartCount, wishlist } = useApp();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // العملات المدعومة من Ziina فقط
  const currencies = [
    { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي' },
    { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي' },
    { code: 'BHD', symbol: 'د.ب', name: 'دينار بحريني' },
    { code: 'KWD', symbol: 'د.ك', name: 'دينار كويتي' },
    { code: 'OMR', symbol: 'ر.ع', name: 'ريال عماني' },
    { code: 'QAR', symbol: 'ر.ق', name: 'ريال قطري' },
    { code: 'USD', symbol: '$', name: 'دولار أمريكي' },
    { code: 'EUR', symbol: '€', name: 'يورو' },
    { code: 'GBP', symbol: '£', name: 'جنيه إسترليني' },
    { code: 'INR', symbol: '₹', name: 'روبية هندية' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
        isScrolled 
          ? 'bg-dark-400/95 backdrop-blur-lg shadow-lg border-b border-primary-300/10' 
          : 'bg-transparent'
      }`}>
        <div className="container-mobile">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center group" onClick={handleLinkClick}>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                <Image
                  src="/logo.png"
                  alt="Level Up Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="mr-2 sm:mr-3 text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent hidden sm:inline">
                Level Up
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-primary-300 transition-colors duration-200 font-semibold text-sm lg:text-base"
              >
                الرئيسية
              </Link>
              <Link 
                href="/#products" 
                className="text-gray-300 hover:text-primary-300 transition-colors duration-200 font-semibold text-sm lg:text-base"
              >
                المنتجات
              </Link>

              <Link 
                href="/contact" 
                className="text-gray-300 hover:text-primary-300 transition-colors duration-200 font-semibold text-sm lg:text-base"
              >
                تواصل معنا
              </Link>

              {/* Currency Selector Desktop */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-dark-300/80 hover:bg-dark-300 text-gray-300 rounded-xl transition-all duration-200 font-semibold text-sm border border-primary-300/20 hover:border-primary-300/50"
                >
                  <Globe className="w-4 h-4 text-primary-300" />
                  <span>{currencies.find(c => c.code === currency)?.symbol}</span>
                </button>

                {showCurrencyMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowCurrencyMenu(false)}
                    />
                    <div className="absolute left-0 mt-2 w-56 bg-dark-400/95 backdrop-blur-sm rounded-xl shadow-2xl border border-primary-300/30 py-2 z-50 max-h-80 overflow-y-auto">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            setCurrency(curr.code as any);
                            setShowCurrencyMenu(false);
                          }}
                          className={`w-full text-right px-4 py-2.5 transition-colors text-sm font-semibold ${
                            currency === curr.code
                              ? 'bg-primary-300/20 text-primary-300'
                              : 'text-gray-300 hover:bg-primary-300/10 hover:text-primary-300'
                          }`}
                        >
                          {curr.name} ({curr.symbol})
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 sm:p-2.5 hover:bg-primary-300/10 rounded-xl transition-colors"
                aria-label="قائمة الأمنيات"
              >
                <Heart className="w-5 h-5 text-primary-300" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-dark-400">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 sm:p-2.5 hover:bg-primary-300/10 rounded-xl transition-colors"
                aria-label="سلة التسوق"
              >
                <ShoppingCart className="w-5 h-5 text-primary-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-300 to-primary-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-dark-400">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth Buttons */}
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-primary-300 border-t-transparent rounded-full animate-spin"></div>
              ) : session ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 bg-primary-300/20 hover:bg-primary-300/30 text-primary-300 rounded-xl transition-all duration-200 font-semibold text-sm border border-primary-300/30"
                  >
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="hidden lg:inline">
                      {session.user?.name?.split(' ')[0] || 'الملف الشخصي'}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors"
                    aria-label="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-all duration-200 font-semibold text-sm border border-blue-300/30"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden lg:inline">دخول</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-all duration-200 font-semibold text-sm border border-purple-300/30"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">تسجيل</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2 sm:gap-3">
              {/* Wishlist Mobile */}
              <Link
                href="/wishlist"
                className="relative p-2.5 hover:bg-primary-300/10 active:bg-primary-300/20 rounded-xl transition-all duration-200 touch-manipulation"
                aria-label="قائمة الأمنيات"
                onClick={handleLinkClick}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-300" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center border-2 border-dark-400">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Mobile */}
              <Link
                href="/cart"
                className="relative p-2.5 hover:bg-primary-300/10 active:bg-primary-300/20 rounded-xl transition-all duration-200 touch-manipulation"
                aria-label="سلة التسوق"
                onClick={handleLinkClick}
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-300 to-primary-400 text-gray-900 text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center border-2 border-dark-400">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 hover:bg-primary-300/10 active:bg-primary-300/20 rounded-xl transition-all duration-200 touch-manipulation"
                aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-primary-300" />
                ) : (
                  <Menu className="w-6 h-6 text-primary-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Page Overlay Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-lg z-50 md:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`w-full h-full flex items-center justify-center p-6 transform transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-dark-400/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary-300/20 w-full max-w-md max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-300/20 to-accent-600/20 p-6 text-center border-b border-primary-300/10">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
                Level Up
              </h3>
              <p className="text-gray-400 text-sm mt-1">القائمة الرئيسية</p>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] text-center">
              {/* Navigation Links */}
              <div className="space-y-3 mb-6">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-4 w-full px-6 py-4 text-lg text-gray-300 hover:text-white hover:bg-primary-300/10 active:bg-primary-300/20 rounded-2xl transition-all duration-300 font-bold touch-manipulation group"
                  onClick={handleLinkClick}
                >
                  <Home className="w-6 h-6 text-primary-300 group-hover:scale-110 transition-transform" />
                  <span>الرئيسية</span>
                </Link>

                <Link
                  href="/#products"
                  className="flex items-center justify-center gap-4 w-full px-6 py-4 text-lg text-gray-300 hover:text-white hover:bg-primary-300/10 active:bg-primary-300/20 rounded-2xl transition-all duration-300 font-bold touch-manipulation group"
                  onClick={handleLinkClick}
                >
                  <Package className="w-6 h-6 text-primary-300 group-hover:scale-110 transition-transform" />
                  <span>المنتجات</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-4 w-full px-6 py-4 text-lg text-gray-300 hover:text-white hover:bg-primary-300/10 active:bg-primary-300/20 rounded-2xl transition-all duration-300 font-bold touch-manipulation group"
                  onClick={handleLinkClick}
                >
                  <Mail className="w-6 h-6 text-primary-300 group-hover:scale-110 transition-transform" />
                  <span>تواصل معنا</span>
                </Link>
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-primary-300/30 to-transparent" />

              {/* Auth Section Mobile */}
              <div className="space-y-3 mb-6">
                {status === "loading" ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-8 h-8 border-2 border-primary-300 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : session ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center justify-center gap-4 w-full px-6 py-4 text-lg text-gray-300 hover:text-white hover:bg-primary-300/10 active:bg-primary-300/20 rounded-2xl transition-all duration-300 font-bold touch-manipulation group"
                      onClick={handleLinkClick}
                    >
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user?.name || 'User'} 
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-primary-300 group-hover:scale-110 transition-transform" />
                      )}
                      <span>الملف الشخصي</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-4 w-full px-6 py-4 text-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 active:bg-red-500/20 rounded-2xl transition-all duration-300 font-bold touch-manipulation group"
                    >
                      <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-4 w-full px-6 py-4 text-lg text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 active:bg-blue-500/20 rounded-2xl transition-all duration-300 font-bold touch-manipulation group"
                      onClick={handleLinkClick}
                    >
                      <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span>تسجيل الدخول</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-4 w-full px-6 py-4 text-lg text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 active:bg-purple-500/20 rounded-2xl transition-all duration-300 font-bold touch-manipulation group"
                      onClick={handleLinkClick}
                    >
                      <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span>إنشاء حساب</span>
                    </Link>
                  </>
                )}
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-primary-300/30 to-transparent" />

              {/* Policy Links */}
              <div className="space-y-2 mb-6">
                <Link
                  href="/privacy"
                  className="block w-full px-6 py-3 text-center text-gray-400 hover:text-white hover:bg-accent-600/10 active:bg-accent-600/20 rounded-xl transition-all duration-300 font-medium touch-manipulation"
                  onClick={handleLinkClick}
                >
                  سياسة الخصوصية
                </Link>

                <Link
                  href="/terms"
                  className="block w-full px-6 py-3 text-center text-gray-400 hover:text-white hover:bg-accent-600/10 active:bg-accent-600/20 rounded-xl transition-all duration-300 font-medium touch-manipulation"
                  onClick={handleLinkClick}
                >
                  شروط الاستخدام
                </Link>

                <Link
                  href="/refund"
                  className="block w-full px-6 py-3 text-center text-gray-400 hover:text-white hover:bg-accent-600/10 active:bg-accent-600/20 rounded-xl transition-all duration-300 font-medium touch-manipulation"
                  onClick={handleLinkClick}
                >
                  سياسة الاستبدال
                </Link>
              </div>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-primary-300/30 to-transparent" />

              {/* Currency Selector Mobile */}
              <div className="text-center">
                <label className="block text-sm font-bold text-primary-300 mb-4">
                  <Globe className="w-4 h-4 inline-block ml-2" />
                  اختر العملة
                </label>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-dark-300 text-white text-base px-6 py-4 rounded-2xl border-2 border-primary-300/40 focus:border-primary-300 focus:outline-none font-bold touch-manipulation transition-all duration-300 hover:border-primary-300/60 shadow-lg text-center"
                  style={{ fontSize: '16px' }} // Prevent zoom on iOS
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code} className="bg-dark-300 text-white py-2">
                      {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
