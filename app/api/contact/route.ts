import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, message } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني والرسالة مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // إنشاء محتوى HTML للبريد
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رسالة جديدة من صفحة التواصل</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .field-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
            display: block;
          }
          .field-value {
            color: #333;
            word-wrap: break-word;
          }
          .message-field {
            background: #e8f4fd;
            border-left-color: #2196F3;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .timestamp {
            color: #999;
            font-size: 12px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 رسالة جديدة من صفحة التواصل</h1>
          </div>
          
          <div class="content">
            <div class="field">
              <span class="field-label">👤 الاسم الكامل:</span>
              <div class="field-value">${fullName}</div>
            </div>
            
            <div class="field">
              <span class="field-label">📧 البريد الإلكتروني:</span>
              <div class="field-value">${email}</div>
            </div>
            
            ${phone ? `
            <div class="field">
              <span class="field-label">📱 رقم الهاتف:</span>
              <div class="field-value">${phone}</div>
            </div>
            ` : ''}
            
            <div class="field message-field">
              <span class="field-label">💬 الرسالة:</span>
              <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="timestamp">
              📅 تاريخ الإرسال: ${new Date().toLocaleString('ar-SA', {
                timeZone: 'Asia/Riyadh',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          
          <div class="footer">
            <p>هذه الرسالة تم إرسالها من صفحة التواصل في موقع Leve1UP Store</p>
            <p>🌐 <a href="https://leve1up.store">leve1up.store</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال البريد باستخدام Resend
    const data = await resend.emails.send({
      from: 'نظام التواصل <noreply@leve1up.store>',
      to: ['leve1up999q@gmail.com'],
      subject: '📬 رسالة جديدة من صفحة التواصل',
      html: htmlContent,
      replyTo: email, // للرد المباشر على المرسل
    });

    console.log('✅ تم إرسال البريد بنجاح:', data);

    return NextResponse.json(
      { 
        message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً',
        id: data.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ خطأ في إرسال البريد:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى' },
      { status: 500 }
    );
  }
}
