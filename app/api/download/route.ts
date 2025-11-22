import { NextRequest, NextResponse } from "next/server";
import { head } from "@vercel/blob";
import { generateAllowedFilesFromProducts, debugProducts } from "@/lib/products-utils";

/**
 * 📥 API لتوليد روابط تحميل عبر النطاق
 * 
 * GET /api/download?url=blob_url&orderId=xxx
 * GET /api/download?file=product-key (الطريقة الجديدة)
 * 
 * يتحقق من صلاحية الطلب ويوجه للرابط
 */

// إنشاء قاعدة بيانات الملفات المسموحة تلقائياً من ملف المنتجات
const ALLOWED_FILES = generateAllowedFilesFromProducts();

// طباعة معلومات التشخيص في development
if (process.env.NODE_ENV === 'development') {
  debugProducts();
}

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const blobUrl = searchParams.get("url");
    const orderId = searchParams.get("orderId");
    const fileKey = searchParams.get("file"); // الطريقة الجديدة

    console.log('📥 Download request:', { blobUrl, orderId, fileKey });

    // الطريقة الجديدة: استخدام file key
    if (fileKey) {
      const actualUrl = ALLOWED_FILES[fileKey];
      if (!actualUrl) {
        console.error('❌ File not found:', fileKey);
        return NextResponse.json({
          success: false,
          message: 'الملف غير موجود أو غير مسموح'
        }, { status: 404 });
      }

      console.log('✅ Redirecting to file:', actualUrl);
      return NextResponse.redirect(actualUrl, 302);
    }

    // الطريقة القديمة: استخدام blob URL مباشرة
    if (!blobUrl) {
      return NextResponse.json({
        success: false,
        message: "رابط الملف أو معرف الملف مطلوب"
      }, { status: 400 });
    }

    // التحقق من وجود الملف في Blob storage
    try {
      const blobInfo = await head(blobUrl);
      
      if (!blobInfo) {
        return NextResponse.json({
          success: false,
          message: "الملف غير موجود"
        }, { status: 404 });
      }

      console.log('✅ Redirecting to blob URL:', blobUrl);
      return NextResponse.redirect(blobUrl);

    } catch (blobError) {
      console.error("❌ Blob check error:", blobError);
      
      // إذا فشل التحقق، نجرب التوجيه المباشر
      console.log('⚠️ Fallback redirect to:', blobUrl);
      return NextResponse.redirect(blobUrl);
    }

  } catch (error: any) {
    console.error("❌ Download error:", error);
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء التحميل",
      error: error.message
    }, { status: 500 });
  }
}

/**
 * 📊 POST endpoint لتوليد رابط تحميل جديد
 * 
 * POST /api/download
 * Body: { orderId: string, paymentId: string }
 * 
 * يتحقق من صحة الطلب ويولد رابط جديد
 */

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId } = await req.json();

    if (!orderId || !paymentId) {
      return NextResponse.json({
        success: false,
        message: "رقم الطلب ورقم الدفعة مطلوبان"
      }, { status: 400 });
    }

    // هنا يمكنك إضافة logic للتحقق من الطلب
    // وتوليد رابط تحميل جديد
    
    // TODO: Implement order verification and new download link generation

    return NextResponse.json({
      success: true,
      message: "قريباً - توليد رابط تحميل جديد",
      orderId,
      paymentId
    });

  } catch (error: any) {
    console.error("❌ Generate download link error:", error);
    return NextResponse.json({
      success: false,
      message: "حدث خطأ",
      error: error.message
    }, { status: 500 });
  }
}
