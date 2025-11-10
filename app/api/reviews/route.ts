import { NextRequest, NextResponse } from "next/server";
import {
  getReviewsByProductId,
  addReview,
  hasUserReviewedProduct,
  getReviewSummary,
} from "@/lib/reviews-store";
import { hasCustomerPurchasedProduct } from "@/lib/orders-store";

/**
 * 💬 API لإدارة التقييمات
 * 
 * GET /api/reviews - جلب جميع التقييمات المعتمدة
 * GET /api/reviews?productId=1 - جلب تقييمات منتج معين
 * POST /api/reviews - إضافة تقييم جديد
 */

// ✅ إجبار dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET - جلب التقييمات
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const includeSummary = searchParams.get("includeSummary") === "true";

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "معرف المنتج مطلوب",
      }, { status: 400 });
    }

    const productIdNum = parseInt(productId);
    if (isNaN(productIdNum)) {
      return NextResponse.json({
        success: false,
        message: "معرف المنتج غير صحيح",
      }, { status: 400 });
    }

    console.log(`🔍 Fetching reviews for product: ${productIdNum}`);

    // جلب تقييمات منتج معين
    const reviews = await getReviewsByProductId(productIdNum, true);
    
    let response: any = {
      success: true,
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        body: review.body,
        authorName: review.authorName || 'مستخدم',
        createdAt: review.createdAt,
        verified: review.verified || false,
        helpful: review.helpful || 0,
      })),
      count: reviews.length,
    };

    // إضافة الملخص إذا طُلب
    if (includeSummary) {
      const summary = await getReviewSummary(productIdNum);
      response.summary = summary;
      console.log(`📊 Review summary: ${summary.totalReviews} reviews, avg: ${summary.averageRating}`);
    }

    console.log(`✅ Found ${reviews.length} reviews for product ${productIdNum}`);

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("❌ Error fetching reviews:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء جلب التقييمات",
      error: error.message,
    }, { status: 500 });
  }
}

/**
 * POST - إضافة تقييم جديد
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      authorEmail,
      authorName,
      rating,
      title,
      reviewBody,
    } = body;

    // 1️⃣ التحقق من البيانات المطلوبة
    if (!productId || !authorEmail || !rating || !title || !reviewBody) {
      return NextResponse.json({
        success: false,
        message: "جميع الحقول مطلوبة",
        details: "يجب تقديم معرف المنتج والبريد الإلكتروني والتقييم والعنوان والمحتوى"
      }, { status: 400 });
    }

    // 2️⃣ التحقق من صحة التقييم (1-5)
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({
        success: false,
        message: "التقييم يجب أن يكون رقماً صحيحاً بين 1 و 5",
      }, { status: 400 });
    }

    // 3️⃣ التحقق من طول النصوص
    if (title.length > 100) {
      return NextResponse.json({
        success: false,
        message: "عنوان التقييم يجب أن يكون أقل من 100 حرف",
      }, { status: 400 });
    }

    if (reviewBody.length > 1000) {
      return NextResponse.json({
        success: false,
        message: "محتوى التقييم يجب أن يكون أقل من 1000 حرف",
      }, { status: 400 });
    }

    // 4️⃣ التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json({
        success: false,
        message: "البريد الإلكتروني غير صحيح",
      }, { status: 400 });
    }

    console.log(`🔍 Checking purchase for email: ${authorEmail}, product: ${productId}`);

    // 5️⃣ التحقق من أن المستخدم اشترى المنتج فعلاً
    const hasPurchased = await hasCustomerPurchasedProduct(authorEmail, parseInt(productId));
    
    if (!hasPurchased) {
      console.log(`❌ User ${authorEmail} has not purchased product ${productId}`);
      return NextResponse.json({
        success: false,
        message: "لا يمكنك تقييم هذا المنتج",
        details: "يجب شراء المنتج أولاً قبل إضافة تقييم"
      }, { status: 403 });
    }

    console.log(`✅ Purchase verified for ${authorEmail} on product ${productId}`);

    // 6️⃣ التحقق من عدم وجود تقييم سابق من نفس المستخدم
    const hasReviewed = await hasUserReviewedProduct(authorEmail, parseInt(productId));
    
    if (hasReviewed) {
      console.log(`❌ User ${authorEmail} already reviewed product ${productId}`);
      return NextResponse.json({
        success: false,
        message: "لقد قمت بتقييم هذا المنتج من قبل",
        details: "يمكن إضافة تقييم واحد فقط لكل منتج"
      }, { status: 409 });
    }

    console.log(`✅ No previous review found, proceeding with review creation`);

    // 7️⃣ إضافة التقييم
    const newReview = await addReview({
      productId: parseInt(productId),
      authorEmail,
      authorName: authorName || 'مستخدم',
      rating: parseInt(rating),
      title: title.trim(),
      body: reviewBody.trim(),
      approved: true, // يمكن تغييرها حسب الحاجة
      verified: true, // تم التحقق من الشراء
    });

    console.log(`🌟 Review created successfully: ${newReview.id}`);

    return NextResponse.json({
      success: true,
      message: "تم إضافة التقييم بنجاح! شكراً لك على مشاركة رأيك.",
      review: {
        id: newReview.id,
        rating: newReview.rating,
        title: newReview.title,
        body: newReview.body,
        authorName: newReview.authorName,
        createdAt: newReview.createdAt,
        verified: newReview.verified,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Error adding review:", error);
    
    return NextResponse.json({
      success: false,
      message: "حدث خطأ أثناء إضافة التقييم",
      details: "يرجى المحاولة مرة أخرى لاحقاً"
    }, { status: 500 });
  }
}
