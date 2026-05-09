// Centralised error + 404 handlers.
// SECURITY: never expose internal error messages, stack traces, or
// internal paths to the client — log them server-side only.

export function notFound(_req, res) {
  // Do NOT reflect req.originalUrl — path disclosure vulnerability.
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Zod validation errors — send field paths/messages (user-facing), not raw schema.
  if (err?.name === 'ZodError') {
    const details = (err.issues || []).map(i => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return res.status(400).json({ error: 'Validation failed', details });
  }
  // Postgres unique-violation
  if (err?.code === '23505') {
    return res.status(409).json({ error: 'Already exists' });
  }
  // Multer file errors
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  // CORS rejection (from cors middleware)
  if (err?.message?.startsWith('Origin not allowed')) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const status = typeof err.status === 'number' ? err.status : 500;

  // Log all server errors internally — never send to client.
  if (status >= 500) {
    console.error('[error]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // 4xx: safe to use err.message only when it was explicitly set by our code.
  // Avoid leaking third-party error messages that might contain internal details.
  const safeMessage = err.expose === true ? err.message : 'Request error';
  res.status(status).json({ error: safeMessage });
}
