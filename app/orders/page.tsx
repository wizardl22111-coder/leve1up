"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Package, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Mail, 
  CreditCard, 
  Home,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
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
  downloadUrl?: string;
  downloadExpiry?: number;
  createdAt: string;
  paidAt?: string;
}

export default function OrdersPage() {
  const [searchType, setSearchType] = useState<'email' | 'orderId' | 'paymentId'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError('الرجاء إدخال قيمة البحث');
      return;
    }

    setLoading(true);
    setError('');
    setOrders([]);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      params.set(searchType, searchValue);

      console.log('🔍 Searching with params:', params.toString());
      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();

      console.log('📊 API Response:', data);

      if (!response.ok) {
        setError(data.message || 'حدث خطأ أثناء البحث');
        setOrders([]);
        return;
      }

      // إذا كان البحث برقم الطلب أو الدفعة، نحصل على طلب واحد
      if (data.order) {
        setOrders([data.order]);
      } else if (data.orders) {
        setOrders(data.orders);
      }

    } catch (err: any) {
      setError('فشل الاتصال بالخادم');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return {
          label: 'مدفوع',
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-300/30',
        };
      case 'pending':
        return {
          label: 'قيد الانتظار',
          icon: <Clock className="w-5 h-5" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-300/30',
        };
      case 'failed':
        return {
          label: 'فاشل',
          icon: <XCircle className="w-5 h-5" />,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-300/30',
        };
      case 'refunded':
        return {
          label: 'مسترجع',
          icon: <RefreshCw className="w-5 h-5" />,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-300/30',
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const isDownloadExpired = (expiry?: number) => {
    if (!expiry) return false;
    return Date.now() > expiry;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-purple-500/20 backdrop-blur-lg rounded-full mb-6"
          >
            <Package className="w-12 h-12 text-purple-300" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            طلباتي 📦
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            ابحث عن طلباتك وحمّل منتجاتك الرقمية
          </motion.p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Type Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1 bg-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSearchType('email')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    searchType === 'email'
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('orderId')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    searchType === 'orderId'
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  رقم الطلب
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('paymentId')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    searchType === 'paymentId'
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  رقم الدفعة
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchType === 'email'
                      ? 'أدخل بريدك الإلكتروني'
                      : searchType === 'orderId'
                      ? 'أدخل رقم الطلب'
                      : 'أدخل رقم الدفعة'
                  }
                  className="w-full px-6 py-4 pr-12 rounded-xl bg-white/10 border border-white/30 focus:border-white/50 focus:outline-none transition-colors text-right text-white placeholder-white/50 backdrop-blur-lg"
                  dir="rtl"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري البحث...
                  </span>
                ) : (
                  'بحث عن الطلبات'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-300/30 rounded-lg text-red-300 text-right backdrop-blur-lg"
              >
                {error}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Results */}
        {searched && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {orders.length === 0 && !error ? (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <Package className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/80 text-lg">لم يتم العثور على أي طلبات</p>
                  <p className="text-white/60 text-sm mt-2">تأكد من صحة البيانات المدخلة</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-right mb-6">
                  النتائج ({orders.length})
                </h2>

                {orders.map((order, index) => {
                  const statusInfo = getStatusInfo(order.status);
                  const downloadExpired = isDownloadExpired(order.downloadExpiry);

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300"
                    >
                      {/* Order Header */}
                      <div className="bg-gradient-to-r from-white/10 to-white/5 p-6 border-b border-white/20">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                              <div className={statusInfo.color}>
                                {statusInfo.icon}
                              </div>
                            </div>
                            <div className="text-right">
                              <h3 className="font-bold text-white text-lg">
                                طلب #{order.id.substring(order.id.length - 8)}
                              </h3>
                              <p className="text-white/60 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                            <span className={`font-bold ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          {/* Customer Info */}
                          <div className="text-right">
                            <h4 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              معلومات العميل
                            </h4>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <p className="text-white font-medium mb-1">
                                {order.customerName || 'غير محدد'}
                              </p>
                              <p className="text-white/70 text-sm flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {order.customerEmail || 'غير محدد'}
                              </p>
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div className="text-right">
                            <h4 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              معلومات الدفع
                            </h4>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <p className="text-2xl font-bold text-green-300 mb-1">
                                {formatPrice(order.amount, order.currency)}
                              </p>
                              <p className="text-white/60 text-sm font-mono">
                                {order.paymentId || order.sessionId || 'غير محدد'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        {order.items && order.items.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-white/60 mb-3 text-right flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              المنتجات ({order.items.length})
                            </h4>
                            <div className="space-y-3">
                              {order.items.map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10"
                                >
                                  <div className="text-right flex-1">
                                    <p className="font-medium text-white mb-1">
                                      {item.name}
                                    </p>
                                    <p className="text-sm text-white/60">
                                      الكمية: {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold text-blue-300">
                                      {formatPrice(item.price, order.currency)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Download Button */}
                        {order.downloadUrl && (order.status === 'paid' || order.status === 'completed') && (
                          <div className="pt-6 border-t border-white/20">
                            {downloadExpired ? (
                              <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-300/30">
                                <p className="text-red-300 font-medium">
                                  ⚠️ انتهت صلاحية رابط التحميل
                                </p>
                                <p className="text-sm text-red-300/80 mt-1">
                                  الرجاء التواصل مع الدعم للحصول على رابط جديد
                                </p>
                              </div>
                            ) : (
                              <a
                                href={order.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                <Download className="w-5 h-5" />
                                تحميل المنتج
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Info Section */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <div className="bg-blue-500/20 border border-blue-300/30 rounded-2xl p-6 text-right backdrop-blur-lg">
              <h3 className="font-bold text-blue-300 mb-4 text-lg">💡 كيفية البحث</h3>
              <ul className="space-y-3 text-blue-200">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                  <span>استخدم بريدك الإلكتروني الذي استخدمته عند الدفع</span>
                </li>
                <li className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                  <span>أو أدخل رقم الطلب الذي حصلت عليه</span>
                </li>
                <li className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                  <span>أو أدخل رقم الدفعة من بوابة الدفع</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

