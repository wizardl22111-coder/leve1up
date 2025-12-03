'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SocialMediaIcons from '@/components/SocialMediaIcons';
import { Mail, MessageCircle, Instagram, Home, Send, User, Phone, Check, X } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // دالة عرض Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // دالة التحقق من صحة البريد الإلكتروني
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // دالة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من الحقول المطلوبة
    if (!formData.fullName.trim()) {
      showToast('يرجى إدخال الاسم الكامل', 'error');
      return;
    }
    
    if (!formData.email.trim()) {
      showToast('يرجى إدخال البريد الإلكتروني', 'error');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
      return;
    }
    
    if (!formData.message.trim()) {
      showToast('يرجى إدخال الرسالة', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');
        setFormData({ fullName: '', email: '', phone: '', message: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إرسال الرسالة');
      }
    } catch (error: any) {
      console.error('خطأ في إرسال الرسالة:', error);
      showToast(error.message || 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة تحديث بيانات النموذج
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // دالة العودة للرئيسية
  const goHome = () => {
    window.location.href = '/';
  };

  // دالة فتح الشات
  const handleChatClick = () => {
    if (typeof window !== 'undefined') {
      // التحقق من وجود Tawk.to API
      if ((window as any).Tawk_API) {
        try {
          // تعيين معلومات أساسية للشات
          (window as any).Tawk_API.setAttributes({
            name: formData.fullName || 'زائر',
            email: formData.email || '',
            source: 'contact-page'
          });

          // فتح الشات
          (window as any).Tawk_API.maximize();
          console.log('✅ Chat opened from contact page');
        } catch (error) {
          console.error('❌ Error opening chat:', error);
          showToast('حدث خطأ في فتح الشات. يرجى المحاولة مرة أخرى.', 'error');
        }
      } else {
        // تحميل Tawk.to إذا لم يكن متاحاً
        loadTawkScript().then(() => {
          setTimeout(() => {
            if ((window as any).Tawk_API) {
              (window as any).Tawk_API.setAttributes({
                name: formData.fullName || 'زائر',
                email: formData.email || '',
                source: 'contact-page'
              });
              (window as any).Tawk_API.maximize();
            } else {
              showToast('لا يمكن تحميل الشات حالياً. يرجى المحاولة لاحقاً.', 'error');
            }
          }, 2000);
        });
      }
    }
  };

  const loadTawkScript = (): Promise<void> => {
    return new Promise((resolve) => {
      // التحقق من وجود السكريبت مسبقاً
      const existingScript = document.querySelector('script[src*="embed.tawk.to"]');
      if (existingScript) {
        resolve();
        return;
      }

      // تهيئة Tawk.to
      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();

      // إنشاء وإدراج سكريبت Tawk.to
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/6921c18027ad1319611fb72e/1jaltno6d';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      script.onload = () => {
        console.log('✅ Tawk.to script loaded successfully');
        resolve();
      };

      // إضافة السكريبت إلى الصفحة
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    });
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              📞 اتصل بنا
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              نحب أن نسمع منك!
            </p>
            <p className="text-lg text-slate-300">
              لا تتردد في التواصل معنا عبر أي من الطرق التالية. فريق الدعم جاهز لمساعدتك في كل خطوة من رحلتك الرقمية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            {/* Email */}
            <motion.a
              href="mailto:leve1up999q@gmail.com"
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-xl hover:shadow-xl transition-all duration-300 border border-primary-300/20 hover:border-primary-300/40 cursor-pointer block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <FaEnvelope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                البريد الإلكتروني
              </h3>
              <p className="text-slate-300 mb-4 text-center">
                راسلنا عبر البريد
              </p>
            </motion.a>

            {/* Instagram */}
            <motion.a
              href="https://www.instagram.com/1level1up1/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-xl hover:shadow-xl transition-all duration-300 border border-primary-300/20 hover:border-primary-300/40 cursor-pointer block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <FaInstagram className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                إنستغرام
              </h3>
              <p className="text-slate-300 mb-4 text-center">
                تابعنا على إنستغرام
              </p>
            </motion.a>
          </div>



          {/* Social Media Icons */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              🌟 تابعنا على وسائل التواصل الاجتماعي
            </h3>
            <SocialMediaIcons 
              whatsappNumber="+971503492848"
              whatsappMessage="مرحباً، أريد الاستفسار عن المنتجات"
              instagramUrl="https://www.instagram.com/1level1up1/"
              tiktokUrl="https://www.tiktok.com/@lvlup321"
              showWhatsApp={false}
            />
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-primary-300/20 p-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              📬 أرسل لنا رسالة
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* الاسم الكامل */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  الاسم الكامل <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  البريد الإلكتروني <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  رقم الهاتف <span className="text-slate-400">(اختياري)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>

              {/* الرسالة */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  الرسالة <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none"
                  placeholder="اكتب رسالتك هنا..."
                  required
                />
              </div>

              {/* زر الإرسال */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl font-medium shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    إرسال الرسالة
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* زر الشات المباشر */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    تحتاج مساعدة فورية؟
                  </h3>
                  <p className="text-slate-400 mb-4">
                    تحدث معنا مباشرة عبر الشات للحصول على دعم سريع
                  </p>
                  <motion.button
                    onClick={handleChatClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    فتح الشات المباشر
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* زر العودة للرئيسية */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={goHome}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-700/80 to-slate-800/80 hover:from-slate-600/80 hover:to-slate-700/80 text-white rounded-xl border border-slate-600/50 hover:border-slate-500/70 font-medium shadow-lg hover:shadow-slate-500/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              العودة للصفحة الرئيسية
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
