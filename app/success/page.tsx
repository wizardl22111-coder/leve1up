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
  ExternalLink
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderData {
  email: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  orderId?: string;
  paymentId?: string;
  createdAt?: string;
  downloadLinks?: { productId: number; productName: string; downloadUrl: string }[];
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  // رقم الواتساب
  const WHATSAPP_NUMBER = "971503492848";
  const WHATSAPP_MESSAGE = "مرحباً، لدي استفسار بخصوص طلبي";

  useEffect(() => {
    const session = searchParams.get("session");
    const payment_intent = searchParams.get("payment_intent");
    const token = searchParams.get("token");
    
    const fetchOrderData = async () => {
      try {
        const searchId = session || payment_intent;
        
        if (searchId) {
          console.log("🔍 Fetching order by ID:", searchId);
          
          try {
            const response = await fetch(`/api/orders/${searchId}`);
            
            if (response.ok) {
              const order = await response.json();
              console.log("✅ Order found from API:", order);
              
              // إنشاء روابط التحميل لكل منتج
              const downloadLinks = order.items.map((item: CartItem) => ({
                productId: item.id,
                productName: item.name,
                downloadUrl: `/api/download/${order.sessionId}?product=${item.id}`
              }));
              
              setOrderData({
                email: order.customerEmail,
                items: order.items,
                totalAmount: order.amount,
                currency: order.currency,
                orderId: order.id,
                paymentId: order.paymentId || searchId,
                createdAt: order.createdAt,
                downloadLinks
              });
              
              localStorage.removeItem('cart');
              localStorage.removeItem('customerEmail');
              localStorage.removeItem('totalAmount');
              localStorage.removeItem('currency');
              
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.log("⚠️ API fetch failed, trying localStorage fallback");
          }
        }
        
        // Fallback: جلب البيانات من localStorage
        const savedEmail = localStorage.getItem('customerEmail');
        const savedItems = localStorage.getItem('cart');
        const savedTotalAmount = localStorage.getItem('totalAmount');
        const savedCurrency = localStorage.getItem('currency');
        
        if (savedEmail && savedItems) {
          const items = JSON.parse(savedItems);
          
          try {
            const productsResponse = await fetch('/data/products.json');
            const products = await productsResponse.json();
            
            const downloadLinks = items.map((item: CartItem) => {
              const product = products.find((p: any) => 
                p.product_id === item.id || 
                p.id === item.id ||
                p.product_id === parseInt(String(item.id)) ||
                p.id === parseInt(String(item.id))
              );
              
              const correctProductId = product?.product_id || item.id;
              
              return {
                productId: correctProductId,
                productName: item.name,
                downloadUrl: product?.download_url || ''
              };
            }).filter(link => link.downloadUrl);
            
            setOrderData({
              email: savedEmail,
              items,
              totalAmount: savedTotalAmount ? parseFloat(savedTotalAmount) : 0,
              currency: savedCurrency || 'SAR',
              downloadLinks
            });
          } catch (e) {
            console.error("Error fetching products:", e);
            setOrderData({
              email: savedEmail,
              items,
              totalAmount: savedTotalAmount ? parseFloat(savedTotalAmount) : 0,
              currency: savedCurrency || 'SAR'
            });
          }
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [searchParams]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('ar-SA');
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatPrice = (amount: number, currency: string) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري تحميل تفاصيل طلبك...</p>
        </motion.div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md w-full"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">لم يتم العثور على الطلب</h2>
          <p className="text-white/80 mb-6">عذراً، لم نتمكن من العثور على تفاصيل طلبك</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  const { email, items, totalAmount, currency, orderId, paymentId, createdAt, downloadLinks } = orderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Success Header */}
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
            className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 backdrop-blur-lg rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            تم الدفع بنجاح! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            شكرًا لثقتك في <span className="text-blue-300 font-semibold">LEVEL UP</span>، تم تأكيد طلبك بنجاح.
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-300" />
              تفاصيل الطلب
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <Mail className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="text-sm text-white/60">البريد الإلكتروني</p>
                    <p className="font-medium">{email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-white/90">
                  <Calendar className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="text-sm text-white/60">تاريخ الشراء</p>
                    <p className="font-medium">{formatDate(createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <CreditCard className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="text-sm text-white/60">المبلغ المدفوع</p>
                    <p className="font-medium text-green-300">{formatPrice(totalAmount, currency)}</p>
                  </div>
                </div>
                
                {(orderId || paymentId) && (
                  <div className="flex items-center gap-3 text-white/90">
                    <Package className="w-5 h-5 text-blue-300" />
                    <div>
                      <p className="text-sm text-white/60">رقم الطلب</p>
                      <p className="font-medium font-mono text-sm">{orderId || paymentId}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products List */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">المنتجات المشتراة:</h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/5 rounded-xl p-4">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-white/60">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-blue-300">{formatPrice(item.price, currency)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Download Section */}
          {downloadLinks && downloadLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-green-300/30"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                🎁 منتجك جاهز للتحميل
              </h2>
              
              <div className="space-y-4">
                {downloadLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="bg-white/10 rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-white mb-3">{link.productName}</h3>
                    <a
                      href={link.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-5 h-5" />
                      تحميل المنتج الآن
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-sm text-white/70 mt-4 bg-yellow-500/20 rounded-lg p-3 border border-yellow-300/30"
              >
                💡 <strong>ملاحظة مهمة:</strong> احفظ الرابط في مكان آمن – صالح لمدة 7 أيام
              </motion.p>
            </motion.div>
          )}

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 text-center"
          >
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-xl font-bold text-white mb-4">
              هل واجهت مشكلة في التحميل؟ تواصل معنا فورًا.
            </h2>
            
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              تواصل عبر الواتساب
            </a>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <Home className="w-5 h-5" />
              العودة إلى الصفحة الرئيسية
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="text-center mt-16 pb-8"
        >
          <p className="text-white/70 text-lg">
            شكراً لاختيارك <span className="text-blue-300 font-semibold">LEVEL UP</span> 💚 نتمنى لك تجربة تعلم ممتعة.
          </p>
        </motion.div>
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

