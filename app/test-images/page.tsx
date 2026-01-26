'use client';

import { useState } from 'react';

export default function TestImagesPage() {
  const [imageStatus, setImageStatus] = useState<{[key: string]: string}>({});

  const testImages = [
    {
      name: 'Netflix Subscription',
      path: '/images/products/netflix-subscription.jpg'
    },
    {
      name: 'Canva Subscription', 
      path: '/images/products/canva-subscription.jpg'
    },
    {
      name: 'ChatGPT Subscription',
      path: '/images/products/chatgpt5-subscription.jpg'
    },
    {
      name: 'Placeholder',
      path: '/placeholder.jpg'
    },
    {
      name: 'Placeholder SVG',
      path: '/placeholder.svg'
    }
  ];

  const handleImageLoad = (path: string) => {
    setImageStatus(prev => ({ ...prev, [path]: 'success' }));
    console.log('✅ Image loaded successfully:', path);
  };

  const handleImageError = (path: string) => {
    setImageStatus(prev => ({ ...prev, [path]: 'error' }));
    console.error('❌ Image failed to load:', path);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'تم التحميل ✅';
      case 'error': return 'فشل التحميل ❌';
      default: return 'جاري التحميل...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          اختبار صور المنتجات 🖼️
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testImages.map((image, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-center">
                {image.name}
              </h3>
              
              <div className="relative aspect-square mb-4 bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={`${image.path}?v=${Date.now()}`}
                  alt={image.name}
                  className="w-full h-full object-contain"
                  onLoad={() => handleImageLoad(image.path)}
                  onError={() => handleImageError(image.path)}
                />
              </div>
              
              <div className="space-y-2">
                <div className={`text-center py-2 px-4 rounded-lg text-white font-semibold ${getStatusColor(imageStatus[image.path] || 'loading')}`}>
                  {getStatusText(imageStatus[image.path] || 'loading')}
                </div>
                
                <div className="text-xs text-gray-400 break-all text-center">
                  {image.path}
                </div>
                
                <button
                  onClick={() => window.open(image.path, '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  فتح الصورة في تبويب جديد
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">معلومات إضافية:</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• جميع الصور موجودة في مجلد <code className="bg-gray-700 px-2 py-1 rounded">public/images/products/</code></li>
            <li>• يتم إضافة timestamp لتجنب مشاكل الـ cache</li>
            <li>• تحقق من Console للحصول على تفاصيل أكثر</li>
            <li>• إذا فشل تحميل صورة، تحقق من وجود الملف في المجلد</li>
          </ul>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

