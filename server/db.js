import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.resolve(__dirname, '../data');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'orders.db');
export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    yookassa_payment_id TEXT UNIQUE,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'RUB',
    status TEXT NOT NULL,
    confirmation_url TEXT,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_orders_session_status ON orders(session_id, status);
`);

const stmtGetActivePending = db.prepare(`
  SELECT * FROM orders
  WHERE session_id = ? AND status = 'pending' AND expires_at > datetime('now')
  ORDER BY created_at DESC
  LIMIT 1
`);

const stmtCreateOrder = db.prepare(`
  INSERT INTO orders (
    id, session_id, yookassa_payment_id, amount, currency, status, confirmation_url, expires_at, created_at, updated_at
  ) VALUES (
    @id, @sessionId, @yookassaPaymentId, @amount, @currency, @status, @confirmationUrl, @expiresAt, datetime('now'), datetime('now')
  )
`);

const stmtUpdateOrderStatus = db.prepare(`
  UPDATE orders
  SET status = ?, updated_at = datetime('now')
  WHERE yookassa_payment_id = ?
`);

const stmtGetOrderByPaymentId = db.prepare(`
  SELECT * FROM orders
  WHERE yookassa_payment_id = ?
  LIMIT 1
`);

export function getActivePendingOrder(sessionId) {
  return stmtGetActivePending.get(sessionId) || null;
}

export function createOrder({ id, sessionId, yookassaPaymentId, amount, currency = 'RUB', status, confirmationUrl, expiresAt }) {
  return stmtCreateOrder.run({
    id,
    sessionId,
    yookassaPaymentId,
    amount,
    currency,
    status,
    confirmationUrl,
    expiresAt
  });
}

export function updateOrderStatus(yookassaPaymentId, status) {
  return stmtUpdateOrderStatus.run(status, yookassaPaymentId);
}

export function getOrderByPaymentId(yookassaPaymentId) {
  return stmtGetOrderByPaymentId.get(yookassaPaymentId) || null;
}
