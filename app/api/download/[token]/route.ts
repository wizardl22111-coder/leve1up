import { NextRequest, NextResponse } from 'next/server';
import { findOrderBySessionId } from '@/lib/orders-store';
import products from '@/data/products.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const { searchParams } = new URL(request.url);
    let productId = searchParams.get('product');

    console.log('🔍 Download request - Token:', token, 'Product ID:', productId);

    // Check if order exists using shared store
    const order = await findOrderBySessionId(token);
    
    if (!order) {
      console.log('❌ Order not found for token:', token);
      return new NextResponse(
        JSON.stringify({ 
          error: 'رابط التحميل غير صحيح أو انتهت صلاحيته' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }

    console.log('✅ Order found:', order.id, 'Items count:', order.items?.length);

    // Check if token has expired (if metadata.expiresAt exists)
    const expiresAt = order.metadata?.expiresAt;
    if (expiresAt && Date.now() > expiresAt) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'انتهت صلاحية الرابط. يمكنك طلب رابط جديد من صفحة المنتج.' 
        }),
        { 
          status: 410,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }

    // ✨ إذا كان هناك productId محدد، نبحث عن المنتج في items والحصول على الرابط الصحيح من products.json
    let downloadUrl = order.downloadUrl;
    let productName = order.items?.[0]?.name || 'product';
    
    // إذا لم يتم تمرير productId ولكن هناك منتج واحد في الطلب، استخدم معرفه
    if (!productId && order.items && order.items.length === 1) {
      const singleProduct = order.items[0];
      productId = singleProduct.id?.toString();
      console.log('🔄 No productId provided, using single product ID:', productId);
    }
    
    if (productId && order.items) {
      const orderProduct = order.items.find((item: any) => item.id.toString() === productId);
      
      if (!orderProduct) {
        console.log('❌ Product not found in order. Product ID:', productId);
        return new NextResponse(
          JSON.stringify({ 
            error: 'المنتج المطلوب غير موجود في هذا الطلب' 
          }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }
        );
      }
      
      // البحث عن المنتج في products.json للحصول على الرابط الصحيح
      const productData = products.find((p: any) => p.product_id.toString() === productId);
      
      if (productData) {
        downloadUrl = productData.download_url;
        productName = productData.product_name;
        console.log('✅ Product found in products.json:', productName);
        console.log('✅ Using correct download URL:', downloadUrl);
      } else {
        // استخدم رابط التحميل الخاص بالمنتج من الطلب كـ fallback
        downloadUrl = orderProduct.downloadUrl || orderProduct.image || downloadUrl;
        productName = orderProduct.name;
        console.log('⚠️ Product not found in products.json, using order data');
      }
      
      console.log('✅ Product found:', productName, 'Download URL:', downloadUrl);
    }

    // Get download URL
    if (!downloadUrl) {
      console.log('❌ No download URL available');
      return new NextResponse(
        JSON.stringify({ 
          error: 'رابط التحميل غير متوفر' 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }

    console.log('📥 Fetching file from:', downloadUrl);

    // Fetch the file from Vercel Blob or original URL
    const fileResponse = await fetch(downloadUrl);
    
    if (!fileResponse.ok) {
      console.error('❌ Failed to fetch file. Status:', fileResponse.status);
      throw new Error('Failed to fetch file');
    }

    // Get the file as blob
    const fileBlob = await fileResponse.blob();
    
    console.log('✅ File fetched successfully. Size:', fileBlob.size);
    
    // Create filename from product name (sanitize it)
    // Check if productName already ends with .pdf to avoid duplication
    const sanitizedName = productName.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '');
    const filename = sanitizedName.endsWith('.pdf') ? sanitizedName : `${sanitizedName}.pdf`;

    // Return the file with secure headers
    return new NextResponse(fileBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }
    );
  }
}
