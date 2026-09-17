import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import {
  getActivePendingOrder,
  createOrder,
  updateOrderStatus,
  getOrderByPaymentId
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const COOKIE_NAME = 'zlost_session_id';

app.use(express.json());
app.use(cookieParser());

function getOrSetSessionId(req, res) {
  let sessionId = req.cookies[COOKIE_NAME];
  if (!sessionId || typeof sessionId !== 'string' || sessionId.length < 10) {
    sessionId = crypto.randomUUID();
    res.cookie(COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  return sessionId;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/payment/checkout', async (req, res) => {
  try {
    const sessionId = getOrSetSessionId(req, res);

    // 1. Check for active pending payment linked to this session
    const activeOrder = getActivePendingOrder(sessionId);
    if (activeOrder && activeOrder.confirmation_url) {
      return res.redirect(302, activeOrder.confirmation_url);
    }

    // 2. Validate merchant credentials
    const { YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY, YOOKASSA_RETURN_URL, APP_URL } = process.env;
    if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
      return res.status(500).json({
        error: 'YOOKASSA_SHOP_ID or YOOKASSA_SECRET_KEY is missing in environment configuration'
      });
    }

    const orderId = crypto.randomUUID();
    const idempotenceKey = crypto.randomUUID();
    const returnUrl = YOOKASSA_RETURN_URL || `${APP_URL || 'http://localhost:5173'}/?payment=success`;
    const basicAuth = Buffer.from(`${YOOKASSA_SHOP_ID.trim()}:${YOOKASSA_SECRET_KEY.trim()}`).toString('base64');

    // 3. Request YooKassa payment creation
    const yooResponse = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: {
          value: '1490.00',
          currency: 'RUB'
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: returnUrl
        },
        description: 'Курс «Я и Агрессия»',
        metadata: {
          order_id: orderId,
          session_id: sessionId
        }
      })
    });

    if (!yooResponse.ok) {
      const errorText = await yooResponse.text();
      console.error('[YooKassa Error]', yooResponse.status, errorText);
      return res.status(502).json({
        error: 'Failed to create YooKassa payment',
        status: yooResponse.status,
        details: errorText
      });
    }

    const paymentData = await yooResponse.json();
    const confirmationUrl = paymentData.confirmation?.confirmation_url;
    if (!confirmationUrl) {
      return res.status(502).json({ error: 'YooKassa did not return confirmation_url' });
    }

    // Default expiration: YooKassa expires_at or 1 hour from now
    const expiresAt = paymentData.expires_at
      ? new Date(paymentData.expires_at).toISOString().replace('T', ' ').replace(/\..+/, '')
      : new Date(Date.now() + 60 * 60 * 1000).toISOString().replace('T', ' ').replace(/\..+/, '');

    // 4. Save order to SQLite
    createOrder({
      id: orderId,
      sessionId,
      yookassaPaymentId: paymentData.id,
      amount: 1490.00,
      currency: 'RUB',
      status: paymentData.status,
      confirmationUrl,
      expiresAt
    });

    // 5. Redirect client to payment page
    return res.redirect(302, confirmationUrl);
  } catch (error) {
    console.error('[Checkout Handler Error]', error);
    return res.status(500).json({ error: 'Internal server error during checkout' });
  }
});

app.post('/api/payment/webhook', async (req, res) => {
  try {
    const event = req.body;
    if (!event || event.type !== 'notification' || !event.object) {
      return res.status(400).json({ error: 'Invalid notification payload' });
    }

    const payment = event.object;
    const paymentId = payment.id;
    let actualStatus = payment.status;

    // Verify against YooKassa API
    const { YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY } = process.env;
    if (YOOKASSA_SHOP_ID && YOOKASSA_SECRET_KEY) {
      const basicAuth = Buffer.from(`${YOOKASSA_SHOP_ID.trim()}:${YOOKASSA_SECRET_KEY.trim()}`).toString('base64');
      const verifyRes = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
        headers: { 'Authorization': `Basic ${basicAuth}` }
      });
      if (verifyRes.ok) {
        const verifiedPayment = await verifyRes.json();
        actualStatus = verifiedPayment.status;
      }
    }

    updateOrderStatus(paymentId, actualStatus);

    if (actualStatus === 'succeeded') {
      const order = getOrderByPaymentId(paymentId);
      console.log(`[Payment Succeeded] Order ID: ${order?.id}, Session ID: ${order?.session_id}`);
      // Delivery logic (Telegram bot invite / email dispatch) can be triggered here
    }

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error('[Webhook Error]', error);
    return res.status(500).json({ error: 'Webhook processing failure' });
  }
});

app.listen(PORT, () => {
  console.log(`Zlost payment backend running on http://localhost:${PORT}`);
});
