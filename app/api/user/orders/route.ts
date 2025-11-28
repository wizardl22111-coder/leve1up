import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { findOrdersByCustomerEmail } from "@/lib/orders-store";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * 🔍 API endpoint لجلب طلبات المستخدم الحالي
 * 
 * يتطلب تسجيل الدخول ويجلب جميع الطلبات المرتبطة بإيميل المستخدم
 * 
 * Usage: GET /api/user/orders
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    console.log(`🔍 Fetching orders for user: ${userEmail}`);
    
    // جلب جميع الطلبات للمستخدم
    const orders = await findOrdersByCustomerEmail(userEmail);
    
    if (!orders || orders.length === 0) {
      console.log('📦 No orders found for user');
      return NextResponse.json({
        orders: [],
        message: 'لا توجد طلبات حتى الآن'
      });
    }
    
    console.log(`✅ Found ${orders.length} orders for user`);
    
    // تحويل البيانات إلى التنسيق المطلوب
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      sessionId: order.sessionId,
      paymentId: order.paymentId,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      items: order.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image
      })),
      createdAt: order.createdAt,
      paidAt: order.paidAt
    }));
    
    return NextResponse.json({
      orders: formattedOrders,
      total: formattedOrders.length
    });
    
  } catch (error) {
    console.error('❌ Error in user orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
