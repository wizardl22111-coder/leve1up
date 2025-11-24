'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  image: string;
}

interface ImageStatus {
  [key: number]: 'loading' | 'success' | 'error';
}

export default function ImageTest() {
  const [imageStatus, setImageStatus] = useState<ImageStatus>({});
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [timestamp, setTimestamp] = useState('');

  const products: Product[] = [
    {
      id: 1,
      name: "الدليل التمهيدي للربح من المنتجات الرقمية",
      image: "/images/products/introductory-guide.png"
    },
    {
      id: 2,
      name: "خطة بناء مشروعك الرقمي من الصفر",
      image: "/images/products/digital-products-profit.jpg"
    },
    {
      id: 3,
      name: "15 فكرة مشروع مربحة يمكنك تنفيذها اليوم",
      image: "/images/products/15-project-ideas.jpg"
    },
    {
      id: 4,
      name: "حزمة المونتاج الاحترافية",
      image: "/images/products/ultimate-video-editing-pack.png"
    },
    {
      id: 5,
      name: "حزمة الأيقونات المتحركة",
      image: "/images/products/animated-icons-pack.png"
    },
    {
      id: 6,
      name: "حزمة المحتوى التصميمي",
      image: "/images/products/design-content-pack.png"
    },
    {
      id: 7,
      name: "اشتراك ChatGPT Plus",
      image: "/images/products/chatgpt5-subscription.jpg"
    },
    {
      id: 8,
      name: "اشتراك Gemini Pro",
      image: "/images/products/gemini-pro-subscription.jpg"
    },
    {
      id: 9,
      name: "اشتراك Canva Pro",
      image: "/images/products/canva-subscription.jpg"
    },
    {
      id: 10,
      name: "اشتراك Netflix",
      image: "/images/products/netflix-subscription.jpg"
    }
  ];

  useEffect(() => {
    // تهيئة حالة الصور
    const initialStatus: ImageStatus = {};
    products.forEach(product => {
      initialStatus[product.id] = 'loading';
    });
    setImageStatus(initialStatus);
    setTimestamp(new Date().toLocaleString('ar-SA'));
  }, []);

  const handleImageLoad = (productId: number, imagePath: string) => {
    console.log('✅ ImageTest - Image loaded:', imagePath);
    setImageStatus(prev => ({ ...prev, [productId]: 'success' }));
    setSuccessCount(prev => prev + 1);
  };

  const handleImageError = (productId: number, imagePath: string) => {
    console.error('❌ ImageTest - Image failed:', imagePath);
    setImageStatus(prev => ({ ...prev, [productId]: 'error' }));
    setErrorCount(prev => prev + 1);
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
      case 'success': return '✅ تم تحميل الصورة بنجاح';
      case 'error': return '❌ فشل في تحميل الصورة';
      default: return '⏳ جاري التحميل...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 p-6 bg-gray-800 rounded-xl">
          <h1 className="text-3xl font-bold mb-4">🖼️ اختبار الصور - Level Up (React محدث)</h1>
          <p className="text-gray-300 mb-2">هذه الصفحة تختبر جميع الصور باستخدام React و Next.js</p>
          <p className="text-sm text-gray-400">
            <strong>التحديث:</strong> {timestamp}
          </p>
          <div className="mt-4 p-3 bg-blue-900/50 rounded-lg">
            <p className="text-sm text-blue-200">
              🔗 <strong>الرابط:</strong> /test-images
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{products.length}</div>
            <div className="text-sm text-gray-400">إجمالي الصور</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{successCount}</div>
            <div className="text-sm text-gray-400">تم تحميلها</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{errorCount}</div>
            <div className="text-sm text-gray-400">فشل التحميل</div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative h-48 mb-4 bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={`${product.image}?v=${Date.now()}`}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  style={{ 
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1
                  }}
                  onLoad={() => handleImageLoad(product.id, product.image)}
                  onError={(e) => {
                    handleImageError(product.id, product.image);
                    e.currentTarget.style.backgroundColor = '#374151';
                    e.currentTarget.style.border = '2px dashed #6b7280';
                  }}
                />
              </div>

              {/* Product Name */}
              <h3 className="text-lg font-bold mb-3 text-white">
                {product.name}
              </h3>

              {/* Image Path */}
              <div className="text-xs text-gray-400 bg-gray-900 p-2 rounded mb-3 break-all">
                {product.image}
              </div>

              {/* Status */}
              <div className={`text-xs font-bold px-3 py-2 rounded text-white ${getStatusColor(imageStatus[product.id] || 'loading')}`}>
                {getStatusText(imageStatus[product.id] || 'loading')}
              </div>
            </div>
          ))}
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-bold mb-2">🔍 معلومات التشخيص</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• تم إنشاء الصفحة باستخدام Next.js 14 و React</p>
            <p>• تم إضافة cache busting باستخدام timestamp</p>
            <p>• تم إضافة معالجات onLoad و onError</p>
            <p>• تم إضافة console logging للتشخيص</p>
            <p>• جميع الصور موجودة في مجلد public/images/products/</p>
            <p>• تم إضافة inline styles لضمان الرؤية</p>
          </div>
        </div>

        {/* File List */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-bold mb-2">📁 قائمة الملفات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between p-2 bg-gray-900 rounded">
                <span>{product.image.split('/').pop()}</span>
                <span className={`px-2 py-1 rounded ${getStatusColor(imageStatus[product.id] || 'loading')}`}>
                  {imageStatus[product.id] || 'loading'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
