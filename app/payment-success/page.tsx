"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Download, 
  MessageCircle, 
  Home, 
  Calendar,
  Mail,
  CreditCard,
  Package,
  ExternalLink,
  Star,
  User,
  Send,
  ShoppingCart
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface DownloadLink {
  productId: number;
  productName: string;
  downloadUrl: string;
}

interface OrderData {
  orderId: string;
  customerEmail: string;
  cartItems: CartItem[];
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  type: string;
  downloadLinks?: DownloadLink[];
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // حالة نظام التقييم
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);



  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const type = searchParams.get("type");
    
    const fetchOrderData = async () => {
      try {
        if (!orderId) {
          throw new Error('معرف الطلب مفقود');
        }

        console.log("🔍 Fetching cart order:", orderId);
        
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات الطلب');
        }

        const result = await response.json();
        console.log("✅ API Response:", result);
        
        if (result.success && result.order) {
          const order = result.order;
          console.log("✅ Cart order found:", order);
          
          // إنشاء روابط التحميل لكل منتج في السلة
          const downloadLinks: DownloadLink[] = order.cartItems.map((item: CartItem) => ({
            productId: item.id,
            productName: item.name,
            downloadUrl: `/api/download/${orderId}?product=${encodeURIComponent(item.name)}`
          }));
          
          setOrderData({
            ...order,
            downloadLinks
          });

          // إرسال إيميل التحميل
          try {
            const emailResponse = await fetch('/api/send-download-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.orderId,
                customerEmail: order.customerEmail,
                cartItems: order.cartItems,
                totalAmount: order.totalAmount,
                currency: order.currency,
                downloadLinks: downloadLinks
              })
            });

            if (emailResponse.ok) {
              console.log('✅ Download email sent successfully');
            } else {
              console.warn('⚠️ Failed to send download email');
            }
          } catch (emailError) {
            console.error('❌ Error sending download email:', emailError);
          }

        } else {
          throw new Error('بيانات الطلب غير صحيحة');
        }
      } catch (err: any) {
        console.error("❌ Error fetching order:", err);
        setError(err.message || 'حدث خطأ في جلب بيانات الطلب');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [searchParams]);

  // دالة إرسال التقييم
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);

    try {
      // إرسال تقييم لكل منتج في السلة
      const reviewPromises = orderData?.cartItems.map(async (item) => {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.id,
            authorName: reviewData.name,
            rating: reviewData.rating,
            reviewBody: reviewData.comment,
            orderId: orderData.orderId
          })
        });
        return response.json();
      });

      if (reviewPromises) {
        const results = await Promise.all(reviewPromises);
        console.log('✅ Review submission results:', results);
        setReviewSubmitted(true);
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('❌ Error submitting review:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'AED': return 'د.إ';
      case 'SAR': return 'ر.س';
      case 'BHD': return 'د.ب';
      case 'KWD': return 'د.ك';
      case 'OMR': return 'ر.ع';
      case 'QAR': return 'ر.ق';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      default: return 'ر.س';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الطلب...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md mx-auto p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل الطلب</h1>
          <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على بيانات الطلب'}</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              تم الدفع بنجاح! 🎉
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              شكراً لك على شرائك من Leve1Up Store
            </motion.p>
          </div>

          {/* Order Details */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">تفاصيل الطلب</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">رقم الطلب:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    #{orderData.orderId}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">البريد الإلكتروني:</span>
                  <span className="text-sm">{orderData.customerEmail}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">تاريخ الطلب:</span>
                  <span className="text-sm">
                    {new Date(orderData.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">المبلغ الإجمالي:</span>
                  <span className="text-lg font-bold text-green-600">
                    {orderData.totalAmount} {getCurrencySymbol(orderData.currency)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">عدد المنتجات:</span>
                  <span className="text-sm">
                    {orderData.cartItems.reduce((total, item) => total + item.quantity, 0)} منتج
                  </span>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">المنتجات المشتراة:</h3>
              <div className="space-y-3">
                {orderData.cartItems.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {item.price * item.quantity} {getCurrencySymbol(orderData.currency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.price} {getCurrencySymbol(orderData.currency)} × {item.quantity}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Download Links */}
          {orderData.downloadLinks && orderData.downloadLinks.length > 0 && (
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">تحميل المنتجات</h2>
              </div>

              <div className="grid gap-4">
                {orderData.downloadLinks.map((link, index) => (
                  <motion.a
                    key={link.productId}
                    href={link.downloadUrl}
                    className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{link.productName}</h3>
                        <p className="text-sm text-gray-500">اضغط للتحميل</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة:</strong> تم إرسال روابط التحميل أيضاً إلى بريدك الإلكتروني: {orderData.customerEmail}
                </p>
              </div>
            </motion.div>
          )}

          {/* Review Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">قيّم تجربتك</h2>
            </div>

            {!reviewSubmitted ? (
              !showReviewForm ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    ساعدنا في تحسين خدماتنا من خلال تقييم تجربتك معنا
                  </p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    إضافة تقييم
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم
                    </label>
                    <input
                      type="text"
                      value={reviewData.name}
                      onChange={(e) => setReviewData({...reviewData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التقييم
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({...reviewData, rating: star})}
                          className={`w-8 h-8 ${
                            star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التعليق
                    </label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="شاركنا رأيك في المنتجات والخدمة..."
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {reviewLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          إرسال التقييم
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">شكراً لك!</h3>
                <p className="text-gray-600">تم إرسال تقييمك بنجاح وسيظهر قريباً في الموقع</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>

            <a
              href="mailto:leve1up999q@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              تواصل معنا
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
