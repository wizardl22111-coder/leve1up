'use client';

import { Mail, Home, ShoppingBag, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SocialMediaIcons from './SocialMediaIcons';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-dark-400 border-t border-primary-300/10 text-white safe-bottom">
      <div className="container-mobile py-8 sm:py-12">
        {/* Desktop: Horizontal Layout (4 columns) | Mobile: Vertical Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Company Logo with Email Link */}
          <div className="text-center sm:text-right">
            <a 
              href="mailto:leve1up999q@gmail.com"
              className="inline-flex flex-col items-center sm:items-start gap-3 mb-4 group"
            >
              <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                <Image
                  src="/logo.png"
                  alt="Level Up Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent">
                Level Up
              </span>
            </a>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
              متجرك الموثوق للكتب والمنتجات الرقمية بأفضل الأسعار وتسليم فوري ⚡
            </p>
            
            {/* Social Icons */}
            <SocialMediaIcons 
              className="justify-center sm:justify-start"
              whatsappNumber="+971503492848"
              whatsappMessage="مرحباً، أريد الاستفسار عن منتجات Level Up"
              instagramUrl="https://www.instagram.com/1level1up1/"
              tiktokUrl="https://www.tiktok.com/@lvlup321"
              showWhatsApp={pathname === '/'}
            />
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center sm:text-right">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-primary-300">روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation group"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  href="/#products" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation group"
                >
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  المنتجات
                </Link>
              </li>
              <li>
                <Link 
                  href="/#faq" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation group"
                >
                  <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-colors text-sm sm:text-base touch-manipulation group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="text-center sm:text-right">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-accent-600">السياسات</h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-accent-600 transition-colors text-sm sm:text-base block touch-manipulation"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-accent-600 transition-colors text-sm sm:text-base block touch-manipulation"
                >
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund" 
                  className="text-gray-400 hover:text-accent-600 transition-colors text-sm sm:text-base block touch-manipulation"
                >
                  سياسة الاستبدال
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter or Additional Info */}
          <div className="text-center sm:text-right">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-primary-300">ابق على تواصل</h4>
            <p className="text-gray-400 text-sm sm:text-base mb-4 leading-relaxed">
              تابعنا على وسائل التواصل الاجتماعي لمعرفة آخر العروض والمنتجات الجديدة
            </p>
            <a
              href="mailto:leve1up999q@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-300 to-accent-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary-300/30 transition-all duration-300 font-semibold text-sm sm:text-base touch-manipulation group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              راسلنا
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-primary-300/10 pt-8 pb-4">
          <div className="text-center">
            <h4 className="text-base sm:text-lg font-bold mb-4 text-primary-300">طرق الدفع المتاحة</h4>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="bg-white rounded-lg p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                  alt="Google Pay"
                  width={45}
                  height={18}
                  className="h-4 w-auto"
                />
              </div>
              <div className="bg-white rounded-lg p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                  alt="Apple Pay"
                  width={45}
                  height={18}
                  className="h-4 w-auto"
                />
              </div>
              <div className="bg-white rounded-lg p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  width={45}
                  height={18}
                  className="h-4 w-auto"
                />
              </div>
              <div className="bg-white rounded-lg p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                  alt="Mastercard"
                  width={45}
                  height={18}
                  className="h-4 w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-300/10 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {currentYear} جميع الحقوق محفوظة لمتجر{' '}
              <span className="text-primary-300 font-bold">Level Up</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
