import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, RefreshCw, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* زر الرجوع */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 group"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              <span className="font-medium">الرجوع للقائمة الرئيسية</span>
            </Link>
          </div>

          <div className="text-center mb-12 animate-fade-in">
            <RefreshCw className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🔄 سياسة الاستبدال والاسترداد
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              نحن نهتم برضاك التام عن منتجاتنا الرقمية. إليك سياستنا الواضحة للاستبدال والاسترداد.
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* مقدمة */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-xl mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                في <strong>متجر Level Up</strong>، نسعى لتقديم أفضل تجربة شراء للمنتجات الرقمية. 
                نحن نتفهم أن طبيعة المنتجات الرقمية تختلف عن المنتجات المادية، لذلك وضعنا سياسة واضحة وعادلة للاستبدال والاسترداد.
              </p>
            </div>

            <div className="space-y-8">
              {/* سياسة الاسترداد */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-red-500">
                <div className="flex items-start gap-4 mb-4">
                  <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    سياسة عدم الاسترداد
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    ⚠️ تنويه مهم: جميع المنتجات الرقمية غير قابلة للاسترداد بعد التحميل
                  </p>
                  
                  <p>
                    نظراً لطبيعة المنتجات الرقمية (كتب إلكترونية، كورسات، ملفات)، فإنه <strong>لا يمكن استرداد المبلغ</strong> 
                    بعد إتمام عملية التحميل أو الوصول للمحتوى.
                  </p>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">أسباب عدم الاسترداد:</h4>
                    <ul className="space-y-2 text-red-700 dark:text-red-300">
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>المنتج الرقمي يتم تسليمه فورياً ولا يمكن "إرجاعه"</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>يمكن نسخ المحتوى الرقمي بسهولة</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>هذه هي الممارسة المعيارية في صناعة المنتجات الرقمية</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* الحالات الاستثنائية */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-yellow-500">
                <div className="flex items-start gap-4 mb-4">
                  <Shield className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    الحالات الاستثنائية
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    في حالات نادرة ومحددة، قد نقوم بالنظر في طلب الاسترداد:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">مشاكل تقنية:</h4>
                      <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                        <li>• ملف تالف لا يمكن فتحه</li>
                        <li>• رابط تحميل لا يعمل</li>
                        <li>• محتوى مختلف عن الوصف</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">أخطاء في الدفع:</h4>
                      <ul className="space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
                        <li>• دفع مضاعف بالخطأ</li>
                        <li>• خطأ في معالجة الدفع</li>
                        <li>• شراء غير مقصود</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200">
                      <strong>📞 للإبلاغ عن مشكلة:</strong> تواصل معنا خلال 24 ساعة من الشراء عبر 
                      <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">
                        صفحة التواصل
                      </Link>
                      مع تفاصيل المشكلة.
                    </p>
                  </div>
                </div>
              </div>

              {/* ضمان الجودة */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-green-500">
                <div className="flex items-start gap-4 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    ضمان الجودة
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    نحن نضمن لك جودة منتجاتنا الرقمية:
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-bold text-green-800 dark:text-green-200">محتوى عالي الجودة</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        جميع منتجاتنا مراجعة ومختبرة
                      </p>
                    </div>

                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-bold text-green-800 dark:text-green-200">تحميل آمن</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        روابط تحميل مشفرة وآمنة
                      </p>
                    </div>

                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-bold text-green-800 dark:text-green-200">دعم فني</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        مساعدة في حل المشاكل التقنية
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* نصائح قبل الشراء */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  💡 نصائح قبل الشراء
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                  <div>
                    <h4 className="font-semibold mb-2">✅ تأكد من:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• قراءة وصف المنتج بالكامل</li>
                      <li>• مراجعة التقييمات والمراجعات</li>
                      <li>• التأكد من متطلبات النظام</li>
                      <li>• فهم محتوى المنتج</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">❓ في حالة الشك:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• تواصل معنا قبل الشراء</li>
                      <li>• اطلب معلومات إضافية</li>
                      <li>• استفسر عن المحتوى</li>
                      <li>• تحقق من التوافق</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* معلومات التواصل */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  📞 تحتاج مساعدة؟
                </h3>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  فريق الدعم الفني متاح لمساعدتك في حل أي مشكلة تقنية أو الإجابة على استفساراتك.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <span>تواصل معنا</span>
                  </Link>
                  
                  <a 
                    href="https://wa.me/971503492848"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
