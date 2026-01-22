# 🎯 Payment System Playbook - Leve1Up Store

## 📋 Quick Reference Guide

### 🚨 Emergency Procedures

#### Payment System Down
1. **Check Ziina Status**: Visit Ziina status page
2. **Verify Environment Variables**: Ensure all keys are valid
3. **Test Webhook Endpoint**: Use simulation script
4. **Check Redis Connection**: Verify Upstash Redis is accessible
5. **Fallback**: Enable maintenance mode if needed

#### Webhook Failures
1. **Check Signature Verification**: Ensure `ZIINA_WEBHOOK_SECRET` is correct
2. **Review Logs**: Check Vercel function logs for errors
3. **Test Manually**: Use webhook simulator to reproduce issue
4. **Retry Failed Orders**: Manually process stuck orders if needed

---

## 🔧 Operational Procedures

### Daily Monitoring Checklist

- [ ] Check payment success rate (target: >95%)
- [ ] Verify webhook delivery success (target: >99%)
- [ ] Monitor email delivery rates
- [ ] Review error logs for anomalies
- [ ] Check Redis storage usage
- [ ] Verify download link generation

### Weekly Tasks

- [ ] Review payment analytics
- [ ] Update test card numbers if needed
- [ ] Check for new Ziina API updates
- [ ] Verify backup procedures
- [ ] Review security logs

### Monthly Tasks

- [ ] Audit payment provider fees
- [ ] Review and update documentation
- [ ] Test disaster recovery procedures
- [ ] Update webhook secrets if required
- [ ] Performance optimization review

---

## 🧪 Testing Procedures

### Pre-Deployment Testing

#### 1. Payment Flow Test
```bash
# Test complete payment flow
npm run test:payment-flow

# Or manual test:
# 1. Go to /checkout?product=1&price=10&currency=AED
# 2. Use test card: 4242 4242 4242 4242
# 3. Verify email received
# 4. Test download link
```

#### 2. Webhook Security Test
```bash
# Test signature verification
node scripts/simulate-webhook.js --webhookSecret wrong_secret
# Should return 401 Unauthorized

# Test valid signature
node scripts/simulate-webhook.js --webhookSecret $ZIINA_WEBHOOK_SECRET
# Should return 200 OK
```

#### 3. Idempotency Test
```bash
# Send same webhook twice
node scripts/simulate-webhook.js --paymentId pi_test_123
node scripts/simulate-webhook.js --paymentId pi_test_123
# Second request should return "already_processed"
```

### Production Testing

#### 1. Smoke Test (After Deployment)
```bash
# Test webhook endpoint
curl -X POST https://leve1up.store/api/ziina-webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"test","data":{"id":"smoke_test"}}'

# Should return 200 with {"received":true}
```

#### 2. End-to-End Test
1. Create test order with small amount (1 AED)
2. Complete payment with test card
3. Verify webhook received and processed
4. Check email delivery
5. Test download link functionality

---

## 🔍 Debugging Guide

### Common Issues & Solutions

#### Issue: "Invalid webhook signature"
**Symptoms**: Webhook returns 401, logs show signature verification failure
**Diagnosis**:
```bash
# Check webhook secret
echo $ZIINA_WEBHOOK_SECRET

# Test with simulator
node scripts/simulate-webhook.js --webhookSecret $ZIINA_WEBHOOK_SECRET
```
**Solutions**:
- Verify webhook secret in Ziina dashboard matches environment variable
- Check for extra spaces or characters in secret
- Ensure webhook URL is correctly configured in Ziina

#### Issue: "Order not found for payment ID"
**Symptoms**: Webhook processes but can't find order
**Diagnosis**:
```bash
# Check Redis connection
curl -H "Authorization: Bearer $KV_REST_API_TOKEN" \
  "$KV_REST_API_URL/keys/order:*"
```
**Solutions**:
- Verify Redis is accessible and contains orders
- Check payment ID matching between intent creation and webhook
- Review order creation logs in payment intent endpoint

#### Issue: "Email not sending"
**Symptoms**: Payment completes but no confirmation email
**Diagnosis**:
```bash
# Check Resend API key
curl -H "Authorization: Bearer $RESEND_API_KEY" \
  "https://api.resend.com/domains"
```
**Solutions**:
- Verify Resend API key is valid
- Check domain verification in Resend dashboard
- Review email template for syntax errors
- Check customer email format

#### Issue: "Download links not working"
**Symptoms**: Email sent but download links return 404
**Diagnosis**:
```bash
# Check Blob storage
curl -H "Authorization: Bearer $BLOB_READ_WRITE_TOKEN" \
  "https://api.vercel.com/v1/blob"
```
**Solutions**:
- Verify Blob storage token is valid
- Check file exists in Vercel Blob storage
- Test secure download endpoint directly
- Review file mapping in products.json

---

## 📊 Monitoring & Alerts

### Key Performance Indicators (KPIs)

#### Payment Metrics
- **Payment Success Rate**: >95%
- **Average Payment Time**: <30 seconds
- **Webhook Processing Time**: <5 seconds
- **Email Delivery Rate**: >98%

#### Technical Metrics
- **API Response Time**: <2 seconds
- **Webhook Signature Verification**: 100%
- **Idempotency Hit Rate**: <5%
- **Error Rate**: <1%

