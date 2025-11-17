import { NextRequest, NextResponse } from 'next/server';
import { validateDiscountCode, type DiscountValidationResponse } from '@/lib/discount';

// GET - التحقق من صحة كود الخصم
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        {
          valid: false,
          discountPercent: 0,
          message: 'يرجى إدخال كود الخصم'
        } as DiscountValidationResponse,
        { status: 400 }
      );
    }

    // التحقق من صحة الكود
    const validation = validateDiscountCode(code);

    return NextResponse.json(validation, {
      status: validation.valid ? 200 : 400
    });

  } catch (error) {
    console.error('خطأ في التحقق من كود الخصم:', error);
    return NextResponse.json(
      {
        valid: false,
        discountPercent: 0,
        message: 'حدث خطأ أثناء التحقق من كود الخصم'
      } as DiscountValidationResponse,
      { status: 500 }
    );
  }
}

// POST - تطبيق كود الخصم مع حساب التفاصيل
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, products, currency } = body;

    if (!code) {
      return NextResponse.json(
        {
          valid: false,
          discountPercent: 0,
          message: 'يرجى إدخال كود الخصم'
        } as DiscountValidationResponse,
        { status: 400 }
      );
    }

    // التحقق من صحة الكود
    const validation = validateDiscountCode(code);

    if (!validation.valid) {
      return NextResponse.json(validation, { status: 400 });
    }

    // إرجاع تفاصيل الخصم مع الحسابات
    return NextResponse.json({
      ...validation,
      appliedAt: new Date().toISOString(),
      currency: currency || 'SAR'
    });

  } catch (error) {
    console.error('خطأ في تطبيق كود الخصم:', error);
    return NextResponse.json(
      {
        valid: false,
        discountPercent: 0,
        message: 'حدث خطأ أثناء تطبيق كود الخصم'
      } as DiscountValidationResponse,
      { status: 500 }
    );
  }
}
