import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "ما الفرق بين Nitro Premium و Nitro Basic / Classic؟",
    answer: `Nitro Premium هو النسخة الأقوى ويشمل:

• رفع 500MB
• بث HD
• 2 Boosts
• Super Reactions
• تخصيص كامل للملف الشخصي
• مزايا إضافية داخل الخوادم

أما Nitro Basic / Classic فهو إصدار محدود:

• رفع 50MB
• بدون Boosts
• بدون بث عالي الدقة
• مزايا أقل بشكل واضح

الخلاصة: Nitro Premium هو أعلى خطة نيترو في ديسكورد.`
  },
  {
    question: "هل يمكنني تفعيل Nitro Premium إذا كان لدي اشتراك نشط؟",
    answer: `إذا اشتريت اشتراك لمدة سنة (كود أو رابط)، سيتم إضافته فوق اشتراكك الحالي سواء كان اشتراكك الحالي Classic أو Premium.

بالنسبة لاشتراك 3 شهور التجريبي، يجب أن يكون الحساب جديدًا أو لم يسبق له تفعيل أي اشتراك (مجاني أو مدفوع).`
  },
  {
    question: "هل أحتاج لمشاركة معلومات حسابي؟",
    answer: "لا، لا نطلب أي معلومات دخول. تستلم الكود وتفعّله بنفسك."
  },
  {
    question: "متى سأستلم الكود؟",
    answer: "بعد إتمام الدفع، سيتم تسليم الكود عبر الشات المباشر داخل صفحة الطلب."
  },
  {
    question: "ماذا أفعل إذا واجهت مشكلة أثناء التفعيل؟",
    answer: "قدّم فيديو كامل يوضح عملية التفعيل منذ رؤية الكود لأول مرة."
  },
  {
    question: "هل يجب تفعيل الكود مباشرة؟",
    answer: "نعم، لتجنب انتهاء الصلاحية أو ظهور أي قيود."
  },
  {
    question: "ما سياسة الاسترجاع؟",
    answer: "يتم التعويض فقط إذا كان الكود غير صالح نهائيًا مع تقديم الأدلة المطلوبة."
  },
  {
    question: "هل يعمل عالميًا؟",
    answer: "نعم، يعمل على جميع المناطق والدول."
  },
  {
    question: "هل يوجد ضمان؟",
    answer: "نعم، ضمان كامل طوال مدة الاشتراك."
  }
];

export default function DiscordNitroFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="bg-gradient-to-br from-dark-400 to-dark-500 rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-xl">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          الأسئلة الشائعة (FAQ)
        </h3>
        <p className="text-gray-400 text-sm sm:text-base">
          إجابات على أهم الأسئلة حول اشتراك ديسكورد نيترو
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-dark-300/50 rounded-xl border border-gray-600/30 overflow-hidden transition-all duration-300 hover:border-primary-300/50"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 sm:px-6 py-4 text-right flex items-center justify-between hover:bg-dark-300/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-primary-300 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-white text-right flex-1">
                {item.question}
              </h4>
            </button>
            
            {openItems.includes(index) && (
              <div className="px-4 sm:px-6 pb-4 pt-0">
                <div className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line text-right">
                  {item.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary-300/10 to-accent-600/10 rounded-xl border border-primary-300/20">
        <p className="text-primary-300 text-sm sm:text-base text-center">
          💬 لديك سؤال آخر؟ تواصل معنا عبر الشات المباشر وسنجيب فوراً!
        </p>
      </div>
    </div>
  );
}