### Alert Thresholds

#### Critical Alerts (Immediate Response)
- Payment success rate drops below 90%
- Webhook endpoint returns >10% errors
- Redis connection failures
- Email delivery rate drops below 90%

#### Warning Alerts (Response within 1 hour)
- Payment success rate drops below 95%
- Webhook processing time >10 seconds
- High idempotency hit rate (>10%)
- Unusual payment patterns

### Monitoring Setup

#### Vercel Analytics
```javascript
// Add to webhook handler
import { track } from '@vercel/analytics';

// Track webhook events
track('webhook_received', {
  provider: 'ziina',
  event: event,
  status: 'success'
});
```

#### Custom Logging
```javascript
// Structured logging for monitoring
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  event: 'payment_completed',
  paymentId: paymentId,
  amount: amount,
  currency: currency,
  processingTime: Date.now() - startTime
}));
```

---

## 🔐 Security Procedures

### Security Checklist

#### Daily
- [ ] Review webhook signature verification logs
- [ ] Check for unusual payment patterns
- [ ] Monitor failed authentication attempts
- [ ] Verify no hardcoded secrets in logs

#### Weekly
- [ ] Audit environment variable access
- [ ] Review payment provider security updates
- [ ] Check for suspicious webhook sources
- [ ] Verify SSL certificate validity

#### Monthly
- [ ] Rotate webhook secrets
- [ ] Update API keys if required
- [ ] Security penetration testing
- [ ] Review access logs

### Incident Response

#### Security Incident Detected
1. **Immediate**: Disable affected webhook endpoints
2. **Assess**: Determine scope and impact
3. **Contain**: Rotate compromised credentials
4. **Investigate**: Review logs and identify root cause
5. **Recover**: Restore service with enhanced security
6. **Learn**: Update procedures to prevent recurrence

#### Data Breach Response
1. **Immediate**: Isolate affected systems
2. **Notify**: Inform relevant stakeholders
3. **Assess**: Determine data exposure scope
4. **Comply**: Follow legal notification requirements
5. **Remediate**: Fix vulnerabilities
6. **Monitor**: Enhanced monitoring post-incident

---

## 🚀 Deployment Procedures

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Webhook endpoints tested
- [ ] Database migrations completed (if any)
- [ ] Monitoring alerts configured
- [ ] Rollback plan prepared

### Deployment Steps

#### 1. Staging Deployment
```bash
# Deploy to staging
vercel --target staging

# Run integration tests
npm run test:integration

# Test webhook with staging URL
node scripts/simulate-webhook.js --baseUrl https://staging.leve1up.store
```

#### 2. Production Deployment
```bash
# Deploy to production
vercel --prod

# Verify deployment
curl https://leve1up.store/api/health

# Test webhook endpoint
node scripts/simulate-webhook.js --baseUrl https://leve1up.store
```

#### 3. Post-Deployment Verification
- [ ] Smoke test payment flow
- [ ] Verify webhook processing
- [ ] Check email delivery
- [ ] Monitor error rates for 30 minutes
- [ ] Confirm all KPIs within normal ranges

### Rollback Procedures

#### Automatic Rollback Triggers
- Error rate >5% for 5 minutes
- Payment success rate <80%
- Webhook endpoint unavailable

#### Manual Rollback Steps
```bash
# Rollback to previous deployment
vercel rollback

# Verify rollback successful
curl https://leve1up.store/api/health

# Test critical functionality
node scripts/simulate-webhook.js
```

---

## 📞 Escalation Procedures

### Level 1: Development Team
**Response Time**: 15 minutes during business hours
**Scope**: Minor issues, configuration problems
**Contact**: Internal team chat

### Level 2: Senior Engineering
**Response Time**: 30 minutes during business hours, 2 hours off-hours
**Scope**: Payment system failures, security incidents
**Contact**: On-call engineer

### Level 3: External Support
**Response Time**: 1 hour during business hours
**Scope**: Payment provider issues, infrastructure failures
**Contacts**:
- Ziina Support: Via dashboard
- Vercel Support: Via dashboard
- Upstash Support: Via dashboard

### Emergency Contacts
- **Technical Lead**: Available 24/7 for critical issues
- **Business Owner**: For business-critical decisions
- **Legal/Compliance**: For security incidents involving customer data

---

## 📚 Knowledge Base

### Useful Commands

```bash
# Check all environment variables
env | grep -E "(ZIINA|RESEND|KV_|BLOB_|NEXTAUTH)"

# Test Redis connection
redis-cli -u $KV_REST_API_URL ping

# Simulate webhook with custom payload
node scripts/simulate-webhook.js --amount 100 --currency SAR

# Check Vercel deployment logs
vercel logs

# Test email delivery
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@leve1up.store","to":"test@example.com","subject":"Test","html":"Test"}'
```

### External Resources

- [Ziina API Documentation](https://docs.ziina.com)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Upstash Redis Documentation](https://docs.upstash.com)
- [Resend API Documentation](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### Internal Documentation

- Payment System Architecture: `README_PAYMENTS.md`
- Security Guidelines: `docs/security.md`
- API Documentation: `docs/api.md`
- Testing Procedures: `docs/testing.md`

