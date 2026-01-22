#!/usr/bin/env node

/**
 * 🧪 سكريپت محاكاة webhook للاختبار المحلي
 * 
 * يدعم:
 * - Ziina webhook simulation
 * - Stripe webhook simulation (للمستقبل)
 * - PayPal webhook simulation (للمستقبل)
 * 
 * الاستخدام:
 * node scripts/simulate-webhook.js --provider ziina --event payment_completed --amount 100 --currency AED
 */

const crypto = require('crypto');
const fetch = require('node-fetch');

// إعدادات افتراضية
const DEFAULT_CONFIG = {
  provider: 'ziina',
  event: 'payment_intent.status.updated',
  amount: 100,
  currency: 'AED',
  baseUrl: 'http://localhost:3000',
  paymentId: null,
  webhookSecret: null
};

/**
 * إنشاء توقيع HMAC-SHA256 للـ webhook
 */
function generateWebhookSignature(payload, secret) {
  if (!secret) return null;
  
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
}

/**
 * إنشاء payload لـ Ziina webhook
 */
function createZiinaPayload(config) {
  const paymentId = config.paymentId || `pi_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  return {
    event: config.event,
    data: {
      id: paymentId,
      status: 'completed',
      amount: config.amount * 100, // تحويل إلى subunit
      currency_code: config.currency,
      currency: config.currency,
      message: `دفع اختبار - ${config.amount} ${config.currency}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        test: true,
        simulation: true,
        timestamp: Date.now()
      }
    },
    created_at: new Date().toISOString()
  };
}

/**
 * إنشاء payload لـ Stripe webhook (للمستقبل)
 */
function createStripePayload(config) {
  const paymentIntentId = config.paymentId || `pi_test_${Math.random().toString(36).substring(7)}`;
  
  return {
    id: `evt_test_${Math.random().toString(36).substring(7)}`,
    object: 'event',
    api_version: '2020-08-27',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: paymentIntentId,
        object: 'payment_intent',
        amount: config.amount * 100,
        currency: config.currency.toLowerCase(),
        status: 'succeeded',
        metadata: {
          test: 'true',
          simulation: 'true'
        }
      }
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null
    },
    type: 'payment_intent.succeeded'
  };
}

/**
 * إرسال webhook إلى الخادم المحلي
 */
async function sendWebhook(config) {
  const payload = config.provider === 'ziina' 
    ? createZiinaPayload(config)
    : createStripePayload(config);
    
  const payloadString = JSON.stringify(payload);
  
  // إنشاء التوقيع إذا كان متاحاً
  const signature = config.webhookSecret 
    ? generateWebhookSignature(payloadString, config.webhookSecret)
    : null;
  
  // تحديد endpoint حسب المزود
  const endpoint = config.provider === 'ziina' 
    ? '/api/ziina-webhook'
    : '/api/webhook';
    
  const url = `${config.baseUrl}${endpoint}`;
  
  // إعداد headers
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': `webhook-simulator/${config.provider}`
  };
  
  if (signature) {
    if (config.provider === 'ziina') {
      headers['ziina-signature'] = `sha256=${signature}`;
    } else if (config.provider === 'stripe') {
      headers['stripe-signature'] = `t=${Math.floor(Date.now() / 1000)},v1=${signature}`;
    }
  }
  
  console.log('🚀 Sending webhook...');
  console.log('📍 URL:', url);
  console.log('🔐 Signature:', signature ? 'Present' : 'None');
  console.log('📦 Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: payloadString
    });
    
    const responseText = await response.text();
    
    console.log('✅ Response Status:', response.status);
    console.log('📨 Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('📄 Response Body:', responseText);
    
    if (response.ok) {
      console.log('🎉 Webhook sent successfully!');
    } else {
      console.log('❌ Webhook failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('💥 Error sending webhook:', error.message);
  }
}

/**
 * تحليل arguments من command line
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    
    if (key && value) {
      config[key] = value;
    }
  }
  
  // تحويل amount إلى رقم
  config.amount = parseFloat(config.amount);
  
  return config;
}

/**
 * عرض تعليمات الاستخدام
 */
function showUsage() {
  console.log(`
🧪 Webhook Simulator for Payment Testing

Usage:
  node scripts/simulate-webhook.js [options]

Options:
  --provider     Payment provider (ziina, stripe, paypal) [default: ziina]
  --event        Event type [default: payment_intent.status.updated]
  --amount       Payment amount [default: 100]
  --currency     Currency code [default: AED]
  --baseUrl      Server base URL [default: http://localhost:3000]
  --paymentId    Custom payment ID [default: auto-generated]
  --webhookSecret Webhook secret for signature [default: from env]

Examples:
  # Basic Ziina webhook
  node scripts/simulate-webhook.js

  # Custom amount and currency
  node scripts/simulate-webhook.js --amount 250 --currency SAR

  # With webhook secret
  node scripts/simulate-webhook.js --webhookSecret your_secret_here

  # Stripe webhook (future)
  node scripts/simulate-webhook.js --provider stripe --amount 50 --currency usd

Environment Variables:
  ZIINA_WEBHOOK_SECRET    - Ziina webhook secret
  STRIPE_WEBHOOK_SECRET   - Stripe webhook secret
  WEBHOOK_BASE_URL        - Override base URL
`);
}

/**
 * الدالة الرئيسية
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }
  
  const config = parseArguments();
  
  // استخدام متغيرات البيئة إذا لم يتم تحديد webhook secret
  if (!config.webhookSecret) {
    if (config.provider === 'ziina') {
      config.webhookSecret = process.env.ZIINA_WEBHOOK_SECRET;
    } else if (config.provider === 'stripe') {
      config.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    }
  }
  
  // استخدام base URL من البيئة إذا متاح
  if (process.env.WEBHOOK_BASE_URL) {
    config.baseUrl = process.env.WEBHOOK_BASE_URL;
  }
  
  console.log('⚙️ Configuration:');
  console.log('  Provider:', config.provider);
  console.log('  Event:', config.event);
  console.log('  Amount:', config.amount, config.currency);
  console.log('  Base URL:', config.baseUrl);
  console.log('  Webhook Secret:', config.webhookSecret ? 'Configured' : 'None');
  console.log('');
  
  await sendWebhook(config);
}

// تشغيل السكريپت
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  sendWebhook,
  createZiinaPayload,
  createStripePayload,
  generateWebhookSignature
};

