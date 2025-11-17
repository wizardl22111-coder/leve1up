'use client';

import { useState } from 'react';
import { 
  Download, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

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

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-900/20 border-green-700/30';
      case 'pending':
      case 'processing':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30';
      case 'failed':
      case 'cancelled':
        return 'text-red-400 bg-red-900/20 border-red-700/30';
      case 'refunded':
        return 'text-blue-400 bg-blue-900/20 border-blue-700/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-700/30';
    }
  };

  const isDownloadExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry(order.download_expires_at);

  return (
    <div className="bg-dark-400 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">
                طلب #{order.order_id.split('-')[1]}
              </h3>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.payment_status)}`}>
                {getStatusIcon(order.payment_status)}
                {getStatusText(order.payment_status)}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(order.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                {order.payment_method === 'ziina' ? 'Ziina' : 
                 order.payment_method === 'free' ? 'مجاني' : order.payment_method}
              </div>
              {order.products.length > 1 && (
                <div className="text-primary-400">
                  {order.products.length} منتجات
                </div>
              )}
            </div>
          </div>
          
          <div className="text-left">
            <div className="text-2xl font-bold text-primary-400 mb-1">
              {order.total_amount === 0 ? 'مجاني' : formatPrice(order.total_amount, order.currency)}
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm"
            >
              {expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Product Preview */}
        {!expanded && order.products.length === 1 && (
          <div className="bg-dark-300 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">
                  {order.products[0].product_name}
                </h4>
                <div className="text-sm text-gray-400">
                  {order.products[0].price === 0 ? 'مجاني' : formatPrice(order.products[0].price, order.products[0].currency)}
                </div>
              </div>
              
              {order.payment_status === 'completed' && (
                <div className="flex items-center gap-2">
                  {isDownloadExpired(order.download_expires_at) ? (
                    <div className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      انتهت الصلاحية
                    </div>
                  ) : (
                    <a
                      href={order.products[0].download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
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
        )}

        {/* Expanded Details */}
        {expanded && (
          <div className="space-y-4">
            {/* Products List */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">المنتجات:</h4>
              {order.products.map((product, index) => (
                <div key={index} className="bg-dark-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-white mb-1">
                        {product.product_name}
                      </h5>
                      <div className="text-sm text-gray-400">
                        {product.price === 0 ? 'مجاني' : formatPrice(product.price, product.currency)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ملف: {product.filename}
                      </div>
                    </div>
                    
                    {order.payment_status === 'completed' && (
                      <div className="flex items-center gap-2">
                        {isDownloadExpired(order.download_expires_at) ? (
                          <div className="flex items-center gap-1 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            انتهت الصلاحية
                          </div>
                        ) : (
                          <a
                            href={product.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
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

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-300 rounded-lg p-4">
                <h5 className="font-semibold text-white mb-2">تفاصيل الطلب</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">رقم الطلب:</span>
                    <span className="text-white font-mono">{order.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">تاريخ الإنشاء:</span>
                    <span className="text-white">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">آخر تحديث:</span>
                    <span className="text-white">{formatDate(order.updated_at)}</span>
                  </div>
                  {order.payment_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">معرف الدفع:</span>
                      <span className="text-white font-mono text-xs">{order.payment_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {order.download_expires_at && (
                <div className="bg-dark-300 rounded-lg p-4">
                  <h5 className="font-semibold text-white mb-2">صلاحية التحميل</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">تنتهي في:</span>
                      <span className="text-white">{formatDate(order.download_expires_at)}</span>
                    </div>
                    {daysUntilExpiry !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">المتبقي:</span>
                        <span className={`font-semibold ${
                          daysUntilExpiry < 0 ? 'text-red-400' : 
                          daysUntilExpiry <= 2 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {daysUntilExpiry < 0 ? 'انتهت الصلاحية' : 
                           daysUntilExpiry === 0 ? 'ينتهي اليوم' :
                           `${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'يوم' : 'أيام'}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <h5 className="font-semibold text-blue-300 mb-2">ملاحظات</h5>
                <p className="text-blue-200 text-sm">{order.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Download Expiry Warning */}
        {!expanded && order.download_expires_at && order.payment_status === 'completed' && daysUntilExpiry !== null && daysUntilExpiry <= 2 && daysUntilExpiry >= 0 && (
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>
                تنبيه: ينتهي التحميل خلال {daysUntilExpiry === 0 ? 'اليوم' : `${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'يوم' : 'أيام'}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

