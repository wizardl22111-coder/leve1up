import { NextRequest, NextResponse } from "next/server";
import { findOrderBySessionId, findOrderByPaymentId } from "@/lib/orders-store";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * 🔍 API endpoint للبحث عن الطلبات
 * 
 * يدعم البحث بـ:
 * - session ID
 * - payment ID
 * 
 * Usage: GET /api/orders?session=xxx or GET /api/orders?payment_id=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session');
    const paymentId = searchParams.get('payment_id');
    
    console.log('🔍 API Orders search:', { sessionId, paymentId });
    
    let order = null;
    
    // البحث بـ session ID أولاً
    if (sessionId) {
      console.log(`🔍 Searching by session ID: ${sessionId}`);
      order = await findOrderBySessionId(sessionId);
    }
    
    // إذا لم نجد بـ session، نبحث بـ payment ID
    if (!order && paymentId) {
      console.log(`🔍 Searching by payment ID: ${paymentId}`);
      order = await findOrderByPaymentId(paymentId);
    }
    
    if (!order) {
      console.log('❌ Order not found');
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Order found: ${order.id}`);
    
    // تحويل البيانات إلى التنسيق المطلوب لصفحة النجاح
    const orderData = {
      order_id: order.id,
      payment_id: order.paymentId || paymentId || sessionId,
      user_email: order.customerEmail,
      total_amount: order.amount,
      currency: order.currency,
      created_at: order.createdAt,
      products: order.items.map((item: any) => ({
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        download_url: item.downloadUrl,
        category: item.category || (item.downloadUrl ? 'digital' : 'subscriptions')
      }))
    };
    
    return NextResponse.json(orderData);
    
  } catch (error) {
    console.error('❌ Error in orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
