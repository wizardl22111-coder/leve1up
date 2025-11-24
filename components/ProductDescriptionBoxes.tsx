'use client';

import React from 'react';

interface ProductDescriptionBoxesProps {
  productId: number;
  productName: string;
}

const ProductDescriptionBoxes: React.FC<ProductDescriptionBoxesProps> = ({ productId, productName }) => {
  
  // محتوى البوكسات حسب المنتج
  const getProductBoxes = (id: number) => {
    switch (id) {
      case 1: // الدليل التمهيدي
        return {
          box1: {
            title: "📚 ستتعلّم داخل هذا الكتاب:",
            items: [
              "كيف تختار فكرة منتج رقمي مربحة",
              "الأساسيات لبناء متجرك أو صفحتك",
              "كيف تسوّق بدون إضاعة الوقت والمال",
              "خطوات عملية للبدء فوراً"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "محتوى تطبيقي وليس نظري",
              "أمثلة حقيقية من السوق",
              "كتاب رقمي بصيغة PDF",
              "تصميم عصري ومريح للقراءة"
            ]
          },
          box3: {
            title: "📥 ماذا ستحصل بعد الدفع:",
            items: [
              "كتاب رقمي فوري",
              "محتوى منظم وسهل الفهم",
              "نصائح واستراتيجيات جاهزة",
              "ملفات قابلة للحفظ والطباعة"
            ]
          },
          box4: {
            title: "👥 لمن هذا المنتج؟",
            items: [
              "المبتدئون في المشاريع الرقمية",
              "من يبحث عن دخل إضافي",
              "الطلاب والخريجين",
              "أصحاب الأعمال الحرة"
            ]
          }
        };

      case 2: // الربح من المنتجات الرقمية
        return {
          box1: {
            title: "📚 ستتعلّم داخل هذا الكتاب:",
            items: [
              "أنواع المنتجات الرقمية الأكثر مبيعاً",
              "كيف تختار فكرة تضمن المبيعات",
              "الأدوات والمنصات للانطلاق فوراً",
              "أساليب التسويق الحديثة"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "خطة كاملة خطوة بخطوة",
              "أمثلة وتجارب حقيقية",
              "محتوى مختصر وفعّال",
              "تصميم احترافي ولغة بسيطة"
            ]
          },
          box3: {
            title: "📥 ماذا ستحصل بعد الدفع:",
            items: [
              "كتاب PDF فوري",
              "خريطة طريق واقعية للربح",
              "استراتيجيات تسويق مجربة",
              "دليل بناء الدخل السلبي"
            ]
          },
          box4: {
            title: "👥 لمن هذا المنتج؟",
            items: [
              "من يريد بدء مشروع رقمي",
              "الباحثون عن دخل إضافي",
              "صناع المحتوى والمؤثرين",
              "أصحاب المهارات المختلفة"
            ]
          }
        };

      case 3: // 15 فكرة مشروع رقمي
        return {
          box1: {
            title: "📚 ستتعلّم داخل هذا الكتاب:",
            items: [
              "15 فكرة مشروع رقمي مجرّبة",
              "كيف تختار الفكرة المناسبة لك",
              "أدوات بسيطة للبدء",
              "خطة عملية لتطوير عملك"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "أفكار متنوعة ومربحة",
              "شرح مفصل لكل فكرة",
              "أمثلة من الواقع",
              "نصائح للتنفيذ الناجح"
            ]
          },
          box3: {
            title: "📥 ماذا ستحصل بعد الدفع:",
            items: [
              "كتاب رقمي شامل",
              "15 فكرة مشروع مفصلة",
              "دليل التنفيذ العملي",
              "نصائح لزيادة الأرباح"
            ]
          },
          box4: {
            title: "👥 لمن هذا المنتج؟",
            items: [
              "صناع محتوى يبحثون عن أفكار جديدة",
              "مبتدئون في المشاريع الرقمية",
              "الطلاب والخريجين",
              "أصحاب الأعمال الحرة"
            ]
          }
        };

      case 4: // باقة المونتاج الاحترافية
        return {
          box1: {
            title: "🎬 ستحصل في هذه الباقة:",
            items: [
              "2000+ مؤثر صوتي احترافي",
              "150+ انتقال سلس ومميز",
              "250+ خلفية متحركة",
              "200+ مقطع B-Roll عالي الجودة"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "جودة 4K فائقة الوضوح",
              "ملفات منظمة وسهلة الاستخدام",
              "متوافقة مع جميع برامج المونتاج",
              "تحديثات مجانية مدى الحياة"
            ]
          },
          box3: {
            title: "📥 ماذا ستحصل بعد الدفع:",
            items: [
              "تحميل فوري لجميع الملفات",
              "ملفات مضغوطة ومنظمة",
              "دليل الاستخدام مرفق",
              "حقوق استخدام تجارية كاملة"
            ]
          },
          box4: {
            title: "👥 لمن هذا المنتج؟",
            items: [
              "صناع المحتوى على يوتيوب",
              "المونتيرين المحترفين",
              "المسوقين الرقميين",
              "منشئي المحتوى على السوشيال ميديا"
            ]
          }
        };

      case 5: // باقة أيقونات متحركة
        return {
          box1: {
            title: "🎨 ستحصل في هذه الباقة:",
            items: [
              "60+ أيقونة متحركة احترافية",
              "أيقونات اشتراك ولايك وجرس",
              "أيقونات تفاعل ومشاركة",
              "أيقونات وسائل التواصل الاجتماعي"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "دقة عالية الجودة",
              "خلفية شفافة للاستخدام السهل",
              "أنماط متنوعة وعصرية",
              "ألوان قابلة للتخصيص"
            ]
          },
          box3: {
            title: "📥 ماذا ستحصل بعد الدفع:",
            items: [
              "ملفات MP4 و MOV و GIF",
              "ملفات After Effects قابلة للتعديل",
              "تحميل فوري ومنظم",
              "دليل الاستخدام مرفق"
            ]
          },
          box4: {
            title: "👥 لمن هذا المنتج؟",
            items: [
              "صناع محتوى الفيديو",
              "مصممي الموشن جرافيك",
              "المسوقين الرقميين",
              "منشئي المحتوى التعليمي"
            ]
          }
        };

      case 6: // باقة التصميم وصناعة المحتوى
        return {
          box1: {
            title: "🎨 ماذا ستتعلم:",
            items: [
              "استخدام 1100 أيقونة PNG شفافة",
              "أكثر من 50 خط مميز وجاهز",
              "قوالب جاهزة بصيغة PSD",
              "تأثيرات نصوص احترافية"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "أيقونات عالية الجودة",
              "خطوط عربية وإنجليزية",
              "قوالب قابلة للتخصيص",
              "ملفات منظمة ومرتبة"
            ]
          },
          box3: {
            title: "📥 ماذا ستحصل بعد الدفع:",
            items: [
              "1100 أيقونة PNG شفافة",
              "50+ خط احترافي",
              "قوالب PSD جاهزة",
              "دليل الاستخدام الشامل"
            ]
          },
          box4: {
            title: "👥 لمن هذا المنتج؟",
            items: [
              "المصممين المبتدئين",
              "صناع المحتوى الرقمي",
              "أصحاب المشاريع الصغيرة",
              "المسوقين الرقميين"
            ]
          }
        };

      case 7: // باقة ChatGPT Go
        return {
          box1: {
            title: "🤖 ما ستحصل عليه:",
            items: [
              "اشتراك ChatGPT Go لمدة 12 شهر",
              "وصول لـ GPT-5 و GPT-5.1",
              "استخدام غير محدود يومياً",
              "أولوية في الاستجابة"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "ذكاء اصطناعي متقدم",
              "إجابات أكثر دقة وتفصيلاً",
              "دعم الصور والملفات",
              "تحديثات مستمرة"
            ]
          },
          box3: {
            title: "⚡ كيفية التفعيل:",
            items: [
              "تفعيل حسابك خلال لحظات",
              "الوصول جاهز فور إتمام الدفع",
              "بيانات الحساب عبر البريد الإلكتروني"
            ]
          },
          box4: {
            title: "👥 مناسب لـ:",
            items: [
              "الطلاب والباحثين",
              "المطورين والمبرمجين",
              "كتاب المحتوى",
              "رجال الأعمال"
            ]
          }
        };

      case 8: // باقة Google Gemini Advanced
        return {
          box1: {
            title: "🧠 ما ستحصل عليه:",
            items: [
              "اشتراك Gemini Advanced لمدة 12 شهر",
              "2TB Google Drive - تخزين سحابي آمن",
              "تكامل كامل مع النظام البيئي لـ Google",
              "يعمل على جميع الأجهزة - في أي وقت ومكان"
            ]
          },
          box2: {
            title: "✨ المميزات الرئيسية:",
            items: [
              "مساعد ذكي متكامل من Gemini Advanced",
              "2TB Google Drive - سريع وآمن ومتاح دائماً",
              "تكامل كامل مع تطبيقات Google",
              "تجربة سلسة عبر جميع الأجهزة"
            ]
          },
          box3: {
            title: "🚀 كيفية التفعيل:",
            items: [
              "فتح الوصول مباشرة بعد الدفع",
              "ابدأ استكشاف Gemini فوراً",
              "بيانات الحساب عبر البريد الإلكتروني"
            ]
          },
          box4: {
            title: "👥 مناسب لـ:",
            items: [
              "محللي البيانات",
              "الباحثين الأكاديميين",
              "المسوقين الرقميين",
              "المطورين"
            ]
          }
        };

      case 9: // باقة Canva Pro
        return {
          box1: {
            title: "🎨 ما ستحصل عليه:",
            items: [
              "اشتراك Canva Pro لمدة 12 شهر",
              "وصول لملايين القوالب",
              "أدوات تصميم احترافية",
              "مكتبة صور وفيديوهات"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "قوالب حصرية متميزة",
              "إزالة خلفية الصور",
              "تصدير بجودة عالية",
              "تعاون الفريق"
            ]
          },
          box3: {
            title: "🎨 كيفية التفعيل:",
            items: [
              "تنشيط اشتراك Canva Pro مباشرة",
              "ابدأ التصميم فور التفعيل",
              "بيانات الحساب عبر البريد الإلكتروني"
            ]
          },
          box4: {
            title: "👥 مناسب لـ:",
            items: [
              "المصممين والمبدعين",
              "أصحاب الأعمال",
              "المسوقين",
              "صناع المحتوى"
            ]
          }
        };

      case 10: // باقة Netflix
        return {
          box1: {
            title: "🎬 ما ستحصل عليه:",
            items: [
              "اشتراك Netflix Premium",
              "مشاهدة بجودة 4K",
              "4 شاشات متزامنة",
              "محتوى عربي وعالمي"
            ]
          },
          box2: {
            title: "✨ مميزات الباقة:",
            items: [
              "أفلام ومسلسلات حصرية",
              "محتوى أطفال آمن",
              "تحميل للمشاهدة بدون إنترنت",
              "دعم جميع الأجهزة"
            ]
          },
          box3: {
            title: "🎬 كيفية التفعيل:",
            items: [
              "تفعيل حساب المشاهدة فور الدفع",
              "جاهز للبدء خلال لحظات",
              "بيانات الحساب عبر البريد الإلكتروني"
            ]
          },
          box4: {
            title: "👥 مناسب لـ:",
            items: [
              "العائلات",
              "عشاق الأفلام والمسلسلات",
              "الأطفال والمراهقين",
              "محبي المحتوى العربي"
            ]
          }
        };

      default:
        return null;
    }
  };

  const boxes = getProductBoxes(productId);

  if (!boxes) {
    return null;
  }

  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        تفاصيل المنتج
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* البوكس الأول */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4 hover:shadow-lg transition-shadow">
          <h4 className="text-blue-600 dark:text-blue-400 font-bold mb-3 text-sm">
            {boxes.box1.title}
          </h4>
          <ul className="space-y-2">
            {boxes.box1.items.map((item, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 text-xs flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* البوكس الثاني */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4 hover:shadow-lg transition-shadow">
          <h4 className="text-purple-600 dark:text-purple-400 font-bold mb-3 text-sm">
            {boxes.box2.title}
          </h4>
          <ul className="space-y-2">
            {boxes.box2.items.map((item, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 text-xs flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* البوكس الثالث */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4 hover:shadow-lg transition-shadow">
          <h4 className="text-green-600 dark:text-green-400 font-bold mb-3 text-sm">
            {boxes.box3.title}
          </h4>
          <ul className="space-y-2">
            {boxes.box3.items.map((item, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 text-xs flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* البوكس الرابع */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4 hover:shadow-lg transition-shadow">
          <h4 className="text-orange-600 dark:text-orange-400 font-bold mb-3 text-sm">
            {boxes.box4.title}
          </h4>
          <ul className="space-y-2">
            {boxes.box4.items.map((item, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 text-xs flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionBoxes;
