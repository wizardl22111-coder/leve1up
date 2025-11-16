import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Edit3, Video, Scissors, Palette } from 'lucide-react';

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

      {/* Coming Soon Section */}
      <section className="py-16 bg-dark-400">
        <div className="container-mobile">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">قريباً جداً</h2>
            <p className="text-gray-400 text-lg mb-8">
              نعمل على إعداد مجموعة شاملة من أدوات المونتاج الاحترافية
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-300/20 to-accent-600/20 backdrop-blur-sm text-primary-300 px-6 py-3 rounded-full border border-primary-300/30">
              <span className="text-sm font-bold">ترقبوا الإطلاق قريباً</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
