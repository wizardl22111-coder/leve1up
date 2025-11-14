'use client';

import React, { useState } from 'react';
import AnimatedSearchInput from '@/components/AnimatedSearchInput';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SearchDemoPage = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log('البحث عن:', query);
    // محاكاة نتائج البحث
    if (query.trim()) {
      const mockResults = [
        `نتيجة البحث 1 لـ "${query}"`,
        `نتيجة البحث 2 لـ "${query}"`,
        `نتيجة البحث 3 لـ "${query}"`,
      ];
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleFilter = () => {
    setFilterOpen(!filterOpen);
    console.log('فتح الفلتر:', !filterOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🔍 تجربة مكون البحث المتحرك
            </h1>
            <p className="text-slate-300 text-lg">
              مكون بحث متطور مع تأثيرات بصرية جميلة مناسبة لمتجر Leve1UP
            </p>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowRight size={20} />
            العودة للرئيسية
          </Link>
        </div>

        {/* Search Component Demo */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              جرب البحث المتحرك
            </h2>
            <p className="text-slate-400">
              اكتب أي شيء في مربع البحث وشاهد التأثيرات الجميلة
            </p>
          </div>

          {/* Animated Search Input */}
          <AnimatedSearchInput
            placeholder="ابحث عن المنتجات الرقمية..."
            onSearch={handleSearch}
            onFilter={handleFilter}
            className="mb-8"
          />

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">نتائج البحث:</h3>
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li 
                    key={index}
                    className="text-slate-300 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filter Status */}
          {filterOpen && (
            <div className="mt-4 bg-accent-600/20 border border-accent-500/30 text-accent-300 px-4 py-2 rounded-lg">
              🎛️ الفلتر مفتوح - يمكنك إضافة خيارات الفلترة هنا
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <div className="text-primary-400 text-2xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-white mb-2">تأثيرات بصرية</h3>
            <p className="text-slate-400">
              تأثيرات متحركة جميلة مع ألوان متناسقة مع هوية المتجر
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <div className="text-accent-400 text-2xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-white mb-2">ألوان مخصصة</h3>
            <p className="text-slate-400">
              ألوان معدلة خصيصاً لتتناسب مع متجر Leve1UP Store
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <div className="text-green-400 text-2xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">سريع الاستجابة</h3>
            <p className="text-slate-400">
              مُحسّن للأداء مع استجابة فورية للكتابة والتفاعل
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <div className="text-blue-400 text-2xl mb-3">📱</div>
            <h3 className="text-lg font-semibold text-white mb-2">متجاوب</h3>
            <p className="text-slate-400">
              يعمل بشكل مثالي على جميع الأجهزة والشاشات
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <div className="text-purple-400 text-2xl mb-3">🔧</div>
            <h3 className="text-lg font-semibold text-white mb-2">قابل للتخصيص</h3>
            <p className="text-slate-400">
              يمكن تخصيص النصوص والوظائف حسب الحاجة
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <div className="text-yellow-400 text-2xl mb-3">🌟</div>
            <h3 className="text-lg font-semibold text-white mb-2">تجربة مميزة</h3>
            <p className="text-slate-400">
              يوفر تجربة مستخدم مميزة وجذابة للزوار
            </p>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-16 bg-slate-800/30 backdrop-blur-sm p-8 rounded-lg border border-slate-700">
          <h3 className="text-2xl font-semibold text-white mb-6">كيفية الاستخدام:</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-primary-400 mb-3">1. استيراد المكون</h4>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                <code className="text-green-400 text-sm">
                  import AnimatedSearchInput from '@/components/AnimatedSearchInput';
                </code>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-primary-400 mb-3">2. استخدام المكون</h4>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                <code className="text-green-400 text-sm">
                  {`<AnimatedSearchInput
  placeholder="البحث..."
  onSearch={handleSearch}
  onFilter={handleFilter}
/>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDemoPage;
