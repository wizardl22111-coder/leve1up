'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle, XCircle, AlertCircle, Upload, Eye, Download } from 'lucide-react';

interface ImageStatus {
  [key: string]: 'loading' | 'success' | 'error';
}

interface ProductImage {
  id: number;
  name: string;
  image: string;
  category: string;
}

export default function ImageManager() {
  const [imageStatus, setImageStatus] = useState<ImageStatus>({});
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'loading'>('all');

  // قائمة الصور المتوقعة (من ملف المنتجات) - محدثة لتشمل جميع المنتجات
  const expectedImages: ProductImage[] = [
    { id: 1, name: "الدليل التمهيدي", image: "/images/products/introductory-guide.png", category: "ebooks" },
    { id: 2, name: "الربح من المنتجات الرقمية", image: "/images/products/digital-products-profit.jpg", category: "ebooks" },
    { id: 3, name: "15 فكرة مشروع رقمي", image: "/images/products/15-project-ideas.jpg", category: "ebooks" },
    { id: 4, name: "باقة المونتاج الاحترافية", image: "/images/products/ultimate-video-editing-pack.png", category: "editing-tools" },
    { id: 5, name: "باقة أيقونات متحركة", image: "/images/products/animated-icons-pack.png", category: "youtube-tools" },
    { id: 6, name: "باقة التصميم وصناعة المحتوى", image: "/images/products/design-content-pack.png", category: "youtube-tools" },
    { id: 7, name: "باقة ChatGPT Go", image: "/images/products/chatgpt5-subscription.jpg", category: "subscriptions" },
    { id: 8, name: "باقة Google Gemini Advanced", image: "/images/products/gemini-pro-subscription.jpg", category: "subscriptions" },
    { id: 9, name: "باقة Canva Pro", image: "/images/products/canva-subscription.jpg", category: "subscriptions" },
    { id: 10, name: "باقة Netflix", image: "/images/products/netflix-subscription.jpg", category: "subscriptions" },
    { id: 11, name: "منتج 11", image: "/images/products/product-11.png", category: "digital" },
    { id: 12, name: "منتج 12", image: "/images/products/product-12.png", category: "digital" },
    { id: 13, name: "منتج 13", image: "/images/products/product-13.png", category: "digital" },
    { id: 14, name: "Discord Nitro 12 شهر", image: "/images/products/discord-nitro-1year.png", category: "subscriptions" },
    { id: 15, name: "Discord Nitro 3 أشهر", image: "/images/products/discord-nitro-3months.png", category: "subscriptions" },
  ];

  useEffect(() => {
    setProducts(expectedImages);
    setLoading(false);
  }, []);

  const handleImageLoad = (productId: number, imagePath: string) => {
    console.log(`✅ Image loaded successfully: ${imagePath}`);
    setImageStatus(prev => ({ ...prev, [productId]: 'success' }));
  };

  const handleImageError = (productId: number, imagePath: string) => {
    console.error(`❌ Image failed to load: ${imagePath}`);
    setImageStatus(prev => ({ ...prev, [productId]: 'error' }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'loading': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'loading': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'تم التحميل';
      case 'error': return 'فشل التحميل';
      case 'loading': return 'جاري التحميل';
      default: return 'غير محدد';
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return imageStatus[product.id] === filter;
  });

  const stats = {
    total: products.length,
    success: Object.values(imageStatus).filter(status => status === 'success').length,
    error: Object.values(imageStatus).filter(status => status === 'error').length,
    loading: products.length - Object.keys(imageStatus).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">جاري تحميل بيانات الصور...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📸 مدير صور المنتجات
          </h1>
          <p className="text-gray-400 text-lg">
            فحص وإدارة صور المنتجات في متجر Leve1Up
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-400 text-sm">إجمالي الصور</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.success}</div>
            <div className="text-gray-400 text-sm">تم التحميل</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.error}</div>
            <div className="text-gray-400 text-sm">فشل التحميل</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.loading}</div>
            <div className="text-gray-400 text-sm">قيد التحميل</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'جميع الصور', count: stats.total },
            { key: 'success', label: 'تم التحميل', count: stats.success },
            { key: 'error', label: 'فشل التحميل', count: stats.error },
            { key: 'loading', label: 'قيد التحميل', count: stats.loading }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-emerald-500/50 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-video bg-slate-700/30 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onLoad={() => handleImageLoad(product.id, product.image)}
                  onError={() => handleImageError(product.id, product.image)}
                />
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs ${getStatusColor(imageStatus[product.id] || 'loading')}`}>
                    {getStatusIcon(imageStatus[product.id] || 'loading')}
                    {getStatusText(imageStatus[product.id] || 'loading')}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
                    {product.category}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                <p className="text-gray-400 text-xs font-mono">{product.image}</p>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => window.open(product.image, '_blank')}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    عرض
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = product.image;
                      link.download = product.image.split('/').pop() || 'image';
                      link.click();
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    تحميل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            إرشادات إضافة صور جديدة
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-semibold text-emerald-400 mb-2">📁 مسار الصور:</h3>
              <p className="text-sm mb-4">ضع الصور الجديدة في:</p>
              <code className="bg-slate-700/50 px-3 py-2 rounded text-xs block">
                public/images/products/new/
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-400 mb-2">📝 تحديث البيانات:</h3>
              <p className="text-sm mb-4">أضف مسار الصورة في:</p>
              <code className="bg-slate-700/50 px-3 py-2 rounded text-xs block">
                data/products.json
              </code>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 <strong>نصيحة:</strong> استخدم صور بجودة عالية (800x600 أو أكبر) وحجم أقل من 2MB للحصول على أفضل أداء.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
