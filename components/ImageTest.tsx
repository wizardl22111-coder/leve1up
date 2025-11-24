'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const testImages = [
  { name: 'ChatGPT Subscription', src: '/images/products/chatgpt5-subscription.jpg' },
  { name: 'Gemini Pro Subscription', src: '/images/products/gemini-pro-subscription.jpg' },
  { name: 'Canva Subscription', src: '/images/products/canva-subscription.jpg' },
  { name: 'Netflix Subscription', src: '/images/products/netflix-subscription.jpg' },
  { name: 'Digital Products Profit', src: '/images/products/digital-products-profit.jpg' },
  { name: '15 Project Ideas', src: '/images/products/15-project-ideas.jpg' },
  { name: 'Introductory Guide', src: '/images/products/introductory-guide.png' },
  { name: 'Animated Icons Pack', src: '/images/products/animated-icons-pack.png' },
  { name: 'Design Content Pack', src: '/images/products/design-content-pack.png' },
  { name: 'Ultimate Video Editing Pack', src: '/images/products/ultimate-video-editing-pack.png' }
];

export default function ImageTest() {
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  useEffect(() => {
    // تهيئة حالة الصور
    const initialStatus: Record<string, 'loading' | 'success' | 'error'> = {};
    testImages.forEach(img => {
      initialStatus[img.src] = 'loading';
    });
    setImageStatus(initialStatus);
  }, []);

  const handleImageLoad = (src: string) => {
    setImageStatus(prev => ({ ...prev, [src]: 'success' }));
  };

  const handleImageError = (src: string) => {
    setImageStatus(prev => ({ ...prev, [src]: 'error' }));
  };

  return (
    <div className="p-8 bg-dark-400 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        🔍 اختبار صور المنتجات
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testImages.map((img, index) => (
          <div key={index} className="bg-dark-300 rounded-lg p-4 border border-gray-600">
            <h3 className="text-white font-semibold mb-3">{img.name}</h3>
            
            {/* Next.js Image */}
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">Next.js Image:</p>
              <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.name}
                  fill
                  className="object-contain"
                  onLoad={() => handleImageLoad(img.src)}
                  onError={() => handleImageError(img.src)}
                />
              </div>
            </div>

            {/* Regular img tag */}
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">Regular img:</p>
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-40 object-contain bg-gray-100 rounded"
                onLoad={() => console.log(`Regular img loaded: ${img.src}`)}
                onError={() => console.log(`Regular img error: ${img.src}`)}
              />
            </div>

            {/* Status */}
            <div className="text-sm">
              <span className="text-gray-400">Status: </span>
              {imageStatus[img.src] === 'loading' && (
                <span className="text-yellow-400">⏳ جاري التحميل...</span>
              )}
              {imageStatus[img.src] === 'success' && (
                <span className="text-green-400">✅ تم التحميل بنجاح</span>
              )}
              {imageStatus[img.src] === 'error' && (
                <span className="text-red-400">❌ فشل التحميل</span>
              )}
            </div>

            {/* File path */}
            <p className="text-xs text-gray-500 mt-2 break-all">{img.src}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-dark-300 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">📊 ملخص النتائج</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-yellow-400 text-2xl font-bold">
              {Object.values(imageStatus).filter(status => status === 'loading').length}
            </p>
            <p className="text-gray-400">جاري التحميل</p>
          </div>
          <div>
            <p className="text-green-400 text-2xl font-bold">
              {Object.values(imageStatus).filter(status => status === 'success').length}
            </p>
            <p className="text-gray-400">نجح التحميل</p>
          </div>
          <div>
            <p className="text-red-400 text-2xl font-bold">
              {Object.values(imageStatus).filter(status => status === 'error').length}
            </p>
            <p className="text-gray-400">فشل التحميل</p>
          </div>
        </div>
      </div>
    </div>
  );
}
