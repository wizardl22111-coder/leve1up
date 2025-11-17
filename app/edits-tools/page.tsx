import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Edit3, Video, Scissors, Palette, Star, ShoppingCart, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'أدوات المونتاج | متجر لفل اب',
  description: 'حزم جاهزة تساعدك في إنتاج فيديوهات احترافية - انتقالات، مؤثرات، قوالب وأكثر',
};

export default function EditToolsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        
        <div className="container-mobile relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-full mb-6 border border-blue-500/30">
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-bold">أدوات المونتاج الاحترافية</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
              أدوات{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                المونتاج
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              حزم جاهزة تساعدك في إنتاج فيديوهات احترافية
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                <Video className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
                <h3 className="text-lg font-bold text-white mb-2">انتقالات احترافية</h3>
                <p className="text-sm text-gray-400">مجموعة واسعة من الانتقالات السينمائية</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <Scissors className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-bold text-white mb-2">مؤثرات بصرية</h3>
                <p className="text-sm text-gray-400">تأثيرات بصرية مذهلة لفيديوهاتك</p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
                <Palette className="w-8 h-8 text-pink-400 mb-3 mx-auto" />
                <h3 className="text-lg font-bold text-white mb-2">قوالب جاهزة</h3>
                <p className="text-sm text-gray-400">قوالب مقدمة ونهاية احترافية</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
                <Edit3 className="w-8 h-8 text-green-400 mb-3 mx-auto" />
                <h3 className="text-lg font-bold text-white mb-2">أدوات متقدمة</h3>
                <p className="text-sm text-gray-400">أدوات مونتاج متقدمة وسهلة الاستخدام</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-dark-400">
        <div className="container-mobile">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">أدوات المونتاج المتاحة</h2>
            <p className="text-gray-400 text-lg">
              حزم احترافية جاهزة لتطوير مهاراتك في المونتاج
            </p>
          </div>

          {/* Product Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-dark-300 to-dark-500 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className="relative h-64 md:h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <div className="text-6xl font-bold text-white/10">🎬</div>
                  </div>
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    خصم 79%
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      باقة المونتاج الاحترافية
                    </h3>

                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">(4.9) • 500+ مشتري</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      باقة شاملة تحتوي على 2000+ مؤثر صوتي، 150+ انتقال، 250+ خلفية متحركة، 
                      200+ مقطع B-Roll، 200+ LUTs لتصحيح الألوان، و450+ اوفرلاي ظلال.
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        2000+ مؤثر صوتي
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        150+ انتقال سلس
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        250+ خلفية متحركة
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        200+ LUTs احترافية
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl font-bold text-white">24.99 ر.س</span>
                      <span className="text-lg text-gray-500 line-through">119.99 ر.س</span>
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded text-sm font-bold">
                        وفر 95 ر.س
                      </span>
                    </div>



                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link 
                        href="/products/4"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        عرض التفاصيل والشراء
                      </Link>
                      
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Download className="w-4 h-4" />
                        <span>تحميل فوري • 5 جيجابايت</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm text-blue-300 px-6 py-3 rounded-full border border-blue-500/30">
              <span className="text-sm font-bold">تحديثات مجانية مدى الحياة • حقوق استخدام تجارية</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
