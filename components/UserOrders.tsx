'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Download, 
  Calendar, 
  CreditCard, 
  Hash, 
  CheckCircle, 
  Clock, 
  XCircle,
  ShoppingBag,
  FileText
} from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
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
}

interface UserOrdersProps {
  className?: string;
}

export default function UserOrders({ className = '' }: UserOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/orders');
      
      if (!response.ok) {
        throw new Error('فشل في جلب الطلبات');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
      setError('حدث خطأ في جلب الطلبات');
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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleDownload = (order: Order, item: OrderItem) => {
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
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            طلباتي
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-700/50 rounded-lg h-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            طلباتي
          </h3>
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <motion.div 
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-400" />
          طلباتي
          {orders.length > 0 && (
            <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
              {orders.length}
            </span>
          )}
        </h3>

        {orders.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-300 mb-2">
              لا يوجد أي طلبات حتى الآن
            </h4>
            <p className="text-slate-400 mb-6">
              ابدأ بتصفح منتجاتنا واشترِ أول منتج لك!
            </p>
            <motion.a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-4 h-4" />
              تصفح المنتجات
            </motion.a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  className="bg-slate-700/30 rounded-lg border border-slate-600/30 p-4 hover:bg-slate-700/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {order.amount === 0 ? 'مجاني' : `${order.amount} ${order.currency}`}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg">
                        {/* Product Image */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-600/50 flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate mb-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>الكمية: {item.quantity}</span>
                            <span>السعر: {item.price === 0 ? 'مجاني' : `${item.price} ${order.currency}`}</span>
                          </div>
                        </div>

                        {/* Download Button */}
                        <motion.button
                          onClick={() => handleDownload(order, item)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                            ['paid', 'completed'].includes(order.status) || order.amount === 0
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25'
                              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                          }`}
                          whileHover={['paid', 'completed'].includes(order.status) || order.amount === 0 ? { scale: 1.05 } : {}}
                          whileTap={['paid', 'completed'].includes(order.status) || order.amount === 0 ? { scale: 0.95 } : {}}
                          disabled={!['paid', 'completed'].includes(order.status) && order.amount > 0}
                        >
                          <Download className="w-4 h-4" />
                          تحميل
                        </motion.button>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="mt-4 pt-4 border-t border-slate-600/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Hash className="w-4 h-4" />
                        <span>رقم الطلب: {order.id.slice(-8)}</span>
                      </div>
                      {order.paymentId && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <CreditCard className="w-4 h-4" />
                          <span>رقم الدفع: {order.paymentId.slice(-8)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
