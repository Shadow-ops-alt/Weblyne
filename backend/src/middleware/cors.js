import cors from 'cors';

// Strict allow-list. In dev, default to allowing the Vite origin.
function buildAllowList() {
  const list = new Set();
  if (process.env.FRONTEND_URL) list.add(process.env.FRONTEND_URL);
  if (process.env.CORS_ALLOWED_ORIGINS) {
    process.env.CORS_ALLOWED_ORIGINS
      .split(',').map(s => s.trim()).filter(Boolean).forEach(o => list.add(o));
  }
  if (process.env.NODE_ENV !== 'production') {
    list.add('http://localhost:5173');
    list.add('http://localhost:4173');
    list.add('http://127.0.0.1:5173');
  }
  return list;
}

const ALLOWED = buildAllowList();
const isProd  = process.env.NODE_ENV === 'production';

export const corsMiddleware = cors({
  origin(origin, cb) {
    // No Origin header = server-to-server / curl / SSRF relay attempt.
    // Allow in dev (useful for local API testing), block in production.
    if (!origin) {
      if (!isProd) return cb(null, true);
      return cb(new Error('Origin not allowed: missing Origin header'));
    }
    if (ALLOWED.has(origin)) return cb(null, true);
    return cb(new Error(`Origin not allowed: ${origin}`));
  },
  // SECURITY: credentials:true must NEVER be paired with a wildcard origin.
  // Our origin callback above already enforces an explicit allow-list, so
  // this is safe — but document it explicitly as a reminder.
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
});

