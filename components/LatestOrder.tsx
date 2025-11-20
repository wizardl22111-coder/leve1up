'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface LatestOrderData {
  id: string;
  sessionId?: string;
  paymentId?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'completed';
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  items: OrderItem[];
  createdAt: string;
  paidAt?: string;
  // ملاحظة: orderNumber غير موجود هنا عمداً (للملف الشخصي)
}

interface LatestOrderProps {
  className?: string;
}

export default function LatestOrder({ className = '' }: LatestOrderProps) {
  const [order, setOrder] = useState<LatestOrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestOrder();
  }, []);

  const fetchLatestOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/orders/latest');
      
      if (!response.ok) {
        throw new Error('فشل في جلب آخر طلب');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('خطأ في جلب آخر طلب:', error);
      setError('حدث خطأ في جلب آخر طلب');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
      case 'refunded':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'مدفوع';
      case 'pending':
        return 'قيد الانتظار';
      case 'failed':
        return 'فشل';
      case 'refunded':
        return 'مسترد';
      default:
        return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
      case 'refunded':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number, currency: string = 'AED') => {
    return `${price.toFixed(2)} ${currency}`;
  };

  const handleDownload = (item: OrderItem) => {
    if (!order) return;
    
    // التحقق من حالة الطلب
    if (!['paid', 'completed'].includes(order.status) && order.amount > 0) {
      alert('لا يمكن تحميل المنتج. الطلب غير مدفوع.');
      return;
    }

    // إنشاء رابط التحميل
    const downloadUrl = `/api/download/${order.sessionId || order.id}?product=${item.id}`;
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded"></div>
              <div className="h-6 bg-slate-700 rounded w-32"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-20 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-red-500/30 p-6">
          <div className="text-center text-red-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`${className}`}>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            آخر طلب
          </h3>
          
          <div className="text-center py-8">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-4">لا توجد طلبات سابقة</p>
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all duration-300"
            >
              تصفح المنتجات
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            آخر طلب
          </h3>
          
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {getStatusText(order.status)}
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 mb-1">تاريخ الطلب</p>
              <p className="text-sm text-white">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 mb-1">المبلغ الإجمالي</p>
              <p className="text-sm text-white font-semibold">
                {formatPrice(order.amount, order.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300 mb-3">المنتجات ({order.items.length})</h4>
          
          {order.items.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/40 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Product Image */}
              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-6 h-6 text-slate-400" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h5 className="text-white font-medium text-sm mb-1">{item.name}</h5>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>الكمية: {item.quantity}</span>
                  <span>السعر: {formatPrice(item.price, order.currency)}</span>
                </div>
              </div>

              {/* Download Button */}
              {(['paid', 'completed'].includes(order.status) || order.amount === 0) && (
                <motion.button
                  onClick={() => handleDownload(item)}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 rounded-lg border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  تحميل
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        {/* View All Orders Link */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <Link 
            href="/profile?tab=orders"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
          >
            عرض جميع الطلبات
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

