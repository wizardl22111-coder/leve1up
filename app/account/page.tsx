"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  ArrowLeft,
  LogOut,
  User,
  Loader2,
  Download,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react";

interface UserSession {
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

interface Order {
  order_id: string;
  user_email: string;
  user_name?: string;
  products: {
    product_id: number;
    product_name: string;
    price: number;
    currency: string;
    download_url: string;
    filename: string;
  }[];
  total_amount: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  payment_id?: string;
  download_expires_at?: string;
  notes?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!data.isAuthenticated) {
        router.push('/login');
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'في الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'failed':
        return 'فشل';
      case 'cancelled':
        return 'ملغي';
      case 'refunded':
        return 'مسترد';
      default:
        return status;
    }
  };

  const isDownloadExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-500">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-white">جارٍ التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-500">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للقائمة الرئيسية</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-400 text-gray-300 hover:bg-dark-300'
            }`}
          >
            <User className="w-5 h-5" />
            معلومات الحساب
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-400 text-gray-300 hover:bg-dark-300'
            }`}
          >
            <Package className="w-5 h-5" />
            طلباتي ({orders.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-dark-400 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">مرحباً بك!</h3>
              <p className="text-gray-400 mb-8">تم تسجيل دخولك بنجاح</p>
              
              <div className="bg-dark-300 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <p className="text-gray-300">
                  <strong className="text-white">البريد الإلكتروني:</strong>
                  <br />
                  {user?.email}
                </p>
              </div>
              
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Package className="w-5 h-5" />
                تصفح المنتجات
              </Link>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">طلباتي</h2>
              <button
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                تحديث
              </button>
            </div>

            {ordersLoading ? (
              <div className="bg-dark-400 rounded-2xl p-8">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">جارٍ تحميل الطلبات...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-dark-400 rounded-2xl p-8 text-center">
                <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">لا توجد طلبات</h3>
                <p className="text-gray-400 mb-6">لم تقم بأي عمليات شراء بعد</p>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Package className="w-5 h-5" />
                  تصفح المنتجات
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.order_id} className="bg-dark-400 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            طلب #{order.order_id.split('-')[1]}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.payment_status)}
                            <span className="text-sm font-medium text-gray-300">
                              {getStatusText(order.payment_status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {order.payment_method === 'ziina' ? 'Ziina' : order.payment_method}
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-primary-400">
                          {formatPrice(order.total_amount, order.currency)}
                        </div>
                        {order.products.length > 1 && (
                          <div className="text-sm text-gray-400">
                            {order.products.length} منتجات
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-3 mb-4">
                      {order.products.map((product, index) => (
                        <div key={index} className="bg-dark-300 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">
                                {product.product_name}
                              </h4>
                              <div className="text-sm text-gray-400">
                                {formatPrice(product.price, product.currency)}
                              </div>
                            </div>
                            
                            {order.payment_status === 'completed' && (
                              <div className="flex items-center gap-2">
                                {isDownloadExpired(order.download_expires_at) ? (
                                  <div className="flex items-center gap-1 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    انتهت صلاحية التحميل
                                  </div>
                                ) : (
                                  <a
                                    href={product.download_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                    تحميل
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Download Expiry Info */}
                    {order.download_expires_at && order.payment_status === 'completed' && (
                      <div className="bg-dark-300 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-300">
                            {isDownloadExpired(order.download_expires_at) ? (
                              <span className="text-red-400">انتهت صلاحية التحميل</span>
                            ) : (
                              <>
                                صالح للتحميل حتى: {formatDate(order.download_expires_at)}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                        <p className="text-blue-300 text-sm">{order.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

