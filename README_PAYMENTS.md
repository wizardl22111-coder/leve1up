# 💳 Payment System Documentation - Leve1Up Store

## 🏗️ Architecture Overview

The Leve1Up store uses **Ziina Payment Gateway** as the primary payment provider with a robust webhook-based fulfillment system.

### Key Components:
- **Payment Provider**: Ziina (UAE-based payment gateway)
- **Storage**: Upstash Redis with memory fallback
- **Email**: Resend API for order confirmations
- **File Storage**: Vercel Blob Storage for digital products
- **Authentication**: NextAuth with Google OAuth

---

## 🔄 Payment Flow

### 1. Checkout Initiation
**File**: `app/checkout/page.tsx`
- User enters email and clicks pay
- Product details loaded from `data/products.json`
- Email validation and localStorage persistence

### 2. Payment Intent Creation
**Endpoint**: `POST /api/payment_intent`
**File**: `app/api/payment_intent/route.ts`

```typescript
// Request payload
{
  "amount": 100,
  "currency_code": "AED", 
  "productName": "Digital Product",
  "productFile": "product.zip",
  "customerEmail": "user@example.com"
}
```

**Process**:
1. Generate unique `sessionId` 
2. Convert amount to subunit (×100 for AED, ×1000 for BHD/KWD/OMR)
3. Create Ziina payment intent
4. Save order to Redis with `pending` status
5. Return payment URL to frontend

### 3. Payment Processing
- User redirected to Ziina hosted payment page
- Secure payment processing on Ziina's infrastructure
- No card details touch our servers

### 4. Webhook Notification
**Endpoint**: `POST /api/ziina-webhook`
**File**: `app/api/ziina-webhook/route.ts`

**Security Features**:
- ✅ Webhook signature verification (HMAC-SHA256)
- ✅ Idempotency protection against duplicate events
- ✅ Comprehensive error handling with retry support

**Process**:
1. Verify webhook signature using `ZIINA_WEBHOOK_SECRET`
2. Check for duplicate events (idempotency)
3. Find order by `paymentId`
4. Update order status to `paid`
5. Send confirmation email with download links
6. Generate secure download URLs

### 5. Order Fulfillment
- Email sent via Resend API with Arabic RTL template
- Secure download links generated via `/api/secure-download`
- Order marked as `completed`

---

## 🔧 Environment Variables

### Required for Production

```bash
# Ziina Payment Gateway
ZIINA_SECRET_KEY=zsk_live_xxxxx          # Primary API key
ZIINA_API_KEY=zak_live_xxxxx             # Fallback API key  
ZIINA_MERCHANT_ID=merchant_xxxxx         # Merchant identifier
ZIINA_WEBHOOK_SECRET=whsec_xxxxx         # Webhook signature secret

# Storage
KV_REST_API_URL=https://xxxxx.upstash.io # Upstash Redis URL
KV_REST_API_TOKEN=xxxxx                  # Upstash Redis token
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx  # Vercel Blob storage

# Email
RESEND_API_KEY=re_xxxxx                  # Resend API key

# Authentication  
NEXTAUTH_SECRET=xxxxx                    # NextAuth secret
JWT_SECRET=xxxxx                         # JWT signing secret

# Base Configuration
NEXT_PUBLIC_BASE_URL=https://leve1up.store
```

### Optional/Future

```bash
# Alternative Payment Providers
STRIPE_SECRET=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_SECRET=xxxxx

# Webhook Configuration
WEBHOOK_BASE_URL=https://leve1up.store
PAYMENT_PROVIDER=ziina                   # ziina|stripe|paypal
PAYMENT_RETRY_MAX=3
PAYMENT_RETRY_DELAY=5000
```

---

## 🧪 Local Testing

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Add your test credentials
ZIINA_SECRET_KEY=zsk_test_xxxxx
ZIINA_WEBHOOK_SECRET=whsec_test_xxxxx
RESEND_API_KEY=re_xxxxx
```

### 2. Start Development Server

```bash
npm run dev
# Server runs on http://localhost:3000
```

### 3. Test Payment Flow

#### Option A: Manual Testing
1. Navigate to `/checkout?product=1&name=Test+Product&price=10&currency=AED`
2. Enter test email
3. Use Ziina test card: `4242 4242 4242 4242`
4. Complete payment flow

#### Option B: Webhook Simulation

```bash
# Install dependencies
npm install node-fetch

# Basic webhook test
node scripts/simulate-webhook.js

# Custom amount and currency  
node scripts/simulate-webhook.js --amount 250 --currency SAR

# With webhook secret
node scripts/simulate-webhook.js --webhookSecret whsec_test_xxxxx

