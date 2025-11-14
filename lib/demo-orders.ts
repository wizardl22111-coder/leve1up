/**
 * 🎭 طلبات تجريبية للاختبار
 * 
 * يستخدم لإنشاء طلبات وهمية للاختبار عندما لا يكون Redis متاح
 */

import { Order, OrderItem } from './orders-store';

// منتجات تجريبية
const demoProducts: OrderItem[] = [
  {
    id: 1,
    name: "الدليل التمهيدي للربح من المنتجات الرقمية",
    price: 29.99,
    quantity: 1,
    image: "/products/guide.jpg",
    downloadUrl: "https://example.com/download/guide.pdf"
  },
  {
    id: 2,
    name: "الربح من المنتجات الرقمية",
    price: 49.99,
    quantity: 1,
    image: "/products/course.jpg",
    downloadUrl: "https://example.com/download/course.zip"
  },
  {
    id: 3,
    name: "15 فكرة مشروع رقمي مربح",
    price: 19.99,
    quantity: 2,
    image: "/products/ideas.jpg",
    downloadUrl: "https://example.com/download/ideas.pdf"
  }
];

// إنشاء طلبات تجريبية
export function createDemoOrders(): Order[] {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "demo_order_001",
      sessionId: "demo_session_001",
      paymentId: "demo_payment_001",
      status: "completed",
      amount: 29.99,
      currency: "USD",
      customerEmail: "customer@example.com",
      customerName: "أحمد محمد",
      items: [demoProducts[0]],
      downloadUrl: "https://example.com/download/guide.pdf",
      createdAt: yesterday.toISOString(),
      paidAt: yesterday.toISOString(),
      metadata: {
        demo: true,
        description: "طلب تجريبي مكتمل"
      }
    },
    {
      id: "demo_order_002",
      sessionId: "demo_session_002",
      paymentId: "demo_payment_002",
      status: "paid",
      amount: 49.99,
      currency: "USD",
      customerEmail: "customer@example.com",
      customerName: "فاطمة أحمد",
      items: [demoProducts[1]],
      downloadUrl: "https://example.com/download/course.zip",
      createdAt: lastWeek.toISOString(),
      paidAt: lastWeek.toISOString(),
      metadata: {
        demo: true,
        description: "طلب تجريبي مدفوع"
      }
    },
    {
      id: "demo_order_003",
      sessionId: "demo_session_003",
      status: "pending",
      amount: 39.98,
      currency: "USD",
      customerEmail: "customer@example.com",
      customerName: "محمد علي",
      items: [demoProducts[2]],
      createdAt: now.toISOString(),
      metadata: {
        demo: true,
        description: "طلب تجريبي معلق"
      }
    },
    {
      id: "demo_order_004",
      sessionId: "demo_session_004",
      paymentId: "demo_payment_004",
      status: "completed",
      amount: 99.97,
      currency: "USD",
      customerEmail: "vip@example.com",
      customerName: "سارة خالد",
      items: demoProducts,
      downloadUrl: "https://example.com/download/bundle.zip",
      createdAt: lastWeek.toISOString(),
      paidAt: lastWeek.toISOString(),
      metadata: {
        demo: true,
        description: "طلب تجريبي متعدد المنتجات"
      }
    }
  ];
}

// البحث في الطلبات التجريبية
export function findDemoOrdersByEmail(email: string): Order[] {
  const demoOrders = createDemoOrders();
  return demoOrders.filter(order => 
    order.customerEmail?.toLowerCase() === email.toLowerCase()
  );
}

export function findDemoOrderById(orderId: string): Order | null {
  const demoOrders = createDemoOrders();
  return demoOrders.find(order => order.id === orderId) || null;
}

export function findDemoOrderByPaymentId(paymentId: string): Order | null {
  const demoOrders = createDemoOrders();
  return demoOrders.find(order => order.paymentId === paymentId) || null;
}

