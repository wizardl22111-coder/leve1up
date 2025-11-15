import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, FileText, Shield, Users, CreditCard, Download, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen">
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
            <FileText className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🧾 اتفاقية الاستخدام
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              متجر Level Up
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* مقدمة */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-xl mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                مرحباً بك في <strong>متجر Level Up</strong>! هذه الشروط والأحكام تحكم استخدامك لموقعنا وخدماتنا. 
                باستخدام موقعنا، فإنك توافق على الالتزام بهذه الشروط.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا.
              </p>
            </div>

            <div className="space-y-8">
              {/* تعريفات */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-primary-600 dark:border-primary-400">
                <div className="flex items-start gap-4 mb-4">
                  <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    التعريفات
                  </h2>
                </div>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span><strong>"نحن" أو "المتجر":</strong> يشير إلى متجر Level Up</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span><strong>"أنت" أو "المستخدم":</strong> يشير إلى الشخص الذي يستخدم الموقع</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span><strong>"المنتجات الرقمية":</strong> الكتب الإلكترونية، الكورسات، والملفات الرقمية</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 dark:text-primary-400">•</span>
                    <span><strong>"الخدمات":</strong> جميع الخدمات المقدمة عبر الموقع</span>
                  </li>
                </ul>
              </div>

              {/* قبول الشروط */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-green-600 dark:border-green-400">
                <div className="flex items-start gap-4 mb-4">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    قبول الشروط
                  </h2>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  باستخدام موقعنا، فإنك تؤكد أنك:
                </p>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>تبلغ من العمر 18 عاماً على الأقل أو لديك موافقة ولي الأمر</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>تمتلك الأهلية القانونية لإبرام العقود</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>توافق على الالتزام بجميع الشروط والأحكام</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>ستستخدم الموقع بطريقة قانونية ومسؤولة</span>
                  </li>
                </ul>
              </div>

              {/* استخدام الموقع */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-blue-600 dark:border-blue-400">
                <div className="flex items-start gap-4 mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    استخدام الموقع
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      ✅ الاستخدام المسموح
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex gap-3">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <span>تصفح المنتجات والخدمات</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <span>شراء المنتجات الرقمية للاستخدام الشخصي</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <span>إنشاء حساب وإدارة معلوماتك</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <span>التواصل مع خدمة العملاء</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      ❌ الاستخدام المحظور
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex gap-3">
                        <span className="text-red-600 dark:text-red-400">•</span>
                        <span>إعادة بيع أو توزيع المنتجات الرقمية</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-red-600 dark:text-red-400">•</span>
                        <span>محاولة اختراق أو إلحاق الضرر بالموقع</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-red-600 dark:text-red-400">•</span>
                        <span>استخدام الموقع لأغراض غير قانونية</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-red-600 dark:text-red-400">•</span>
                        <span>انتهاك حقوق الملكية الفكرية</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* الدفع والأسعار */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-yellow-600 dark:border-yellow-400">
                <div className="flex items-start gap-4 mb-4">
                  <CreditCard className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    الدفع والأسعار
                  </h2>
                </div>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-yellow-600 dark:text-yellow-400">💳</span>
                    <span>جميع الأسعار معروضة بالدولار الأمريكي (USD)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-600 dark:text-yellow-400">💳</span>
                    <span>الدفع مطلوب بالكامل قبل تسليم المنتج</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-600 dark:text-yellow-400">💳</span>
                    <span>نقبل الدفع عبر بوابة Ziina الآمنة</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-600 dark:text-yellow-400">💳</span>
                    <span>قد تطبق رسوم إضافية من البنك أو مقدم الخدمة</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-600 dark:text-yellow-400">💳</span>
                    <span>نحتفظ بالحق في تغيير الأسعار دون إشعار مسبق</span>
                  </li>
                </ul>
              </div>

              {/* التسليم والتحميل */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-purple-600 dark:border-purple-400">
                <div className="flex items-start gap-4 mb-4">
                  <Download className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    التسليم والتحميل
                  </h2>
                </div>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400">📥</span>
                    <span>التسليم فوري بعد تأكيد الدفع</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400">📥</span>
                    <span>ستتلقى رابط التحميل عبر البريد الإلكتروني</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400">📥</span>
                    <span>روابط التحميل صالحة لمدة 30 يوماً</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400">📥</span>
                    <span>يمكنك إعادة تحميل المنتجات من حسابك</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 dark:text-purple-400">📥</span>
                    <span>في حالة مشاكل التحميل، تواصل معنا فوراً</span>
                  </li>
                </ul>
              </div>

              {/* سياسة الاسترداد */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-red-600 dark:border-red-400">
                <div className="flex items-start gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    سياسة الاسترداد
                  </h2>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    ⚠️ نظراً لطبيعة المنتجات الرقمية، لا يمكن إرجاعها بعد التحميل
                  </p>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  يمكن طلب الاسترداد في الحالات التالية فقط:
                </p>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-red-600 dark:text-red-400">•</span>
                    <span>خطأ تقني منع التحميل خلال 48 ساعة</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 dark:text-red-400">•</span>
                    <span>المنتج لا يطابق الوصف المعلن</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 dark:text-red-400">•</span>
                    <span>ملفات تالفة أو غير قابلة للاستخدام</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 dark:text-red-400">•</span>
                    <span>دفع مضاعف بالخطأ</span>
                  </li>
                </ul>
                
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  مدة طلب الاسترداد: <strong>7 أيام من تاريخ الشراء</strong>
                </p>
              </div>

              {/* إخلاء المسؤولية */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-r-4 border-gray-600 dark:border-gray-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  إخلاء المسؤولية
                </h2>
                
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-gray-600 dark:text-gray-400">•</span>
                    <span>المحتوى مقدم "كما هو" دون ضمانات</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gray-600 dark:text-gray-400">•</span>
                    <span>لا نضمن النتائج من استخدام منتجاتنا</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gray-600 dark:text-gray-400">•</span>
                    <span>المستخدم مسؤول عن استخدام المحتوى بطريقة قانونية</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gray-600 dark:text-gray-400">•</span>
                    <span>لا نتحمل مسؤولية الأضرار غير المباشرة</span>
                  </li>
                </ul>
              </div>

              {/* التواصل */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  التواصل معنا
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  لأي استفسارات حول هذه الشروط، تواصل معنا:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>📧 البريد الإلكتروني: support@leve1up.store</li>
                  <li>📱 واتساب: +971503492848</li>
                  <li>🌐 الموقع: leve1up.store</li>
                </ul>
                
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  تاريخ آخر تحديث: <strong>نوفمبر 2025</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

