import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn('[db] DATABASE_URL is not set. Copy .env.example to .env.');
}

// SECURITY: SSL is required in production.
// PGSSL=true          → SSL on, certificate verified (production default).
// PGSSL=noverify      → SSL on, self-signed cert accepted (staging/dev only).
// PGSSL unset/false   → SSL off (local dev without SSL).
function buildSsl() {
  const v = (process.env.PGSSL || '').toLowerCase();
  if (v === 'true')     return { rejectUnauthorized: true };   // strict — prod
  if (v === 'noverify') return { rejectUnauthorized: false };  // self-signed — dev
  return undefined;                                             // no SSL
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: buildSsl(),
  // Prevent runaway queries and idle connections from holding slots.
  statement_timeout: 30_000,   // 30s max per query
  idle_in_transaction_session_timeout: 60_000,
  connectionTimeoutMillis: 10_000,
});

export const query = (text, params) => pool.query(text, params);