# Test signature verification
ZIINA_WEBHOOK_SECRET=whsec_test_xxxxx node scripts/simulate-webhook.js
```

#### Option C: cURL Testing

```bash
# Test webhook without signature (should fail if secret configured)
curl -X POST http://localhost:3000/api/ziina-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment_intent.status.updated",
    "data": {
      "id": "pi_test_123456",
      "status": "completed", 
      "amount": 10000,
      "currency_code": "AED"
    }
  }'

# Test with valid signature
# (Use scripts/simulate-webhook.js for proper signature generation)
```

---

## 🔐 Security Features

### Implemented ✅

1. **Webhook Signature Verification**
   - HMAC-SHA256 signature validation
   - Prevents fake webhook attacks
   - Uses `crypto.timingSafeEqual()` for timing-safe comparison

2. **Idempotency Protection**
   - Prevents duplicate webhook processing
   - In-memory cache with automatic cleanup
   - Event ID tracking

3. **Payment Intent Deduplication**
   - Prevents duplicate payment intents
   - SHA256 hash of payment parameters
   - 30-minute cache window

4. **Secure Download URLs**
   - Time-limited download tokens
   - Domain-based access control
   - No direct file exposure

### Planned 🔄

1. **Rate Limiting**
   - Webhook endpoint protection
   - Payment intent creation limits

2. **Dead Letter Queue**
   - Failed webhook retry mechanism
   - Persistent failure tracking

3. **Audit Logging**
   - Payment event tracking
   - Security event monitoring

---

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add ZIINA_SECRET_KEY
vercel env add ZIINA_WEBHOOK_SECRET
# ... add all required env vars
```

### Webhook Configuration

1. **Ziina Dashboard**:
   - Add webhook URL: `https://leve1up.store/api/ziina-webhook`
   - Select events: `payment_intent.status.updated`
   - Copy webhook secret to `ZIINA_WEBHOOK_SECRET`

2. **Test Webhook**:
   ```bash
   # From Ziina dashboard or using simulator
   node scripts/simulate-webhook.js --baseUrl https://leve1up.store
   ```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Webhook Signature Verification Fails
```bash
# Check webhook secret
echo $ZIINA_WEBHOOK_SECRET

# Test with simulator
node scripts/simulate-webhook.js --webhookSecret $ZIINA_WEBHOOK_SECRET
```

#### 2. Orders Not Found in Webhook
- Check Redis connection: `KV_REST_API_URL` and `KV_REST_API_TOKEN`
- Verify payment ID matching between intent and webhook
- Check order creation logs in payment intent endpoint

#### 3. Email Not Sending
- Verify `RESEND_API_KEY` is valid
- Check email domain verification in Resend dashboard
- Review email sending logs in webhook handler

#### 4. Download Links Not Working
- Check `BLOB_READ_WRITE_TOKEN` configuration
- Verify file exists in Vercel Blob storage
- Test secure download endpoint directly

### Debug Commands

```bash
# Check environment variables
env | grep -E "(ZIINA|RESEND|KV_|BLOB_)"

# Test Redis connection
curl -H "Authorization: Bearer $KV_REST_API_TOKEN" \
  "$KV_REST_API_URL/get/test"

# Test webhook endpoint
curl -X POST http://localhost:3000/api/ziina-webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"test","data":{"id":"test"}}'
```

---

## 📊 Monitoring

### Key Metrics to Track

1. **Payment Success Rate**
   - Successful vs failed payment intents
   - Currency-specific conversion rates

2. **Webhook Delivery**
   - Successful webhook processing
   - Signature verification failures
   - Duplicate event detection

3. **Order Fulfillment**
   - Email delivery success rate
   - Download link generation
   - Customer satisfaction

### Logging

All payment operations include structured logging:

```typescript
console.log("💰 Payment intent created:", paymentIntentId);
console.log("🔐 Webhook signature verified");
console.log("✉️ Email sent successfully:", customerEmail);
console.log("❌ Error processing webhook:", error);
```

---

## 🔄 Future Enhancements

### Short Term
- [ ] Add Stripe payment provider support
- [ ] Implement retry mechanism for failed webhooks
- [ ] Add comprehensive unit tests
- [ ] Create admin dashboard for payment monitoring

### Long Term  
- [ ] Multi-currency pricing optimization
- [ ] Subscription billing support
- [ ] Advanced fraud detection
- [ ] Payment analytics dashboard

---

## 📞 Support

For payment-related issues:

1. **Check logs** in Vercel dashboard
2. **Test webhook** using simulation script
3. **Verify environment** variables are correctly set
4. **Contact Ziina support** for payment gateway issues

**Emergency contacts**:
- Technical: `support@leve1up.store`
- Ziina Support: Available in their dashboard

