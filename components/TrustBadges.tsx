'use client';

import { Shield, Lock, RefreshCw, Clock, CheckCircle, Award } from 'lucide-react';

interface TrustBadgesProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function TrustBadges({ variant = 'full', className = '' }: TrustBadgesProps) {
  const badges = [
    {
      icon: Shield,
      title: 'دفع آمن ومشفر',
      description: 'جميع المعاملات محمية بتشفير SSL 256-bit',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: RefreshCw,
      title: 'ضمان الاسترداد',
      description: 'استرداد كامل خلال 30 يوم إذا لم تكن راضياً',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Clock,
      title: 'تسليم فوري',
      description: 'احصل على منتجك فوراً عبر البريد الإلكتروني',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Award,
      title: 'جودة مضمونة',
      description: 'منتجات عالية الجودة من خبراء متخصصين',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {badges.slice(0, 2).map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg"
            >
              <Icon className={`w-4 h-4 ${badge.color}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {badge.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-4">
        🛡️ لماذا تثق بنا؟
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${badge.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {badge.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* شارة الأمان الرئيسية */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-center gap-3 text-green-800 dark:text-green-200">
          <Lock className="w-6 h-6" />
          <div className="text-center">
            <div className="font-bold text-lg">دفع آمن 100%</div>
            <div className="text-sm">محمي بواسطة تشفير SSL وبوابات دفع موثوقة</div>
          </div>
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>

      {/* شعارات بوابات الدفع */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          ندعم جميع طرق الدفع الآمنة
        </p>
        <div className="flex items-center justify-center gap-4 opacity-60">
          <div className="text-2xl">💳</div>
          <div className="text-2xl">🏦</div>
          <div className="text-2xl">📱</div>
          <div className="text-2xl">💰</div>
        </div>
      </div>
    </div>
  );
}

// مكون شارة أمان مبسطة للاستخدام في أماكن أخرى
export function SecurityBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800 ${className}`}>
      <Shield className="w-4 h-4" />
      <span className="text-sm font-semibold">دفع آمن ومشفر</span>
    </div>
  );
}

// مكون ضمان الاسترداد
export function MoneyBackGuarantee({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800 ${className}`}>
      <RefreshCw className="w-4 h-4" />
      <span className="text-sm font-semibold">ضمان الاسترداد 30 يوم</span>
    </div>
  );
}
