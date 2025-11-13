import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { findOrdersByCustomerEmail } from '@/lib/orders-store';
import products from '@/data/products.json';

export async function GET(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // جلب طلبات المستخدم
    const orders = await findOrdersByCustomerEmail(session.user.email);
    
    // إثراء بيانات الطلبات بمعلومات المنتجات
    const enrichedOrders = orders.map(order => {
      const enrichedItems = order.items.map(item => {
        const product = products.find(p => p.product_id === item.id);
        return {
          ...item,
          image: product?.product_image || '/images/default-product.jpg',
          name: product?.product_name || item.name
        };
      });

      return {
        ...order,
        items: enrichedItems
      };
    });

    // ترتيب الطلبات حسب تاريخ الإنشاء (الأحدث أولاً)
    const sortedOrders = enrichedOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      orders: sortedOrders
    });

  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الطلبات' },
      { status: 500 }
    );
  }
}
