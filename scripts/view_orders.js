import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data/orders.db');

try {
  const db = new Database(dbPath);
  const rows = db.prepare(`
    SELECT id, amount, currency, status, yookassa_payment_id, created_at
    FROM orders
    ORDER BY created_at DESC
  `).all();

  console.log(`\nВсего заказов в orders.db: ${rows.length}\n`);
  if (rows.length > 0) {
    console.table(rows);
  }
} catch (e) {
  console.error('Ошибка чтения БД:', e.message);
}
