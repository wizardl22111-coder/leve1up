import { NextRequest, NextResponse } from "next/server";
import { getAllReviews } from "@/lib/reviews-store";

/**
 * 💬 API لجلب جميع التقييمات المعتمدة
 * 
 * GET /api/reviews/all - جلب جميع التقييمات المعتمدة للعرض في الصفحة الرئيسية
 */

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET - جلب جميع التقييمات المعتمدة
 */
export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Fetching all approved reviews for homepage');

    // جلب جميع التقييمات المعتمدة
    const reviews = await getAllReviews(true); // true = معتمدة فقط
    
    console.log(`✅ Found ${reviews.length} approved reviews`);

    return NextResponse.json({
      success: true,
      reviews: reviews,
      count: reviews.length
    });

  } catch (error: any) {
    console.error("❌ Error fetching all reviews:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء جلب التقييمات",
      error: error.message,
      reviews: []
    }, { status: 500 });
  }
}
